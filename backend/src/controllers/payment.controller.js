import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Payment } from "../models/payment.model.js";
import { Order } from "../models/order.model.js";
import { InventoryLog } from "../models/inventoryLog.model.js";
import { razorpayConfigured, verifyPaymentSignature, verifyWebhookSignature } from "../utils/razorpay.js";

/**
 * POST /payments/razorpay/order — called by the client right after checkout
 * to start (or restart) the Razorpay order for an existing payment record.
 * Requires Razorpay keys; the checkout response already carries
 * razorpayConfigured so the client knows whether to call this.
 */
const createRazorpayOrderForPayment = asyncHandler(async (req, res) => {
  const { paymentId } = req.body;

  if (!razorpayConfigured()) {
    throw new ApiError(503, "Payment gateway is not configured");
  }

  const payment = await Payment.findById(paymentId).populate("order", "user orderNumber");
  if (!payment) throw new ApiError(404, "Payment not found");

  const order = payment.order;
  if (order.user.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You do not have access to this payment");
  }
  if (["captured", "refunded"].includes(payment.status)) {
    throw new ApiError(400, "This payment is already settled");
  }

  // Dynamic import keeps the SDK lazy; utils exports the configured helper.
  const { default: Razorpay } = await import("razorpay");
  const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  const rzpOrder = await instance.orders.create({
    amount: payment.amount,
    currency: payment.currency,
    receipt: order.orderNumber,
  });

  payment.razorpayOrderId = rzpOrder.id;
  payment.attempts.push({ status: "order_created", detail: rzpOrder.id });
  await payment.save();

  return res.status(201).json(
    new ApiResponse(
      201,
      {
        razorpayOrderId: rzpOrder.id,
        razorpayKeyId: process.env.RAZORPAY_KEY_ID,
        amount: payment.amount,
        currency: payment.currency,
      },
      "Razorpay order created"
    )
  );
});

/**
 * POST /payments/razorpay/verify — client callback after the checkout modal.
 * Verifies the HMAC signature, marks the payment `authorized`, and moves the
 * order to `confirmed`. The webhook remains the final source of truth.
 */
const verifyPayment = asyncHandler(async (req, res) => {
  const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

  if (!razorpayConfigured()) {
    throw new ApiError(503, "Payment gateway is not configured");
  }

  const payment = await Payment.findOne({ razorpayOrderId }).populate("order", "user");
  if (!payment) throw new ApiError(404, "Payment not found for this razorpay order");

  if (payment.order.user.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You do not have access to this payment");
  }

  const valid = verifyPaymentSignature({ razorpayOrderId, razorpayPaymentId, razorpaySignature });
  if (!valid) {
    payment.attempts.push({ status: "verify_failed", detail: razorpayPaymentId });
    await payment.save();
    throw new ApiError(400, "Payment signature verification failed");
  }

  if (payment.status === "captured") {
    // Idempotent: webhook already confirmed it.
    return res.status(200).json(new ApiResponse(200, { paymentId: payment._id, status: payment.status }, "Payment already confirmed"));
  }

  payment.razorpayPaymentId = razorpayPaymentId;
  payment.razorpaySignature = razorpaySignature;
  payment.status = "authorized";
  payment.attempts.push({ status: "verified", detail: razorpayPaymentId });
  await payment.save();

  // Flip the order out of pending_payment if it hasn't been moved yet.
  const order = await Order.findById(payment.order);
  if (order && order.currentStatus === "pending_payment") {
    order.recordStatus("confirmed", "Payment authorized", req.user._id);
    await order.save();
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { paymentId: payment._id, status: payment.status }, "Payment verified"));
});

/**
 * POST /payments/razorpay/webhook — Razorpay's server-to-server callback.
 * Public route (no JWT); authenticated by HMAC signature over the RAW body.
 * Source of truth for: payment.captured / payment.failed / refund.processed.
 */
const razorpayWebhook = asyncHandler(async (req, res) => {
  const signature = req.get("x-razorpay-signature");
  // app.js captures the raw buffer on every json request via express.json({ verify })
  const rawBody = req.rawBody ? req.rawBody.toString() : undefined;

  if (!verifyWebhookSignature({ rawBody, signature })) {
    throw new ApiError(400, "Invalid webhook signature");
  }

  const event = req.body?.event;
  const payload = req.body?.payload;

  // Acknowledge quickly; never leak processing errors to the provider.
  const ack = () => res.status(200).json({ received: true });

  if (event === "payment.captured") {
    const entity = payload?.payment?.entity;
    const payment = await Payment.findOne({ razorpayOrderId: entity?.order_id });
    if (payment) {
      payment.status = "captured";
      payment.razorpayPaymentId = payment.razorpayPaymentId || entity?.id || null;
      payment.attempts.push({ status: "captured", detail: entity?.id || "" });
      await payment.save();

      const order = await Order.findById(payment.order);
      if (order && order.currentStatus === "pending_payment") {
        order.recordStatus("confirmed", "Payment captured (webhook)", null);
        await order.save();
      }
    }
    return ack();
  }

  if (event === "payment.failed") {
    const entity = payload?.payment?.entity;
    const payment = await Payment.findOne({ razorpayOrderId: entity?.order_id });
    if (payment) {
      payment.status = "failed";
      payment.attempts.push({ status: "failed", detail: entity?.error_description || "" });
      await payment.save();
    }
    return ack();
  }

  if (event === "refund.processed") {
    const entity = payload?.refund?.entity;
    const payment = await Payment.findOne({ razorpayPaymentId: entity?.payment_id });
    if (payment) {
      payment.status = "refunded";
      await payment.save();
    }
    return ack();
  }

  return ack(); // unhandled events are accepted and ignored
});

export { createRazorpayOrderForPayment, verifyPayment, razorpayWebhook };
