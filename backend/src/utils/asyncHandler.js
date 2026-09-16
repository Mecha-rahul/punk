/**
 * asyncHandler — wraps an async Express route handler so you never
 * have to write try/catch inside every controller.
 *
 * Usage:
 *   router.get("/", asyncHandler(async (req, res) => { ... }))
 *
 * Any thrown error (or rejected promise) is automatically forwarded
 * to Express's global error handler via next(error).
 */
const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch(next);
  };
};

export { asyncHandler };
