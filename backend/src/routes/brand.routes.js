import { Router } from "express";
import {
  listBrands,
  createBrand,
  updateBrand,
  deleteBrand,
} from "../controllers/brand.controller.js";
import { verifyJWT, verifyAdmin } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  createBrandSchema,
  updateBrandSchema,
  idParamSchema,
} from "../validators/index.js";

const router = Router();

// ─── Public ──────────────────────────────────────────────────────────────────
router.route("/").get(listBrands);

// ─── Admin ───────────────────────────────────────────────────────────────────
router.route("/").post(verifyJWT, verifyAdmin, validate(createBrandSchema), createBrand);
router
  .route("/:id")
  .patch(verifyJWT, verifyAdmin, validate(idParamSchema), validate(updateBrandSchema), updateBrand)
  .delete(verifyJWT, verifyAdmin, validate(idParamSchema), deleteBrand);

export default router;
