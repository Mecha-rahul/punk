import multer from "multer";

// Keep uploads in memory and stream them straight to Cloudinary. This avoids
// relying on an ephemeral filesystem, which is a common cause of first-upload
// failures on container hosts such as Railway.
const imageTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"]);

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024, files: 3 },
  fileFilter: (_req, file, cb) => {
    if (imageTypes.has(file.mimetype)) return cb(null, true);
    // statusCode routes this through the error handler as a clean 415
    // (not the generic 500) — see errorHandler.middleware.js.
    const err = new Error("Only JPEG, PNG, WebP, GIF, and AVIF images are supported");
    err.statusCode = 415;
    return cb(err);
  },
});
