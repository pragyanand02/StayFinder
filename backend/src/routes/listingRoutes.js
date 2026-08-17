const express = require("express");
const { check } = require("express-validator");
const {
  createListing,
  getListings,
  getListing,
  updateListing,
  deleteListing,
  getHostListings,
  getHostContact,
} = require("../controllers/listingController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

// Validation middleware for creating listings
const createListingValidation = [
  check("title", "Title is required").not().isEmpty(),
  check("description", "Description is required").not().isEmpty(),
  check("location.address", "Address is required").not().isEmpty(),
  check("location.city", "City is required").not().isEmpty(),
  check("location.state", "State is required").not().isEmpty(),
  check("location.country", "Country is required").not().isEmpty(),
  check("location.coordinates.lat", "Latitude is required").isNumeric(),
  check("location.coordinates.lng", "Longitude is required").isNumeric(),
  check("price.base", "Base price is required").isNumeric(),
  check("propertyType", "Property type is required").isIn([
    "apartment",
    "house",
    "villa",
    "condo",
    "studio",
    "cabin",
  ]),
  check("roomType", "Room type is required").isIn([
    "entire",
    "private",
    "shared",
  ]),
  check("maxGuests", "Maximum guests is required").isNumeric(),
  check("bedrooms", "Number of bedrooms is required").isNumeric(),
  check("beds", "Number of beds is required").isNumeric(),
  check("bathrooms", "Number of bathrooms is required").isNumeric(),
  check("images", "At least one image is required").isArray({ min: 1 }),
];

// Optional validation for updating listings
const updateListingValidation = [
  check("title").optional().not().isEmpty().withMessage("Title cannot be empty"),
  check("description").optional().not().isEmpty().withMessage("Description cannot be empty"),
  check("price.base").optional().isNumeric().withMessage("Base price must be a number"),
];

// Public routes
router.get("/", getListings);
router.get("/:id/host-contact", getHostContact);

// Host routes (REGISTERED BEFORE /:id to prevent route shadowing)
router.get("/host/my-listings", protect, authorize("host", "admin"), getHostListings);
router.post("/", protect, authorize("host", "admin"), createListingValidation, createListing);
router.put(
  "/:id",
  protect,
  authorize("host", "admin"),
  updateListingValidation,
  updateListing
);
router.delete("/:id", protect, authorize("host", "admin"), deleteListing);

// Public single listing route (Must be after specific host routes)
router.get("/:id", getListing);

module.exports = router;
