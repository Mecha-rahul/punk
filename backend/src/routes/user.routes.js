import { Router } from "express";
import {
  getProfile,
  updateProfile,
  addAddress,
  updateAddress,
  deleteAddress,
  changePassword,
  adminListUsers,
  adminBanUser,
} from "../controllers/user.controller.js";
import { verifyJWT, verifyAdmin } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  updateProfileSchema,
  addAddressSchema,
  changePasswordSchema,
  adminListUsersSchema,
  idParamSchema,
  banUserSchema,
} from "../validators/index.js";

const router = Router();

// ─── Customer ────────────────────────────────────────────────────────────────
router.route("/me").get(verifyJWT, getProfile);
router.route("/me").patch(verifyJWT, validate(updateProfileSchema), updateProfile);
router.route("/me/addresses").post(verifyJWT, validate(addAddressSchema), addAddress);
router
  .route("/me/addresses/:id")
  .patch(verifyJWT, validate(idParamSchema), updateAddress)
  .delete(verifyJWT, validate(idParamSchema), deleteAddress);
router
  .route("/me/password")
  .patch(verifyJWT, validate(changePasswordSchema), changePassword);

// ─── Admin ───────────────────────────────────────────────────────────────────
router.route("/").get(verifyJWT, verifyAdmin, validate(adminListUsersSchema), adminListUsers);
router
  .route("/:id/ban")
  .patch(verifyJWT, verifyAdmin, validate(idParamSchema), validate(banUserSchema), adminBanUser);

export default router;
