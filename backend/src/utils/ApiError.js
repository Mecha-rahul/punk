/**
 * ApiError — extends the native Error class so every operational error
 * the server throws has a consistent shape:
 *   { statusCode, message, errors[], success: false, stack }
 *
 * The global error handler in app.js reads this shape and sends it
 * as a JSON response.
 */
class ApiError extends Error {
  constructor(
    statusCode,
    message = "Something went wrong",
    errors = [],
    stack = ""
  ) {
    super(message);
    this.statusCode = statusCode;
    this.data = null;
    this.message = message;
    this.success = false;
    this.errors = errors;

    // Preserve original stack trace when one is passed (e.g. from catch block)
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiError };
