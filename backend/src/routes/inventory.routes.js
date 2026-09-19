import { Router } from "express";
import {
  adjustStock,
  getLogsForProduct,
} from "../controllers/inventory.controller.js";
import { verifyJWT, verifyAdmin } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { adjustStockSchema, productIdParamSchema } from "../validators/index.js";

const router = Router();

router
  .route("/adjust")
  .post(verifyJWT, verifyAdmin, validate(adjustStockSchema), adjustStock);
router
  .route("/:productId")
  .get(
    verifyJWT,
    verifyAdmin,
    validate(productIdParamSchema),
    getLogsForProduct
  );

export default router;
