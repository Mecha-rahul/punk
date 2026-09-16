import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";

/**
 * verifyJWT — Express middleware that:
 * 1. Reads the access token from httpOnly cookies (or Authorization header
 *    as a Bearer fallback for REST clients like Postman).
 * 2. Verifies and decodes the JWT.
 * 3. Fetches the user from DB (excluding password & refreshToken fields).
 * 4. Attaches the user object to req.user for downstream controllers.
 *
 * Throws 401 if token is missing/invalid.
 */
const verifyJWT = asyncHandler(async (req, _, next) => {
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    throw new ApiError(401, "Unauthorized request — no token provided");
  }

  const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

  const user = await User.findById(decodedToken._id).select(
    "-password -refreshToken"
  );

  if (!user) {
    throw new ApiError(401, "Invalid access token — user not found");
  }

  req.user = user;
  next();
});

/**
 * verifyAdmin — must be used AFTER verifyJWT.
 * Blocks non-admin users from reaching admin-only routes.
 */
const verifyAdmin = asyncHandler(async (req, _, next) => {
  if (req.user?.role !== "admin") {
    throw new ApiError(403, "Forbidden — admin access required");
  }
  next();
});

export { verifyJWT, verifyAdmin };
