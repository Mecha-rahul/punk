import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Wishlist } from "../models/wishlist.model.js";
import { Product } from "../models/product.model.js";

const getOrCreateWishlist = async (userId) => {
  let wishlist = await Wishlist.findOne({ user: userId });
  if (!wishlist) {
    try {
      wishlist = await Wishlist.create({ user: userId, products: [] });
    } catch (err) {
      if (err?.code === 11000) {
        wishlist = await Wishlist.findOne({ user: userId });
      } else {
        throw err;
      }
    }
  }
  return wishlist;
};

/** GET /wishlist — populated product cards. */
const getWishlist = asyncHandler(async (req, res) => {
  const wishlist = await getOrCreateWishlist(req.user._id);
  await wishlist.populate({
    path: "products",
    match: { isDeleted: false },
    select: "name slug basePrice images avgRating numReviews brand",
    populate: { path: "brand", select: "name slug" },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, { wishlist: wishlist.products }, "Wishlist fetched"));
});

/** POST /wishlist/:productId — idempotent add. */
const addToWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.validatedParams;

  const product = await Product.findOne({ _id: productId, isDeleted: false }).select("_id");
  if (!product) throw new ApiError(404, "Product not found");

  const wishlist = await getOrCreateWishlist(req.user._id);
  if (!wishlist.products.some((p) => p.toString() === productId)) {
    wishlist.products.push(productId);
    await wishlist.save();
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { wishlist: wishlist.products }, "Added to wishlist"));
});

/** DELETE /wishlist/:productId */
const removeFromWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.validatedParams;

  const wishlist = await getOrCreateWishlist(req.user._id);
  const before = wishlist.products.length;
  wishlist.products = wishlist.products.filter((p) => p.toString() !== productId);

  if (wishlist.products.length === before) {
    throw new ApiError(404, "Product not in wishlist");
  }

  await wishlist.save();
  return res
    .status(200)
    .json(new ApiResponse(200, { wishlist: wishlist.products }, "Removed from wishlist"));
});

export { getWishlist, addToWishlist, removeFromWishlist };
