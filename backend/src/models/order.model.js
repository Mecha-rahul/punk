import mongoose from "mongoose";
import { OrderStatus, LEGAL_ORDER_TRANSITIONS } from "../constants.js";

/**
 * Order — immutable snapshot lines.
 * After creation only `currentStatus` and `statusTimeline` mutate; every other
 * field (items, prices, address, totals) is frozen at checkout time.
 */
const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    name: { type: String, required: true },
    image: { type: String, default: "" },
    sku: { type: String, required: true },
    size: { type: String, required: true },
    color: { type: String, default: "" },
    quantity: { type: Number, required: true, min: 1 },
    priceAtOrder: { type: Number, required: true, min: 0 },
  },
  { _id: true }
);

const statusTimelineSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: OrderStatus,
      required: true,
    },
    note: { type: String, default: "" },
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: true }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    items: {
      type: [orderItemSchema],
      required: true,
      validate: [(v) => v.length > 0, "Order must contain at least one item"],
    },
    shippingAddress: {
      type: {
        label: { type: String, default: "" },
        line1: { type: String, required: true },
        line2: { type: String, default: "" },
        city: { type: String, required: true },
        state: { type: String, required: true },
        pincode: { type: String, required: true },
      },
      required: true,
    },
    couponApplied: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Coupon",
      default: null,
    },
    subtotal: { type: Number, required: true, min: 0 },
    discount: { type: Number, required: true, min: 0, default: 0 },
    shippingFee: { type: Number, required: true, min: 0, default: 0 },
    total: { type: Number, required: true, min: 0 },
    currentStatus: {
      type: String,
      enum: OrderStatus,
      default: "pending_payment",
      index: true,
    },
    statusTimeline: {
      type: [statusTimelineSchema],
      default: [],
    },
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
      default: null,
    },
  },
  { timestamps: true }
);

/** Appends a timeline entry and sets currentStatus in one update. */
orderSchema.methods.recordStatus = function (status, note = "", changedBy = null) {
  this.currentStatus = status;
  this.statusTimeline.push({ status, note, changedBy, timestamp: new Date() });
};

/** Guard used by the admin status endpoint — enforces the legal transition map. */
orderSchema.methods.canTransitionTo = function (nextStatus) {
  return (LEGAL_ORDER_TRANSITIONS[this.currentStatus] || []).includes(nextStatus);
};

export const Order = mongoose.model("Order", orderSchema);
