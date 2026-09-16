import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
      // e.g. "t-shirts", "hoodies", "accessories"
    },
    sizes: {
      type: [String],
      enum: ["XS", "S", "M", "L", "XL", "XXL"],
      default: [],
    },
    stock: {
      type: Number,
      required: [true, "Stock is required"],
      min: [0, "Stock cannot be negative"],
      default: 0,
    },
    images: {
      // Array of Cloudinary secure_url strings
      // e.g. ["https://res.cloudinary.com/void-studios/..."]
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

// Attach aggregate paginate plugin so you can use .aggregatePaginate()
// on aggregation pipelines — great for filtering + sorting + paginating
// products without multiple round-trips.
productSchema.plugin(mongooseAggregatePaginate);

export const Product = mongoose.model("Product", productSchema);
