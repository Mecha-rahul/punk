import { ApiError } from "../utils/ApiError.js";

/**
 * validate(schema) — zod middleware.
 *
 * `schema` is a zod object shaped `{ body?, query?, params? }` (all optional).
 * On success, parsed+coerced values replace req.body and are exposed as
 * req.validatedQuery / req.validatedParams (controllers read those for
 * query/params so they get coerced numbers, not strings).
 * On failure → 422 with per-field messages.
 */
const validate = (schema) => (req, _res, next) => {
  const parsed = schema.safeParse({
    body: req.body ?? {},
    query: req.query ?? {},
    params: req.params ?? {},
  });

  if (!parsed.success) {
    const errors = parsed.error.issues.map((issue) => ({
      path: issue.path.join("."),
      message: issue.message,
    }));
    return next(
      new ApiError(422, errors[0]?.message || "Validation failed", errors)
    );
  }

  // Only overwrite the parts this schema actually defines, so chained
  // validate() calls (params schema + body schema) compose instead of clobber.
  if (schema.shape.body) req.body = parsed.data.body;
  if (schema.shape.query) req.validatedQuery = parsed.data.query;
  if (schema.shape.params) req.validatedParams = parsed.data.params;
  return next();
};

export { validate };
