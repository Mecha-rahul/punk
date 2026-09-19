import { Router } from "express";
import {
  checkout,
  getMyOrders,
  getOrderById,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
} from "../controllers/order.controller.js";
import { verifyJWT, verifyAdmin } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  checkoutSchema,
  updateStatusSchema,
  idParamSchema,
  adminListOrdersSchema,
} from "../validators/index.js";

const router = Router();

// ─── Customer ────────────────────────────────────────────────────────────────
router.route("/checkout").post(verifyJWT, validate(checkoutSchema), checkout);
router.route("/me").get(verifyJWT, validate(adminListOrdersSchema), getMyOrders);
router.route("/:id").get(verifyJWT, validate(idParamSchema), getOrderById);
router.route("/:id/cancel").post(verifyJWT, validate(idParamSchema), cancelOrder);

// ─── Admin ───────────────────────────────────────────────────────────────────
router.route("/admin/all").get(verifyJWT, verifyAdmin, validate(adminListOrdersSchema), getAllOrders);
router
  .route("/admin/:id/status")
  .patch(verifyJWT, verifyAdmin, validate(idParamSchema), validate(updateStatusSchema), updateOrderStatus);

export default router;
