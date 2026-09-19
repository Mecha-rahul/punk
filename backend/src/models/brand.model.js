import mongoose from "mongoose";

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    logoUrl: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export const Brand = mongoose.model("Brand", brandSchema);
