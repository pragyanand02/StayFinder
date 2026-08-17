const express = require("express");
const { body } = require("express-validator");
const {
  createBooking,
  getUserBookings,
  getHostBookings,
  getBooking,
  updateBookingStatus,
  deleteBooking,
} = require("../controllers/bookingController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

// All routes are protected
router.use(protect);

// Validation middleware
const bookingValidation = [
  body("listingId").isMongoId().withMessage("Invalid listing ID"),
  body("checkIn").isISO8601().withMessage("Invalid check-in date"),
  body("checkOut").isISO8601().withMessage("Invalid check-out date"),
  body("guests")
    .isInt({ min: 1 })
    .withMessage("Number of guests must be at least 1"),
];

const statusValidation = [
  body("status")
    .isIn(["pending", "confirmed", "cancelled", "completed"])
    .withMessage("Invalid booking status"),
];

// Guest & Host Specific routes (MUST be registered before /:id parameter)
router.post("/", bookingValidation, createBooking);
router.get("/my-bookings", getUserBookings);
router.get("/host/bookings", authorize("host", "admin"), getHostBookings);

// Parameterized routes
router.get("/:id", getBooking);
router.put(
  "/:id/status",
  authorize("host", "admin"),
  statusValidation,
  updateBookingStatus
);
// Delete / Cancel is allowed for booking owner, host, or admin (permission checked in service)
router.delete("/:id", deleteBooking);

module.exports = router;
