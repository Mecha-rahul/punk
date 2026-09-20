import multer from "multer";
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
      
      cb(null, file.originalname)
    }
  })
  
export const upload = multer({ 
    storage, 
})