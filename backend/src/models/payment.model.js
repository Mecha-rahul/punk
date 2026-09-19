import mongoose from "mongoose";
import { PaymentStatus } from "../constants.js";

/**
 * Payment — Razorpay state machine.
 * status: created → authorized → captured | failed | refunded
 * The webhook is the source of truth for final confirmation.
 */
const paymentAttemptSchema = new mongoose.Schema(
  {
    at: { type: Date, default: Date.now },
    status: { type: String, default: "" },
    detail: { type: String, default: "" },
  },
  { _id: true }
);

const paymentSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      unique: true, // 1:1 order↔payment
      index: true,
    },
    gateway: {
      type: String,
      default: "razorpay",
    },
    razorpayOrderId: {
      type: String,
      index: true,
      default: null,
    },
    razorpayPaymentId: {
      type: String,
      default: null,
    },
    razorpaySignature: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: PaymentStatus,
      default: "created",
      index: true,
    },
    amount: {
      type: Number,
      required: true, // in paise
      min: 0,
    },
    currency: {
      type: String,
      default: "INR",
    },
    attempts: {
      type: [paymentAttemptSchema],
      default: [],
    },
  },
  { timestamps: true }
);

export const Payment = mongoose.model("Payment", paymentSchema);
