import {v2 as cloudinary} from "cloudinary"
import fs from "fs"


cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null
        //upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        // file has been uploaded successfull
        //console.log("file is uploaded on cloudinary ", response.url);
        try { fs.unlinkSync(localFilePath) } catch { /* temp file already gone */ }
        return response;

    } catch (error) {
        // Surface the real Cloudinary error (invalid key, bad cloud name,
        // network…) — a silent null here made uploads undiagnosable.
        console.error("[cloudinary] upload failed:", error?.message || error);
        try { fs.unlinkSync(localFilePath) } catch { /* temp file already gone */ }
        return null;
    }
}



export {uploadOnCloudinary}