/**
 * ApiResponse — standard success response wrapper.
 * Every successful controller call returns:
 *   { statusCode, data, message, success: true }
 *
 * Keeps the frontend contract consistent no matter which endpoint
 * is called.
 */
class ApiResponse {
  constructor(statusCode, data, message = "Success") {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400; // true for 2xx/3xx
  }
}

export { ApiResponse };
