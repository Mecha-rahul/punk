import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Order } from "../models/order.model.js";
import { Payment } from "../models/payment.model.js";
import { Cart } from "../models/cart.model.js";
import { Product } from "../models/product.model.js";
import { Coupon } from "../models/coupon.model.js";
import { User } from "../models/user.model.js";
import { InventoryLog } from "../models/inventoryLog.model.js";
import { FREE_SHIPPING_THRESHOLD, SHIPPING_FEE, CUSTOMER_CANCELLABLE_STATUSES, LEGAL_ORDER_TRANSITIONS } from "../constants.js";
import { calcCouponDiscount, generateOrderNumber, pagination, ensureFound } from "../utils/helpers.js";
import { razorpayConfigured, createRazorpayOrder } from "../utils/razorpay.js";

// ─── POST /orders/checkout — the core correctness flow ──────────────────────
/**
 * Steps 2–4 and 6 of the design contract run inside ONE MongoDB transaction:
 *   stock revalidation (atomic conditional decrements) → order → payment →
 *   coupon redemption → clear cart.
 * If any step throws, the session aborts and NOTHING is written — no ghost
 * orders, no lost stock. Razorpay order creation and the inventory audit log
 * happen AFTER commit (non-critical, retried/logged on failure).
 */
const checkout = asyncHandler(async (req, res) => {
  const { addressId, couponCode } = req.body;

  const session = await mongoose.startSession();
  let result;
  try {
    await session.withTransaction(async () => {
      // 1. Address must belong to the caller.
      const user = await User.findById(req.user._id).session(session);
      ensureFound(user, "User not found");
      const address = user.addresses.id(addressId);
      if (!address) throw new ApiError(404, "Shipping address not found");

      // 2. Cart must have items.
      const cart = await Cart.findOne({ user: req.user._id }).session(session);
      if (!cart || cart.items.length === 0) throw new ApiError(400, "Cart is empty");

      // 3. Coupon pre-checks (final atomic redemption happens below).
      let coupon = null;
      if (couponCode) {
        coupon = await Coupon.findOne({ code: couponCode }).session(session);
        if (!coupon || !coupon.isActive) throw new ApiError(404, "Coupon not found");
        if (coupon.expiryDate < new Date()) throw new ApiError(400, "Coupon has expired");
        if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) {
          throw new ApiError(400, "Coupon usage limit reached");
        }
      }

      // 4. Revalidate every line and ATOMICALLY decrement stock.
      //    The stock guard lives in the same update as the decrement, so two
      //    concurrent checkouts can never both take the last unit.
      const orderItems = [];
      let subtotal = 0;
      for (const item of cart.items) {
        // eslint-disable-next-line no-await-in-loop
        const product = await Product.findOne({ _id: item.product, isDeleted: false }).session(session);
        if (!product) throw new ApiError(409, "A product in your cart is no longer available");

        const variant = product.findVariant(item.sku);
        if (!variant || !variant.isActive) {
          throw new ApiError(409, `${item.sku} is no longer available`);
        }

        const unitPrice = product.priceFor(variant); // server-side price, never client-sent
        subtotal += unitPrice * item.quantity;

        // eslint-disable-next-line no-await-in-loop
        const decremented = await Product.findOneAndUpdate(
          {
            _id: product._id,
            variants: { $elemMatch: { sku: item.sku, stock: { $gte: item.quantity } } },
          },
          { $inc: { "variants.$.stock": -item.quantity } },
          { new: true, session }
        );
        if (!decremented) {
          throw new ApiError(409, `Insufficient stock for ${item.sku}`);
        }

        orderItems.push({
          product: product._id,
          name: product.name,
          image: product.images[0] || "",
          sku: item.sku,
          size: variant.size,
          color: variant.color,
          quantity: item.quantity,
          priceAtOrder: unitPrice,
        });
      }

      // 5. Totals — computed once, server-side.
      let discount = 0;
      if (coupon) {
        if (subtotal < coupon.minOrderValue) {
          throw new ApiError(400, `This coupon requires a minimum order of ${coupon.minOrderValue}`);
        }
        discount = calcCouponDiscount(coupon, subtotal);
      }
      const afterDiscount = subtotal - discount;
      const shippingFee = afterDiscount >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
      const total = afterDiscount + shippingFee;

      // 6. Order (immutable snapshot) + Payment in the same transaction.
      const [order] = await Order.create(
        [
          {
            orderNumber: generateOrderNumber(),
            user: req.user._id,
            items: orderItems,
            shippingAddress: {
              label: address.label,
              line1: address.line1,
              line2: address.line2,
              city: address.city,
              state: address.state,
              pincode: address.pincode,
            },
            couponApplied: coupon ? coupon._id : null,
            subtotal,
            discount,
            shippingFee,
            total,
            currentStatus: "pending_payment",
            statusTimeline: [
              { status: "pending_payment", note: "Order placed", changedBy: req.user._id, timestamp: new Date() },
            ],
          },
        ],
        { session }
      );

      const [payment] = await Payment.create(
        [
          {
            order: order._id,
            status: "created",
            amount: total * 100, // paise
            currency: "INR",
          },
        ],
        { session }
      );

      order.payment = payment._id;
      await order.save({ session });

      // 7. Atomic coupon redemption (guard re-checks the limit under the txn).
      if (coupon) {
        const redeemed = await Coupon.findOneAndUpdate(
          {
            _id: coupon._id,
            $or: [{ usageLimit: 0 }, { $expr: { $lt: ["$usedCount", "$usageLimit"] } }],
          },
          { $inc: { usedCount: 1 } },
          { new: true, session }
        );
        if (!redeemed) throw new ApiError(400, "Coupon usage limit reached");
      }

      // 8. Clear cart.
      cart.items = [];
      await cart.save({ session });

      result = { order, payment };
    });
  } finally {
    await session.endSession();
  }

  // ── Post-commit: non-critical side effects ──
  if (razorpayConfigured()) {
    try {
      const rzpOrder = await createRazorpayOrder({
        amountInPaise: result.payment.amount,
        receipt: result.order.orderNumber,
      });
      if (rzpOrder) {
        result.payment.razorpayOrderId = rzpOrder.id;
        await result.payment.save();
      }
    } catch (err) {
      console.error("Razorpay order creation failed (checkout still succeeded):", err.message);
    }
  }

  try {
    await InventoryLog.insertMany(
      result.order.items.map((it) => ({
        product: it.product,
        sku: it.sku,
        changeType: "order",
        quantityChange: -it.quantity,
        order: result.order._id,
      }))
    );
  } catch (err) {
    console.error("InventoryLog write failed (order unaffected):", err.message);
  }

  return res.status(201).json(
    new ApiResponse(
      201,
      {
        order: result.order,
        payment: {
          id: result.payment._id,
          status: result.payment.status,
          razorpayOrderId: result.payment.razorpayOrderId,
          razorpayKeyId: process.env.RAZORPAY_KEY_ID || null,
          amount: result.payment.amount,
          currency: result.payment.currency,
        },
        razorpayConfigured: razorpayConfigured(),
      },
      "Order placed"
    )
  );
});

// ─── Queries ─────────────────────────────────────────────────────────────────
const getMyOrders = asyncHandler(async (req, res) => {
  const { page, limit, skip } = pagination(req.validatedQuery, { defaultLimit: 10 });

  const filter = { user: req.user._id };
  if (req.validatedQuery.status) filter.currentStatus = req.validatedQuery.status;

  const [orders, total] = await Promise.all([
    Order.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("payment", "status razorpayPaymentId"),
    Order.countDocuments(filter),
  ]);

  return res.status(200).json(
    new ApiResponse(200, { orders, page, limit, total, totalPages: Math.ceil(total / limit) }, "Orders fetched")
  );
});

const getOrderById = asyncHandler(async (req, res) => {
  const { id } = req.validatedParams;

  const order = await Order.findById(id).populate("payment", "status gateway razorpayPaymentId");
  ensureFound(order, "Order not found");

  const isOwner = order.user.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== "admin") {
    throw new ApiError(403, "You do not have access to this order");
  }

  return res.status(200).json(new ApiResponse(200, { order }, "Order fetched"));
});

// ─── POST /orders/:id/cancel — customer, pre-shipment only, restocks ────────
const cancelOrder = asyncHandler(async (req, res) => {
  const { id } = req.validatedParams;

  const session = await mongoose.startSession();
  let cancelled;
  try {
    await session.withTransaction(async () => {
      // Fresh read inside the txn — guards against a racing admin status change.
      const order = await Order.findById(id).session(session);
      ensureFound(order, "Order not found");

      if (order.user.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You do not have access to this order");
      }
      if (!CUSTOMER_CANCELLABLE_STATUSES.includes(order.currentStatus)) {
        throw new ApiError(400, `Order can no longer be cancelled (status: ${order.currentStatus})`);
      }

      // Restock every line with the same atomic-guard pattern.
      for (const item of order.items) {
        // eslint-disable-next-line no-await-in-loop
        await Product.findOneAndUpdate(
          {
            _id: item.product,
            variants: { $elemMatch: { sku: item.sku } },
          },
          { $inc: { "variants.$.stock": item.quantity } },
          { session }
        );
      }

      order.recordStatus("cancelled", "Cancelled by customer", req.user._id);
      await order.save({ session });
      cancelled = order;
    });
  } finally {
    await session.endSession();
  }

  try {
    await InventoryLog.insertMany(
      cancelled.items.map((it) => ({
        product: it.product,
        sku: it.sku,
        changeType: "restock",
        quantityChange: it.quantity,
        order: cancelled._id,
      }))
    );
  } catch (err) {
    console.error("InventoryLog write failed (cancel unaffected):", err.message);
  }

  return res.status(200).json(new ApiResponse(200, { order: cancelled }, "Order cancelled"));
});

// ─── Admin ───────────────────────────────────────────────────────────────────
const getAllOrders = asyncHandler(async (req, res) => {
  const { page, limit, skip } = pagination(req.validatedQuery, { defaultLimit: 20 });

  const filter = {};
  if (req.validatedQuery.status) filter.currentStatus = req.validatedQuery.status;
  if (req.validatedQuery.user) filter.user = req.validatedQuery.user;

  const [orders, total] = await Promise.all([
    Order.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("user", "name email")
      .populate("payment", "status"),
    Order.countDocuments(filter),
  ]);

  return res.status(200).json(
    new ApiResponse(200, { orders, page, limit, total, totalPages: Math.ceil(total / limit) }, "Orders fetched")
  );
});

/** PATCH /admin/orders/:id/status — validates against the legal transition map. */
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { id } = req.validatedParams;
  const { status, note } = req.body;

  const order = await Order.findById(id);
  ensureFound(order, "Order not found");

  if (!order.canTransitionTo(status)) {
    const allowed = (LEGAL_ORDER_TRANSITIONS[order.currentStatus] || []).join(", ") || "none";
    throw new ApiError(400, `Illegal transition: ${order.currentStatus} → ${status}. Allowed: ${allowed}`);
  }

  order.recordStatus(status, note || "", req.user._id);
  await order.save();

  // Keep the payment record in step with a refund decision.
  if (status === "refunded" && order.payment) {
    await Payment.findByIdAndUpdate(order.payment, { $set: { status: "refunded" } });
  }

  return res.status(200).json(new ApiResponse(200, { order }, "Order status updated"));
});

export { checkout, getMyOrders, getOrderById, cancelOrder, getAllOrders, updateOrderStatus };
