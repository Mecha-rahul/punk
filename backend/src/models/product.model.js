import mongoose from "mongoose";

/**
 * Product — catalog item with an embedded variant (SKU) layer.
 * Variants are embedded because they are always read together with the
 * product; each subdoc gets its own _id, which carts/orders reference by `sku`.
 */
const variantSchema = new mongoose.Schema(
  {
    sku: {
      type: String,
      required: true,
      unique: true,
      sparse: true, // sparse so multiple docs without sku don't collide
      trim: true,
    },
    size: {
      type: String,
      required: true,
      trim: true, // "S" | "M" | ... | numeric sizes as strings
    },
    color: {
      type: String,
      required: true,
      trim: true,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    priceOverride: {
      type: Number,
      min: 0,
      default: null, // null → product.basePrice applies
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { _id: true }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      default: "",
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      index: true,
    },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      required: true,
      index: true,
    },
    images: {
      type: [String],
      default: [],
    },
    basePrice: {
      type: Number,
      required: true,
      min: 0,
    },
    variants: {
      type: [variantSchema],
      default: [],
    },
    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },
    collections: {
      // merchandising tags consumed by the storefront: new-arrivals,
      // top-picks, basics, sale…
      type: [String],
      default: [],
      index: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
    avgRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    numReviews: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true }
);

// Filtered listing queries: category + brand + not-deleted
productSchema.index({ category: 1, brand: 1, isDeleted: 1 });

/** Effective price of a variant: priceOverride ?? product.basePrice */
productSchema.methods.priceFor = function (variant) {
  return variant?.priceOverride ?? this.basePrice;
};

/** Finds an embedded variant by sku. */
productSchema.methods.findVariant = function (sku) {
  return this.variants.find((v) => v.sku === sku) || null;
};

/** Finds an embedded variant by its subdoc _id. */
productSchema.methods.findVariantById = function (id) {
  return this.variants.id(id) || null;
};

export const Product = mongoose.model("Product", productSchema);
