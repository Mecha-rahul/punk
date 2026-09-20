import dotenv from "dotenv";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// Loads backend/.env with a path anchored to this folder (not process.cwd()).
// Import this module FIRST in index.js — ESM evaluates imports in order, so
// this guarantees env vars exist before any module reads them at load time
// (cloudinary.js configures itself from process.env on import).
dotenv.config({ path: join(dirname(fileURLToPath(import.meta.url)), "..", ".env") });
