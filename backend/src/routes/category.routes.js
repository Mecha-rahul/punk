import { Router } from "express";
import {
  getTree,
  getBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/category.controller.js";
import { verifyJWT, verifyAdmin } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  createCategorySchema,
  updateCategorySchema,
  slugParamSchema,
  idParamSchema,
} from "../validators/index.js";

const router = Router();

// ─── Public ──────────────────────────────────────────────────────────────────
router.route("/").get(getTree);
router.route("/:slug").get(validate(slugParamSchema), getBySlug);

// ─── Admin ───────────────────────────────────────────────────────────────────
router.route("/").post(verifyJWT, verifyAdmin, validate(createCategorySchema), createCategory);
router
  .route("/:id")
  .patch(verifyJWT, verifyAdmin, validate(idParamSchema), validate(updateCategorySchema), updateCategory)
  .delete(verifyJWT, verifyAdmin, validate(idParamSchema), deleteCategory);

export default router;
