import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Coupon } from "../models/coupon.model.js";
import { Product } from "../models/product.model.js";
import { calcCouponDiscount, pagination, ensureFound } from "../utils/helpers.js";
import { getOrCreateCart } from "./cart.controller.js";

/** Loads a coupon or throws with a specific, client-friendly reason. */
const loadUsableCoupon = async (code) => {
  const coupon = await Coupon.findOne({ code });
  if (!coupon || !coupon.isActive) throw new ApiError(404, "Coupon not found");
  if (coupon.expiryDate < new Date()) throw new ApiError(400, "Coupon has expired");
  if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) {
    throw new ApiError(400, "Coupon usage limit reached");
  }
  return coupon;
};

/** Live, re-validated subtotal of the user's cart (skips dead variants). */
const liveCartSubtotal = async (userId) => {
  const cart = await getOrCreateCart(userId);
  let subtotal = 0;
  for (const item of cart.items) {
    // eslint-disable-next-line no-await-in-loop
    const product = await Product.findById(item.product);
    const variant = product && !product.isDeleted ? product.findVariant(item.sku) : null;
    if (!variant || !variant.isActive) continue;
    subtotal += product.priceFor(variant) * item.quantity;
  }
  return subtotal;
};

/** POST /coupons/validate — { code, cartTotal? } → discount preview. */
const validateCoupon = asyncHandler(async (req, res) => {
  const { code, cartTotal } = req.body;

  const coupon = await loadUsableCoupon(code);
  const subtotal = cartTotal !== undefined ? cartTotal : await liveCartSubtotal(req.user._id);

  if (subtotal < coupon.minOrderValue) {
    throw new ApiError(400, `This coupon requires a minimum order of ${coupon.minOrderValue}`);
  }

  const discount = calcCouponDiscount(coupon, subtotal);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        subtotal,
        discount,
        payable: subtotal - discount,
      },
      "Coupon is valid"
    )
  );
});

// ─── Admin ───────────────────────────────────────────────────────────────────
const createCoupon = asyncHandler(async (req, res) => {
  const exists = await Coupon.findOne({ code: req.body.code });
  if (exists) throw new ApiError(409, "A coupon with this code already exists");

  const coupon = await Coupon.create(req.body);
  return res.status(201).json(new ApiResponse(201, { coupon }, "Coupon created"));
});

const listCoupons = asyncHandler(async (req, res) => {
  const { page, limit, skip } = pagination(req.validatedQuery, { defaultLimit: 20 });

  const [coupons, total] = await Promise.all([
    Coupon.find({}).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Coupon.countDocuments({}),
  ]);

  return res.status(200).json(
    new ApiResponse(200, { coupons, page, limit, total, totalPages: Math.ceil(total / limit) }, "Coupons fetched")
  );
});

/** PATCH /coupons/:id/expire — soft-disables without touching redemption history. */
const expireCoupon = asyncHandler(async (req, res) => {
  const { id } = req.validatedParams;

  const coupon = await Coupon.findByIdAndUpdate(
    id,
    { $set: { isActive: false } },
    { new: true }
  );
  ensureFound(coupon, "Coupon not found");

  return res.status(200).json(new ApiResponse(200, { coupon }, "Coupon deactivated"));
});

export { validateCoupon, createCoupon, listCoupons, expireCoupon };
