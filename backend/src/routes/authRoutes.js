const express = require("express");
const { check } = require("express-validator");
const {
  register,
  login,
  getCurrentUser,
  updateProfile,
  becomeHost,
  logout,
  updateHostPaymentDetails,
} = require("../controllers/authController");
const { protect } = require("../middleware/auth");

const router = express.Router();

// Validation middleware
const registerValidation = [
  check("email")
  .trim()
  .normalizeEmail()
  .isEmail()
  .withMessage("Please include a valid email"),
  check("password", "Password must be at least 8 characters").isLength({
  min: 8,
}),
  check("firstName", "First name is required").not().isEmpty(),
  check("lastName", "Last name is required").not().isEmpty(),
  check("role").optional().isIn(["user", "host"]).withMessage("Invalid role"),
  check("phoneNumber")
    .optional()
    .isMobilePhone()
    .withMessage("Invalid phone number"),
];

const loginValidation = [
  check("email")
  .trim()
  .normalizeEmail()
  .isEmail()
  .withMessage("Please include a valid email"),
  check("password", "Password is required")
  .trim()
  .notEmpty()
  .withMessage("Password is required"),
];

// Routes
router.post("/register", registerValidation, register);
router.post("/login", loginValidation, login);
router.get("/me", protect, getCurrentUser);
router.post("/logout", protect, logout);
router.put("/profile", protect, updateProfile);
router.put("/become-host", protect, becomeHost);
router.put("/host-payment-details", protect, updateHostPaymentDetails);

module.exports = router;
