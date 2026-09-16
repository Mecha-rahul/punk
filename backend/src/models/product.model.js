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
    },
    sizes: {
      type: [String],
      enum: [ "S", "M", "L", ],
      default: [],
    },
    stock: {
      type: Number,
      required: [true, "Stock is required"],
      min: [0, "Stock cannot be negative"],
      default: 0,
    },
    images: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);


productSchema.plugin(mongooseAggregatePaginate);

export const Product = mongoose.model("Product", productSchema);
