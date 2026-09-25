import "./src/env.js"; // FIRST import — loads .env before any module reads env at load time
import connectDB from "./src/db/index.js";
import { app } from "./src/app.js";

const PORT = process.env.PORT || 8000;

/**
 * Boot sequence:
 * 1. Connect to MongoDB Atlas
 * 2. Optionally seed the catalog (SEED_ON_BOOT=true — idempotent, uses the
 *    live connection, so the deployed DB populates itself on first deploy)
 * 3. Only start the HTTP server if everything above succeeded
 *
 * This prevents the server accepting requests while the DB is still down.
 */
connectDB()
  .then(async () => {
    if (process.env.SEED_ON_BOOT === "true") {
      try {
        const { seed } = await import("./scripts/seed.cjs");
        await seed();
      } catch (err) {
        // Seeding is a convenience — a failure here must not kill the API.
        console.error("⚠ seed-on-boot failed (server still starting):", err.message);
      }
    }
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("💥 Failed to start server:", error.message);
    process.exit(1);
  });
