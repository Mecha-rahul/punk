import { Router } from "express";
import {
  listProducts,
  getProductBySlug,
  getRelated,
  createProduct,
  updateProduct,
  softDeleteProduct,
  uploadImages,
  removeImage,
} from "../controllers/product.controller.js";
import { verifyJWT, verifyAdmin } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
  createProductSchema,
  updateProductSchema,
  listProductsSchema,
  idParamSchema,
  slugParamSchema,
  removeProductImageSchema,
} from "../validators/index.js";

const router = Router();

// ─── Public ──────────────────────────────────────────────────────────────────
router.route("/").get(validate(listProductsSchema), listProducts);
router.route("/:slug").get(validate(slugParamSchema), getProductBySlug);
router.route("/:id/related").get(validate(idParamSchema), getRelated);

// ─── Admin ───────────────────────────────────────────────────────────────────
router
  .route("/")
  .post(verifyJWT, verifyAdmin, upload.array("images", 3), validate(createProductSchema), createProduct);
router
  .route("/:id")
  .patch(verifyJWT, verifyAdmin, validate(idParamSchema), validate(updateProductSchema), updateProduct)
  .delete(verifyJWT, verifyAdmin, validate(idParamSchema), softDeleteProduct);
router
  .route("/:id/images")
  .post(verifyJWT, verifyAdmin, upload.array("images", 3), validate(idParamSchema), uploadImages)
  .delete(verifyJWT, verifyAdmin, validate(removeProductImageSchema), removeImage);

export default router;
