import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Review } from "../models/review.model.js";
import { Product } from "../models/product.model.js";
import { Order } from "../models/order.model.js";
import { pagination, ensureFound } from "../utils/helpers.js";

/** Recomputes avgRating/numReviews on the product after any review write. */
const recomputeProductRating = async (productId) => {
  const [stats] = await Review.aggregate([
    { $match: { product: new mongoose.Types.ObjectId(productId) } },
    {
      $group: {
        _id: "$product",
        avgRating: { $avg: "$rating" },
        numReviews: { $sum: 1 },
      },
    },
  ]);

  await Product.findByIdAndUpdate(productId, {
    $set: {
      avgRating: stats ? Math.round(stats.avgRating * 10) / 10 : 0,
      numReviews: stats ? stats.numReviews : 0,
    },
  });
};

/** True when the user has a delivered order containing this product. */
const hasDeliveredOrderWithProduct = async (userId, productId) => {
  const order = await Order.exists({
    user: userId,
    currentStatus: "delivered",
    "items.product": productId,
  });
  return Boolean(order);
};

/** GET /reviews/product/:productId */
const getProductReviews = asyncHandler(async (req, res) => {
  const { productId } = req.validatedParams; // set by productIdParamSchema
  const { page, limit, skip } = pagination(req.validatedQuery, { defaultLimit: 10 });

  const filter = { product: productId };

  const [reviews, total] = await Promise.all([
    Review.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("user", "name username"),
    Review.countDocuments(filter),
  ]);

  return res.status(200).json(
    new ApiResponse(200, { reviews, page, limit, total, totalPages: Math.ceil(total / limit) }, "Reviews fetched")
  );
});

/**
 * POST /reviews/:productId — create or update the caller's single review.
 * verifiedPurchase is computed server-side; product aggregates are refreshed.
 */
const addReview = asyncHandler(async (req, res) => {
  const { productId } = req.validatedParams;
  const { rating, comment } = req.body;

  const product = await Product.findOne({ _id: productId, isDeleted: false }).select("_id");
  if (!product) throw new ApiError(404, "Product not found");

  const verifiedPurchase = await hasDeliveredOrderWithProduct(req.user._id, productId);

  const review = await Review.findOneAndUpdate(
    { product: productId, user: req.user._id },
    { $set: { rating, comment: comment || "", verifiedPurchase } },
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
  );

  await recomputeProductRating(productId);

  return res
    .status(201)
    .json(new ApiResponse(201, { review }, "Review saved"));
});

/** PATCH /reviews/:id — owner or admin. */
const updateReview = asyncHandler(async (req, res) => {
  const { id } = req.validatedParams;
  const { rating, comment } = req.body;

  const review = await Review.findById(id);
  ensureFound(review, "Review not found");

  const isOwner = review.user.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== "admin") {
    throw new ApiError(403, "You can only edit your own reviews");
  }

  if (rating !== undefined) review.rating = rating;
  if (comment !== undefined) review.comment = comment;
  await review.save();

  await recomputeProductRating(review.product);

  return res.status(200).json(new ApiResponse(200, { review }, "Review updated"));
});

/** DELETE /reviews/:id — owner or admin; aggregates recomputed. */
const deleteReview = asyncHandler(async (req, res) => {
  const { id } = req.validatedParams;

  const review = await Review.findById(id);
  ensureFound(review, "Review not found");

  const isOwner = review.user.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== "admin") {
    throw new ApiError(403, "You can only delete your own reviews");
  }

  await review.deleteOne();
  await recomputeProductRating(review.product);

  return res.status(200).json(new ApiResponse(200, {}, "Review deleted"));
});

export { getProductReviews, addReview, updateReview, deleteReview };
