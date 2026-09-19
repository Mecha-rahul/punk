import { Router } from "express";
import {
  validateCoupon,
  createCoupon,
  listCoupons,
  expireCoupon,
} from "../controllers/coupon.controller.js";
import { verifyJWT, verifyAdmin } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  validateCouponSchema,
  createCouponSchema,
  idParamSchema,
} from "../validators/index.js";

const router = Router();

// Customer
router.route("/validate").post(verifyJWT, validate(validateCouponSchema), validateCoupon);

// Admin
router.route("/").post(verifyJWT, verifyAdmin, validate(createCouponSchema), createCoupon);
router.route("/").get(verifyJWT, verifyAdmin, listCoupons);
router
  .route("/:id/expire")
  .patch(verifyJWT, verifyAdmin, validate(idParamSchema), expireCoupon);

export default router;
