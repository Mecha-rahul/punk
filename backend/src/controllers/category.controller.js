import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Category } from "../models/category.model.js";
import { Product } from "../models/product.model.js";
import { generateUniqueSlug } from "../utils/helpers.js";

/** GET /categories — full tree in one query, nested client-ready. */
const getTree = asyncHandler(async (_req, res) => {
  const all = await Category.find({}).sort({ name: 1 }).lean();

  const byId = new Map(all.map((c) => [c._id.toString(), { ...c, children: [] }]));
  const roots = [];
  for (const node of byId.values()) {
    const parentId = node.parentCategory ? node.parentCategory.toString() : null;
    if (parentId && byId.has(parentId)) {
      byId.get(parentId).children.push(node);
    } else {
      roots.push(node);
    }
  }

  return res.status(200).json(new ApiResponse(200, { tree: roots }, "Category tree"));
});

/** GET /categories/:slug — category + immediate children. */
const getBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.validatedParams;

  const category = await Category.findOne({ slug });
  if (!category) throw new ApiError(404, "Category not found");

  const children = await Category.find({ parentCategory: category._id }).sort({ name: 1 });

  return res
    .status(200)
    .json(new ApiResponse(200, { category, children }, "Category fetched"));
});

// ─── Admin ───────────────────────────────────────────────────────────────────
const createCategory = asyncHandler(async (req, res) => {
  const { name, parentCategory } = req.body;

  if (parentCategory) {
    const parent = await Category.findById(parentCategory);
    if (!parent) throw new ApiError(404, "Parent category not found");
  }

  const slug = await generateUniqueSlug(Category, name);
  const category = await Category.create({ name, slug, parentCategory: parentCategory || null });

  return res.status(201).json(new ApiResponse(201, { category }, "Category created"));
});

const updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.validatedParams;
  const { name, parentCategory } = req.body;

  const category = await Category.findById(id);
  if (!category) throw new ApiError(404, "Category not found");

  if (parentCategory !== undefined) {
    if (parentCategory === null) {
      category.parentCategory = null;
    } else {
      if (parentCategory === id) {
        throw new ApiError(400, "A category cannot be its own parent");
      }
      const parent = await Category.findById(parentCategory);
      if (!parent) throw new ApiError(404, "Parent category not found");
      category.parentCategory = parentCategory;
    }
  }

  if (name && name !== category.name) {
    category.name = name;
    category.slug = await generateUniqueSlug(Category, name);
  }

  await category.save();
  return res
    .status(200)
    .json(new ApiResponse(200, { category }, "Category updated"));
});

const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.validatedParams;

  const [hasChildren, productCount] = await Promise.all([
    Category.exists({ parentCategory: id }),
    Product.exists({ category: id, isDeleted: false }),
  ]);

  if (hasChildren) {
    throw new ApiError(409, "Delete or move the child categories first");
  }
  if (productCount) {
    throw new ApiError(409, "Category has products — move them before deleting");
  }

  const deleted = await Category.findByIdAndDelete(id);
  if (!deleted) throw new ApiError(404, "Category not found");

  return res.status(200).json(new ApiResponse(200, {}, "Category deleted"));
});

export { getTree, getBySlug, createCategory, updateCategory, deleteCategory };
