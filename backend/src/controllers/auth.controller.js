import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { COOKIE_OPTIONS, PASSWORD_RESET_TOKEN_TTL_MS } from "../constants.js";
import { sendEmail } from "../utils/email.js";
import { sha256, sanitizeUser } from "../utils/helpers.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";

/** Issues a token pair, persists the refresh token on the user, returns both. */
const generateAuthTokens = async (user) => {
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });
  return { accessToken, refreshToken };
};

const setAuthCookies = (res, { accessToken, refreshToken }) =>
  res
    .cookie("accessToken", accessToken, COOKIE_OPTIONS)
    .cookie("refreshToken", refreshToken, COOKIE_OPTIONS);

// ─── POST /auth/register ─────────────────────────────────────────────────────
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    throw new ApiError(409, "User with this email already exists");
  }

  const user = await User.create({ name, email, password, phone });

  const tokens = await generateAuthTokens(user);
  setAuthCookies(res, tokens);

  return res
    .status(201)
    .json(new ApiResponse(201, { user: sanitizeUser(user) }, "User registered successfully"));
});

// ─── POST /auth/login ────────────────────────────────────────────────────────
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email.toLowerCase() }).select(
    "+password +refreshToken"
  );
  if (!user || !(await user.isPasswordCorrect(password))) {
    throw new ApiError(401, "Invalid email or password");
  }

  if (user.isBanned) {
    throw new ApiError(403, "This account has been banned");
  }

  const tokens = await generateAuthTokens(user);
  setAuthCookies(res, tokens);

  return res
    .status(200)
    .json(new ApiResponse(200, { user: sanitizeUser(user) }, "Login successful"));
});

// ─── POST /auth/logout ───────────────────────────────────────────────────────
const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    { $unset: { refreshToken: 1 } },
    { new: true }
  );

  return res
    .status(200)
    .clearCookie("accessToken", COOKIE_OPTIONS)
    .clearCookie("refreshToken", COOKIE_OPTIONS)
    .json(new ApiResponse(200, {}, "Logged out successfully"));
});

// ─── POST /auth/refresh ──────────────────────────────────────────────────────
const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies?.refreshToken || req.body?.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized request — no refresh token");
  }

  let decoded;
  try {
    decoded = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
  } catch (_err) {
    throw new ApiError(401, "Refresh token is invalid or expired");
  }

  const user = await User.findById(decoded._id).select("+refreshToken");
  if (!user || !user.refreshToken) {
    throw new ApiError(401, "Invalid refresh token");
  }

  if (incomingRefreshToken !== user.refreshToken) {
    // Token reuse detected — treat as compromised and revoke.
    user.refreshToken = undefined;
    await user.save({ validateBeforeSave: false });
    throw new ApiError(401, "Refresh token is expired or used");
  }

  const tokens = await generateAuthTokens(user);
  setAuthCookies(res, tokens);

  return res
    .status(200)
    .json(new ApiResponse(200, { user: sanitizeUser(user) }, "Access token refreshed"));
});

// ─── POST /auth/forgot-password ──────────────────────────────────────────────
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email: email.toLowerCase() });

  // Always answer the same way — never leak whether an email is registered.
  const genericResponse = new ApiResponse(
    200,
    {},
    "If that email is registered, a password reset link has been sent"
  );

  if (!user) {
    return res.status(200).json(genericResponse);
  }

  const rawToken = crypto.randomBytes(32).toString("hex");
  user.passwordResetTokenHash = sha256(rawToken);
  user.passwordResetExpires = new Date(Date.now() + PASSWORD_RESET_TOKEN_TTL_MS);
  await user.save({ validateBeforeSave: false });

  const resetPath = `/reset-password?token=${rawToken}`;
  const origin = process.env.FRONTEND_URL || "http://localhost:5173";

  await sendEmail({
    to: user.email,
    subject: "Reset your password",
    text:
      `You requested a password reset. This link expires in 15 minutes.\n\n` +
      `${origin}${resetPath}\n\n` +
      `If you didn't request this, you can ignore this email.`,
  });

  // In non-production (and only there) the raw token is returned so the flow
  // is testable without a mail server. Production relies on the email only.
  if (process.env.NODE_ENV !== "production") {
    genericResponse.data = { resetToken: rawToken };
  }

  return res.status(200).json(genericResponse);
});

// ─── POST /auth/reset-password ───────────────────────────────────────────────
const resetPassword = asyncHandler(async (req, res) => {
  const { token, newPassword } = req.body;

  const user = await User.findOne({
    passwordResetTokenHash: sha256(token),
    passwordResetExpires: { $gt: new Date() },
  }).select("+passwordResetTokenHash +passwordResetExpires");

  if (!user) {
    throw new ApiError(400, "Reset token is invalid or has expired");
  }

  user.password = newPassword; // re-hashed by the pre-save hook
  user.passwordResetTokenHash = undefined;
  user.passwordResetExpires = undefined;
  user.refreshToken = undefined; // force re-login everywhere
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password has been reset successfully"));
});

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  forgotPassword,
  resetPassword,
};
