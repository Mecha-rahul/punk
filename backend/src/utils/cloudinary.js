import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Configure Cloudinary. If missing, it won't crash immediately but will use dummy values
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'mock_name',
  api_key: process.env.CLOUDINARY_API_KEY || 'mock_key',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'mock_secret',
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    
    // Mock upload if Cloudinary is not configured yet
    if (!process.env.CLOUDINARY_CLOUD_NAME) {
      console.log("⚠️ Cloudinary not configured in .env. Mocking upload for testing.");
      if (fs.existsSync(localFilePath)) fs.unlinkSync(localFilePath);
      return { secure_url: "https://via.placeholder.com/150" };
    }

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    
    if (fs.existsSync(localFilePath)) fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    if (fs.existsSync(localFilePath)) fs.unlinkSync(localFilePath);
    console.error("Cloudinary Error:", error);
    return null;
  }
};

export { uploadOnCloudinary };
