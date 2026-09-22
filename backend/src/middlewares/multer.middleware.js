import multer from "multer";
import { randomUUID } from "node:crypto";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// Temp dir anchored to the backend folder (NOT process.cwd()) so uploads
// work no matter where the server was started from.
const TEMP_DIR = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "public", "temp");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, TEMP_DIR)
    },
    filename: function (req, file, cb) {
      // Unique prefix — with multi-file uploads, two files sharing an
      // originalname would write to the same temp path and one would vanish.
      const safeName = file.originalname.replace(/[^\w.\-]+/g, "_");
      cb(null, `${randomUUID()}-${safeName}`)
    }
  })
  
export const upload = multer({ 
    storage, 
})