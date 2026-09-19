import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Product } from "../models/product.model.js";
import { Category } from "../models/category.model.js";
import { Brand } from "../models/brand.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import {
  escapeRegex,
  generateUniqueSlug,
  generateSku,
  pagination,
  ensureFound,
} from "../utils/helpers.js";

// ─── Public ──────────────────────────────────────────────────────────────────

/**
 * GET /products — filtered, sorted, paginated listing.
 * Filters: category slug, brand slug, size, color, price range, search text,
 * featured flag. Sort: newest | price-asc | price-desc | rating.
 */
const listProducts = asyncHandler(async (req, res) => {
  const q = req.validatedQuery;
  const { page, limit, skip } = pagination(q);

  const filter = { isDeleted: false };

  if (q.category) {
    const cat = await Category.findOne({ slug: q.category.toLowerCase() }).select("_id");
    if (!cat) throw new ApiError(404, "Category not found");
    filter.category = cat._id;
  }

  if (q.brand) {
    const brand = await Brand.findOne({ slug: q.brand.toLowerCase() }).select("_id");
    if (!brand) throw new ApiError(404, "Brand not found");
    filter.brand = brand._id;
  }

  if (q.size || q.color) {
    const variantFilter = { isActive: true };
    if (q.size) variantFilter.size = q.size.toUpperCase();
    if (q.color) variantFilter.color = new RegExp(`^${escapeRegex(q.color)}$`, "i");
    filter.variants = { $elemMatch: variantFilter };
  }

  // Price compares against basePrice — priceOverride is a variant-level nuance
  // surfaced on the product page, not a list-filter dimension.
  if (q.minPrice !== undefined || q.maxPrice !== undefined) {
    filter.basePrice = {
      ...(q.minPrice !== undefined && { $gte: q.minPrice }),
      ...(q.maxPrice !== undefined && { $lte: q.maxPrice }),
    };
  }

  if (q.search) {
    const rx = new RegExp(escapeRegex(q.search), "i");
    filter.$or = [{ name: rx }, { description: rx }];
  }

  if (q.featured === "true") filter.isFeatured = true;

  const sortMap = {
    newest: { createdAt: -1 },
    "price-asc": { basePrice: 1 },
    "price-desc": { basePrice: -1 },
    rating: { avgRating: -1, numReviews: -1 },
  };

  const [products, total] = await Promise.all([
    Product.find(filter)
      .sort(sortMap[q.sort] || sortMap.newest)
      .skip(skip)
      .limit(limit)
      .populate("category", "name slug")
      .populate("brand", "name slug"),
    Product.countDocuments(filter),
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      { products, page, limit, total, totalPages: Math.ceil(total / limit) },
      "Products fetched"
    )
  );
});

/** GET /products/:slug */
const getProductBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.validatedParams;

  const product = await Product.findOne({ slug, isDeleted: false })
    .populate("category", "name slug")
    .populate("brand", "name slug logoUrl");
  ensureFound(product, "Product not found");

  return res.status(200).json(new ApiResponse(200, { product }, "Product fetched"));
});

/** GET /products/:id/related — same category, excluding self. */
const getRelated = asyncHandler(async (req, res) => {
  const { id } = req.validatedParams;

  const product = await Product.findById(id).select("category");
  ensureFound(product, "Product not found");

  const related = await Product.find({
    category: product.category,
    _id: { $ne: product._id },
    isDeleted: false,
  })
    .sort({ isFeatured: -1, avgRating: -1 })
    .limit(8)
    .populate("brand", "name slug");

  return res.status(200).json(new ApiResponse(200, { related }, "Related products"));
});

// ─── Admin ───────────────────────────────────────────────────────────────────

const verifyProductRefs = async ({ category, brand }) => {
  const [cat, br] = await Promise.all([
    Category.findById(category),
    Brand.findById(brand),
  ]);
  if (!cat) throw new ApiError(404, "Category not found");
  if (!br) throw new ApiError(404, "Brand not found");
};

/** Assigns auto-SKUs to any variant that didn't provide one. */
const prepareVariants = (productName, variants = []) =>
  variants.map((v) => ({
    ...v,
    sku: v.sku || generateSku(productName, v.size, v.color),
  }));

const createProduct = asyncHandler(async (req, res) => {
  const { name, description, category, brand, basePrice, variants, isFeatured } = req.body;

  await verifyProductRefs({ category, brand });

  const slug = await generateUniqueSlug(Product, name);
  const product = await Product.create({
    name,
    slug,
    description: description || "",
    category,
    brand,
    basePrice,
    variants: prepareVariants(name, variants),
    isFeatured: isFeatured || false,
  });

  return res.status(201).json(new ApiResponse(201, { product }, "Product created"));
});

const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.validatedParams;
  const { name, description, category, brand, basePrice, isFeatured, variants } = req.body;

  const product = await Product.findById(id);
  ensureFound(product, "Product not found");

  if (category && category !== product.category.toString()) await verifyProductRefs({ category, brand: product.brand });
  if (brand && brand !== product.brand.toString()) await verifyProductRefs({ category: product.category, brand });

  if (name && name !== product.name) {
    product.name = name;
    product.slug = await generateUniqueSlug(Product, name);
  }
  if (description !== undefined) product.description = description;
  if (category !== undefined) product.category = category;
  if (brand !== undefined) product.brand = brand;
  if (basePrice !== undefined) product.basePrice = basePrice;
  if (isFeatured !== undefined) product.isFeatured = isFeatured;

  if (variants !== undefined) {
    // Replace semantics: keeps existing SKUs (and their stock) when the same
    // sku reappears, drops variants that are gone, adds new ones with auto-SKU.
    const keep = [];
    for (const v of variants) {
      const existing = v.sku ? product.findVariant(v.sku) : null;
      keep.push(
        existing
          ? Object.assign(existing, {
              size: v.size ?? existing.size,
              color: v.color ?? existing.color,
              stock: v.stock ?? existing.stock,
              priceOverride: v.priceOverride === undefined ? existing.priceOverride : v.priceOverride,
              isActive: v.isActive ?? existing.isActive,
            })
          : { ...v, sku: v.sku || generateSku(name || product.name, v.size, v.color) }
      );
    }
    product.variants = keep;
  }

  await product.save();
  return res.status(200).json(new ApiResponse(200, { product }, "Product updated"));
});

/** DELETE /products/:id — soft delete only; ordered history must survive. */
const softDeleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.validatedParams;

  const product = await Product.findByIdAndUpdate(
    id,
    { $set: { isDeleted: true, isFeatured: false } },
    { new: true }
  );
  ensureFound(product, "Product not found");

  return res.status(200).json(new ApiResponse(200, { product }, "Product deleted"));
});

/**
 * POST /products/:id/images — multipart field `images`.
 * Uploads each file to Cloudinary and appends the URLs to product.images.
 */
const uploadImages = asyncHandler(async (req, res) => {
  const { id } = req.validatedParams;
  const product = await Product.findById(id);
  ensureFound(product, "Product not found");

  const files = req.files || [];
  if (files.length === 0) throw new ApiError(400, "No images provided (field name: `images`)");

  const urls = [];
  for (const file of files) {
    const result = await uploadOnCloudinary(file.path);
    if (!result) {
      throw new ApiError(502, "Image upload to Cloudinary failed");
    }
    urls.push(result.secure_url);
  }

  product.images.push(...urls);
  await product.save();

  return res
    .status(200)
    .json(new ApiResponse(200, { images: product.images }, "Images uploaded"));
});

export {
  listProducts,
  getProductBySlug,
  getRelated,
  createProduct,
  updateProduct,
  softDeleteProduct,
  uploadImages,
};
