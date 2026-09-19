import { Router } from "express";
import {
  getProductReviews,
  addReview,
  updateReview,
  deleteReview,
} from "../controllers/review.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  reviewSchema,
  reviewUpdateSchema,
  productIdParamSchema,
  idParamSchema,
} from "../validators/index.js";

const router = Router();

// Public
router.route("/product/:productId").get(validate(productIdParamSchema), getProductReviews);

// Customer (owner)
router.route("/:productId").post(verifyJWT, validate(productIdParamSchema), validate(reviewSchema), addReview);
router
  .route("/:id")
  .patch(verifyJWT, validate(idParamSchema), validate(reviewUpdateSchema), updateReview)
  .delete(verifyJWT, validate(idParamSchema), deleteReview);

export default router;
