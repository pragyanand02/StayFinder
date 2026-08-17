const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");

dotenv.config();

const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY || process.env.API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET || process.env.API_SECRET;

// Configure Cloudinary if credentials are present
if (cloudName && apiKey && apiSecret) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });
}

/**
 * Uploads an image to Cloudinary or falls back to data URI/mock for local testing
 * @param {String} image - Base64 image string or URL
 * @returns {Promise<Object>} - Cloudinary upload result
 */
const uploadImage = async (image) => {
  try {
    if (!cloudName || !apiKey || !apiSecret) {
      // Graceful fallback for local development without Cloudinary credentials
      return {
        url: image,
        public_id: `local_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        format: "jpeg",
        width: 800,
        height: 600,
      };
    }

    // Remove the data:image/...;base64, prefix if present
    const base64Image = image.includes("base64,")
      ? image.split("base64,")[1]
      : image;

    const result = await cloudinary.uploader.upload(
      `data:image/jpeg;base64,${base64Image}`,
      {
        upload_preset:
          process.env.CLOUDINARY_UPLOAD_PRESET || "stayfinder_uploads",
        resource_type: "auto",
      }
    );

    return {
      url: result.secure_url,
      public_id: result.public_id,
      format: result.format,
      width: result.width,
      height: result.height,
    };
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error.message);
    // If upload fails, return image directly as fallback
    return {
      url: image,
      public_id: `fallback_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      format: "jpeg",
      width: 800,
      height: 600,
    };
  }
};

/**
 * Deletes an image from Cloudinary
 * @param {String} publicId - The public ID of the image to delete
 * @returns {Promise<Object>} - Cloudinary deletion result
 */
const deleteImage = async (publicId) => {
  try {
    if (!cloudName || !apiKey || !apiSecret || publicId.startsWith("local_") || publicId.startsWith("fallback_")) {
      return { result: "ok" };
    }
    return await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error);
    return { result: "error", error: error.message };
  }
};

module.exports = {
  uploadImage,
  deleteImage,
};
