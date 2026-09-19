import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Brand } from "../models/brand.model.js";
import { Product } from "../models/product.model.js";
import { generateUniqueSlug } from "../utils/helpers.js";

/** GET /brands */
const listBrands = asyncHandler(async (_req, res) => {
  const brands = await Brand.find({}).sort({ name: 1 });
  return res.status(200).json(new ApiResponse(200, { brands }, "Brands fetched"));
});

// ─── Admin ───────────────────────────────────────────────────────────────────
const createBrand = asyncHandler(async (req, res) => {
  const { name, logoUrl } = req.body;

  const slug = await generateUniqueSlug(Brand, name);
  const brand = await Brand.create({ name, slug, logoUrl: logoUrl || "" });

  return res.status(201).json(new ApiResponse(201, { brand }, "Brand created"));
});

const updateBrand = asyncHandler(async (req, res) => {
  const { id } = req.validatedParams;
  const { name, logoUrl } = req.body;

  const brand = await Brand.findById(id);
  if (!brand) throw new ApiError(404, "Brand not found");

  if (name && name !== brand.name) {
    brand.name = name;
    brand.slug = await generateUniqueSlug(Brand, name);
  }
  if (logoUrl !== undefined) brand.logoUrl = logoUrl;

  await brand.save();
  return res.status(200).json(new ApiResponse(200, { brand }, "Brand updated"));
});

const deleteBrand = asyncHandler(async (req, res) => {
  const { id } = req.validatedParams;

  const productCount = await Product.exists({ brand: id, isDeleted: false });
  if (productCount) {
    throw new ApiError(409, "Brand has products — move them before deleting");
  }

  const deleted = await Brand.findByIdAndDelete(id);
  if (!deleted) throw new ApiError(404, "Brand not found");

  return res.status(200).json(new ApiResponse(200, {}, "Brand deleted"));
});

export { listBrands, createBrand, updateBrand, deleteBrand };
