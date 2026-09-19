import mongoose from "mongoose";
import { InventoryChangeType } from "../constants.js";

/**
 * InventoryLog (phase-2 audit trail) — every stock mutation writes one line.
 * product+sku identify the variant; quantityChange is signed (+/-).
 */
const inventoryLogSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },
    sku: {
      type: String,
      required: true,
    },
    changeType: {
      type: String,
      enum: InventoryChangeType,
      required: true,
    },
    quantityChange: {
      type: Number,
      required: true,
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      default: null, // set only for changeType "order"
    },
    adjustedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null, // admin who made a manual adjustment
    },
  },
  { timestamps: true }
);

export const InventoryLog = mongoose.model("InventoryLog", inventoryLogSchema);
