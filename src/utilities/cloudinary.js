
const cloudinary = require("cloudinary").v2; 
const fs = require("fs");
const path = require("path");
const config = require("../configs/Config")

cloudinary.config({
    cloud_name: config.CLOUD_NAME,
    api_key: config.CLOUD_API_KEY,
    api_secret: config.CLOUD_API_SECRET
})


const uploadToCloudinary = async (filePath) => {
      if(!filePath) {
           return
      }
      try {
        const response = await cloudinary.uploader.upload(filePath, {
            resource_type: "image",
            folder: "uploads",
            public_id: path.parse(filePath).name
        });
        fs.unlinkSync(filePath);
        console.log("delete successfully");
        return response;
      } catch (error) {
          fs.unlinkSync(filePath);
          console.log("deleted successfully");
          console.error("Cloudinary upload failed:", error.message);
          throw error;
      }
}

module.exports = uploadToCloudinary;