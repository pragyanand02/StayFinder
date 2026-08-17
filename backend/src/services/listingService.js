const Listing = require("../models/Listing");
const Booking = require("../models/Booking");
const { uploadImage } = require("../utils/cloudinary");
const { calculateCarbonFootprint } = require("./carbonService");
const {
  verifyLocationCoordinates,
  checkLocationSafety,
} = require("./locationSafetyService");

const createListingService = async (user, body) => {
  try {
    const { images = [], ...listingData } = body;

    // Verify location safety before creating listing
    if (listingData.location) {
      let latitude = 25.7617;
      let longitude = -80.1918;

      // Check if coordinates are already provided (from frontend)
      if (
        listingData.location.coordinates &&
        listingData.location.coordinates.lat !== undefined &&
        listingData.location.coordinates.lng !== undefined &&
        !isNaN(Number(listingData.location.coordinates.lat)) &&
        !isNaN(Number(listingData.location.coordinates.lng))
      ) {
        latitude = Number(listingData.location.coordinates.lat);
        longitude = Number(listingData.location.coordinates.lng);
      } else {
        const { address, city, state } = listingData.location;
        const coordsResult = await verifyLocationCoordinates(
          address || "",
          city || "",
          state || "",
          listingData.location.zipCode || ""
        );
        latitude = coordsResult.latitude || 25.7617;
        longitude = coordsResult.longitude || -80.1918;
      }

      // Check location safety
      const safetyResult = await checkLocationSafety(latitude, longitude);

      // Add verified coordinates and safety info to listing
      listingData.location.coordinates = {
        lat: latitude,
        lng: longitude,
      };
      listingData.safetyScore = safetyResult.safetyScore || 80;
      listingData.safetyStatus = safetyResult.safetyStatus || "safe";
      listingData.safetyDetails = safetyResult.safetyDetails || "";
    }

    // Process images (upload base64 or use existing URLs)
    const uploadedImages = [];
    const imageList = Array.isArray(images) ? images : [images].filter(Boolean);

    for (const image of imageList) {
      if (typeof image === "string" && (image.startsWith("data:image") || image.startsWith("blob:"))) {
        try {
          const result = await uploadImage(image);
          uploadedImages.push({
            url: result.url,
            publicId: result.public_id,
            format: result.format || "jpg",
            width: result.width || 800,
            height: result.height || 600,
          });
        } catch (error) {
          console.error("Error uploading image:", error);
          uploadedImages.push({
            url: image,
            publicId: `img_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
            format: "jpg",
            width: 800,
            height: 600,
          });
        }
      } else if (typeof image === "string" && (image.startsWith("http://") || image.startsWith("https://") || image.startsWith("/"))) {
        uploadedImages.push({
          url: image,
          publicId: `url_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
          format: image.split(".").pop().split("?")[0] || "jpg",
          width: 1200,
          height: 800,
        });
      } else if (image && typeof image === "object" && image.url) {
        uploadedImages.push(image);
      }
    }

    if (uploadedImages.length === 0) {
      uploadedImages.push({
        url: "/images/no-image-placeholder.jpg",
        publicId: `default_${Date.now()}`,
        format: "jpg",
        width: 800,
        height: 600,
      });
    }

    // Create listing with image URLs
    const newListing = new Listing({
      ...listingData,
      images: uploadedImages,
      host: user._id,
      status: "active",
    });

    // Calculate carbon footprint
    try {
      const carbonData = await calculateCarbonFootprint(newListing);
      newListing.carbonFootprint = carbonData;
    } catch (error) {
      console.error("Error calculating carbon footprint:", error);
    }

    await newListing.save();
    return newListing;
  } catch (error) {
    console.error("Error in createListingService:", error);
    throw new Error(error.message || "Failed to create listing");
  }
};

const getListingsService = async (query) => {
  const {
    location,
    checkIn,
    checkOut,
    guests,
    minPrice,
    maxPrice,
    propertyType,
    page = 1,
    limit = 12,
  } = query;

  const dbQuery = { status: "active" };

  if (location && location.trim()) {
    const locRegex = new RegExp(location.trim(), "i");
    dbQuery.$or = [
      { "location.city": locRegex },
      { "location.state": locRegex },
      { "location.country": locRegex },
      { "location.address": locRegex },
      { title: locRegex },
    ];
  }

  if (minPrice || maxPrice) {
    dbQuery["price.base"] = {};
    if (minPrice) dbQuery["price.base"].$gte = Number(minPrice);
    if (maxPrice) dbQuery["price.base"].$lte = Number(maxPrice);
  }

  if (propertyType && propertyType !== "all") {
    dbQuery.propertyType = propertyType;
  }

  if (guests) {
    dbQuery.maxGuests = { $gte: Number(guests) };
  }

  const pageNum = Math.max(1, Number(page) || 1);
  const limitNum = Math.max(1, Number(limit) || 12);

  const total = await Listing.countDocuments(dbQuery);
  const listings = await Listing.find(dbQuery)
    .populate("host", "firstName lastName email avatar isVerified")
    .skip((pageNum - 1) * limitNum)
    .limit(limitNum)
    .sort({ createdAt: -1 });

  return {
    listings,
    currentPage: pageNum,
    totalPages: Math.max(1, Math.ceil(total / limitNum)),
    totalListings: total,
  };
};

const getListingService = async (id) => {
  const listing = await Listing.findById(id)
    .populate("host", "firstName lastName email avatar phoneNumber isVerified")
    .populate("reviews");
  if (!listing) throw new Error("Listing not found");
  return listing;
};

const updateListingService = async (user, id, body) => {
  const listing = await Listing.findById(id);
  if (!listing) throw new Error("Listing not found");
  if (listing.host.toString() !== user._id.toString() && user.role !== "admin") {
    throw new Error("Not authorized to update this listing");
  }

  return Listing.findByIdAndUpdate(id, body, {
    new: true,
    runValidators: true,
  });
};

const deleteListingService = async (user, id) => {
  const listing = await Listing.findById(id);
  if (!listing) throw new Error("Listing not found");
  if (listing.host.toString() !== user._id.toString() && user.role !== "admin") {
    throw new Error("Not authorized to delete this listing");
  }
  await listing.deleteOne();
  return { message: "Listing removed" };
};

const getHostListingsService = async (user) => {
  return Listing.find({ host: user._id }).sort({ createdAt: -1 });
};

module.exports = {
  createListingService,
  getListingsService,
  getListingService,
  updateListingService,
  deleteListingService,
  getHostListingsService,
};
