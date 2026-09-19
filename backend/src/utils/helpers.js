import crypto from "crypto";
import { ApiError } from "./ApiError.js";

/** URL-safe slug: "Slim-Fit Oxford Shirt!" -> "slim-fit-oxford-shirt" */
export const slugify = (text) =>
  String(text)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

/**
 * Finds the first unused slug for `base` ("oxford", "oxford-2", ...).
 * Race-window note: concurrent creates can still collide — the unique index
 * catches it and the error handler maps it to a 409.
 */
export const generateUniqueSlug = async (model, base) => {
  const clean = base || "item";
  let candidate = clean;
  let counter = 1;
  // eslint-disable-next-line no-await-in-loop
  while (await model.exists({ slug: candidate })) {
    counter += 1;
    candidate = `${clean}-${counter}`;
  }
  return candidate;
};

/** Human-readable, unique-enough order number: "VS-20260918-A3F91C" */
export const generateOrderNumber = () => {
  const d = new Date();
  const ymd =
    `${d.getFullYear()}` +
    `${String(d.getMonth() + 1).padStart(2, "0")}` +
    `${String(d.getDate()).padStart(2, "0")}`;
  const rand = crypto.randomBytes(3).toString("hex").toUpperCase(); // 6 chars
  return `VS-${ymd}-${rand}`;
};

/** Auto-SKU from product name + size + color + random suffix: "OXF-M-NAV-4B2E" */
export const generateSku = (productName, size, color) => {
  const p =
    String(productName)
      .replace(/[^a-zA-Z]/g, "")
      .slice(0, 3)
      .toUpperCase()
      .padEnd(3, "X") || "ITM";
  const s = String(size).replace(/[^a-zA-Z0-9]/g, "").slice(0, 3).toUpperCase() || "STD";
  const c =
    String(color)
      .replace(/[^a-zA-Z]/g, "")
      .slice(0, 3)
      .toUpperCase()
      .padEnd(3, "X") || "NA";
  const rand = crypto.randomBytes(2).toString("hex").toUpperCase();
  return `${p}-${s}-${c}-${rand}`;
};

/** Escapes user input before embedding in a RegExp (prevents regex injection). */
export const escapeRegex = (text) =>
  String(text).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const sha256 = (input) =>
  crypto.createHash("sha256").update(String(input)).digest("hex");

/**
 * Coupon math shared by the coupon validator (preview) and checkout (final),
 * so the two can never disagree.
 */
export const calcCouponDiscount = (coupon, amount) => {
  if (coupon.discountType === "flat") {
    return Math.min(coupon.discountValue, amount);
  }
  return Math.round((amount * coupon.discountValue) / 100);
};

/** Parses ?page&limit with sane bounds and returns skip for Mongo queries. */
export const pagination = (query = {}, { defaultLimit = 12, maxLimit = 60 } = {}) => {
  const page = Math.max(1, Math.floor(Number(query.page) || 1));
  let limit = Math.floor(Number(query.limit) || defaultLimit);
  if (limit < 1) limit = defaultLimit;
  if (limit > maxLimit) limit = maxLimit;
  return { page, limit, skip: (page - 1) * limit };
};

/** Throws 404 when a required document is missing — collapses a common check. */
export const ensureFound = (doc, message = "Resource not found") => {
  if (!doc) throw new ApiError(404, message);
  return doc;
};

/**
 * Strips credential/internal fields before a user doc leaves the server.
 * Works on both hydrated docs and lean objects.
 */
export const sanitizeUser = (user) => {
  if (!user) return null;
  const obj = typeof user.toObject === "function" ? user.toObject() : { ...user };
  delete obj.password;
  delete obj.refreshToken;
  delete obj.passwordResetTokenHash;
  delete obj.passwordResetExpires;
  return obj;
};
