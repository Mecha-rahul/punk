import { Router } from "express";
import {
  getCart,
  addItem,
  updateItem,
  removeItem,
  clearCart,
} from "../controllers/cart.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { addItemSchema, updateItemSchema, skuParamSchema } from "../validators/index.js";

const router = Router();

router.route("/").get(verifyJWT, getCart);
router.route("/items").post(verifyJWT, validate(addItemSchema), addItem);
router
  .route("/items/:sku")
  .patch(verifyJWT, validate(skuParamSchema), validate(updateItemSchema), updateItem)
  .delete(verifyJWT, validate(skuParamSchema), removeItem);
router.route("/").delete(verifyJWT, clearCart);

export default router;
