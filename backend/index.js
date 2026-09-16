import dotenv from "dotenv";
import connectDB from "./src/db/index.js";
import { app } from "./src/app.js";

// Load .env variables before anything else
dotenv.config({ path: "./.env" });

const PORT = process.env.PORT || 8000;

/**
 * Boot sequence:
 * 1. Connect to MongoDB Atlas
 * 2. Only start the HTTP server if DB connection succeeds
 *
 * This prevents the server accepting requests while the DB is still down.
 */
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("💥 Failed to start server:", error.message);
    process.exit(1);
  });
