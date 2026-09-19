import { Router } from "express";
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} from "../controllers/wishlist.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { productIdParamSchema } from "../validators/index.js";

const router = Router();

router.route("/").get(verifyJWT, getWishlist);
router.route("/:productId").post(verifyJWT, validate(productIdParamSchema), addToWishlist);
router.route("/:productId").delete(verifyJWT, validate(productIdParamSchema), removeFromWishlist);

export default router;
