import crypto from "crypto";

/**
 * Razorpay adapter.
 *
 * - Lazily imports the SDK only when keys are configured, so dev/test and the
 *   phase-4 checkout flow (manual confirmation) run without Razorpay at all.
 * - `verifyPaymentSignature` guards the client callback.
 * - `verifyWebhookSignature` guards the webhook — the source of truth for
 *   payment confirmation.
 */

export const razorpayConfigured = () =>
  Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);

const getInstance = async () => {
  if (!razorpayConfigured()) return null;
  const { default: Razorpay } = await import("razorpay");
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
};

/** Creates a Razorpay order. Returns null when Razorpay is not configured. */
export const createRazorpayOrder = async ({ amountInPaise, receipt }) => {
  const instance = await getInstance();
  if (!instance) return null;
  return instance.orders.create({
    amount: amountInPaise,
    currency: "INR",
    receipt,
  });
};

const timingSafeEqualHex = (expected, received) => {
  if (typeof received !== "string" || received.length !== expected.length) {
    return false;
  }
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(received));
};

/** HMAC-SHA256 of `order_id|payment_id` with the key secret (client callback). */
export const verifyPaymentSignature = ({
  razorpayOrderId,
  razorpayPaymentId,
  razorpaySignature,
}) => {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret || !razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
    return false;
  }
  const expected = crypto
    .createHmac("sha256", secret)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest("hex");
  return timingSafeEqualHex(expected, razorpaySignature);
};

/** HMAC-SHA256 of the RAW request body with the webhook secret. */
export const verifyWebhookSignature = ({ rawBody, signature }) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret || !rawBody || !signature) return false;
  const expected = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
  return timingSafeEqualHex(expected, signature);
};
