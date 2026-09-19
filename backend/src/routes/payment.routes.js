import { Router } from "express";
import {
  createRazorpayOrderForPayment,
  verifyPayment,
  razorpayWebhook,
} from "../controllers/payment.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  verifyPaymentSchema,
  paymentCreateSchema,
} from "../validators/index.js";

const router = Router();

// Customer
router
  .route("/razorpay/order")
  .post(verifyJWT, validate(paymentCreateSchema), createRazorpayOrderForPayment);
router.route("/razorpay/verify").post(verifyJWT, validate(verifyPaymentSchema), verifyPayment);

// Razorpay servers — authenticated by HMAC signature over the raw body.
router.route("/razorpay/webhook").post(razorpayWebhook);

export default router;
