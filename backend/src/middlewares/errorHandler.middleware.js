import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";

/**
 * Final error handler — the ONLY place that writes an error response.
 * Normalizes everything into `{ success, message, code, errors, data }`.
 *
 * - ApiError keeps its own status/message (business errors).
 * - Mongoose ValidationError → 422, CastError → 400, duplicate key → 409.
 * - Anything else (unexpected) → 500 with a generic message; the real error
 *   is logged server-side and never leaked to the client.
 */
const errorHandler = (err, _req, res, _next) => {
  let statusCode = err?.statusCode || 500;
  let message = err?.message || "Internal Server Error";
  let errors = Array.isArray(err?.errors) ? err.errors : [];
  const code = err?.code ?? null;

  if (err instanceof mongoose.Error.ValidationError) {
    statusCode = 422;
    message = "Validation failed";
    errors = Object.values(err.errors || {}).map((e) => ({
      path: e.path,
      message: e.message,
    }));
  } else if (err instanceof mongoose.Error.CastError) {
    statusCode = 400;
    message = `Invalid value for "${err.path}"`;
  } else if (err?.code === 11000) {
    statusCode = 409;
    const fields = Object.keys(err.keyValue || {}).join(", ") || "field";
    message = `Duplicate value for ${fields}`;
  }

  if (!(err instanceof ApiError) && statusCode >= 500) {
    message = "Internal Server Error";
  }

  if (statusCode >= 500) {
    // eslint-disable-next-line no-console
    console.error("💥 Unhandled error:", err);
  }

  return res
    .status(statusCode)
    .json({ success: statusCode < 400, message, code, errors, data: null });
};

export { errorHandler };
