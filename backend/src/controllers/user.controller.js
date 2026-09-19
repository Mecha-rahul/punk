import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { escapeRegex, sanitizeUser, pagination } from "../utils/helpers.js";

/**
 * GET /users/me — verifyJWT already attached the sanitized user; return it.
 */
const getProfile = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, { user: req.user }, "Profile fetched"));
});

const updateProfile = asyncHandler(async (req, res) => {
  const { name, phone, username } = req.body;

  if (username) {
    const taken = await User.exists({
      username: username.toLowerCase(),
      _id: { $ne: req.user._id },
    });
    if (taken) throw new ApiError(409, "That username is already taken");
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        ...(name !== undefined && { name }),
        ...(phone !== undefined && { phone }),
        ...(username !== undefined && { username: username.toLowerCase() }),
      },
    },
    { new: true, runValidators: true }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, { user: sanitizeUser(user) }, "Profile updated"));
});

// ─── Addresses ───────────────────────────────────────────────────────────────
const addAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) throw new ApiError(404, "User not found");

  if (user.addresses.length >= 10) {
    throw new ApiError(400, "Address book is full (max 10)");
  }

  const isDefault = req.body.isDefault || user.addresses.length === 0;
  if (isDefault) {
    user.addresses.forEach((a) => {
      a.isDefault = false;
    });
  }

  user.addresses.push({ ...req.body, isDefault });
  await user.save();

  const created = user.addresses[user.addresses.length - 1];
  return res
    .status(201)
    .json(new ApiResponse(201, { addresses: user.addresses, addressId: created._id }, "Address added"));
});

const updateAddress = asyncHandler(async (req, res) => {
  const { id } = req.validatedParams;
  const user = await User.findById(req.user._id);
  const address = user?.addresses.id(id);
  if (!address) throw new ApiError(404, "Address not found");

  const { label, line1, line2, city, state, pincode } = req.body;
  if (label !== undefined) address.label = label;
  if (line1 !== undefined) address.line1 = line1;
  if (line2 !== undefined) address.line2 = line2;
  if (city !== undefined) address.city = city;
  if (state !== undefined) address.state = state;
  if (pincode !== undefined) address.pincode = pincode;

  if (req.body.isDefault === true) {
    user.addresses.forEach((a) => {
      if (a._id.toString() !== id) a.isDefault = false;
    });
    address.isDefault = true;
  }

  await user.save();
  return res
    .status(200)
    .json(new ApiResponse(200, { addresses: user.addresses }, "Address updated"));
});

const deleteAddress = asyncHandler(async (req, res) => {
  const { id } = req.validatedParams;
  const user = await User.findById(req.user._id);
  const address = user?.addresses.id(id);
  if (!address) throw new ApiError(404, "Address not found");

  const wasDefault = address.isDefault;
  address.deleteOne();

  // Promote another address so there is always a default when any remain.
  if (wasDefault && user.addresses.length > 0) {
    user.addresses[0].isDefault = true;
  }

  await user.save();
  return res
    .status(200)
    .json(new ApiResponse(200, { addresses: user.addresses }, "Address deleted"));
});

const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select("+password");
  if (!user || !(await user.isPasswordCorrect(oldPassword))) {
    throw new ApiError(401, "Current password is incorrect");
  }
  if (oldPassword === newPassword) {
    throw new ApiError(400, "New password must be different from the current one");
  }

  user.password = newPassword;
  user.refreshToken = undefined; // force re-login on other devices
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"));
});

// ─── Admin ───────────────────────────────────────────────────────────────────
const adminListUsers = asyncHandler(async (req, res) => {
  const { page, limit, skip } = pagination(req.validatedQuery, { defaultLimit: 20 });
  const { search, role } = req.validatedQuery;

  const filter = {};
  if (role) filter.role = role;
  if (search) {
    const rx = new RegExp(escapeRegex(search), "i");
    filter.$or = [{ name: rx }, { email: rx }, { username: rx }];
  }

  const [users, total] = await Promise.all([
    User.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("-refreshToken -passwordResetTokenHash -passwordResetExpires"),
    User.countDocuments(filter),
  ]);

  return res.status(200).json(
    new ApiResponse(200, { users, page, limit, total, totalPages: Math.ceil(total / limit) }, "Users fetched")
  );
});

const adminBanUser = asyncHandler(async (req, res) => {
  const { id } = req.validatedParams;
  const { isBanned } = req.body;

  if (id === req.user._id.toString()) {
    throw new ApiError(400, "You cannot ban yourself");
  }

  const user = await User.findByIdAndUpdate(
    id,
    { $set: { isBanned } },
    { new: true }
  ).select("-refreshToken");

  if (!user) throw new ApiError(404, "User not found");

  if (isBanned) {
    // Kill the banned user's sessions immediately.
    await User.findByIdAndUpdate(id, { $unset: { refreshToken: 1 } });
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { user: sanitizeUser(user) }, isBanned ? "User banned" : "User unbanned"));
});

export {
  getProfile,
  updateProfile,
  addAddress,
  updateAddress,
  deleteAddress,
  changePassword,
  adminListUsers,
  adminBanUser,
};
