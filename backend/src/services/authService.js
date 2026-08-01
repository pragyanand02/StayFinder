const User = require("../models/User");
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

const registerService = async (body) => {
  const {
    email,
    password,
    firstName,
    lastName,
    phoneNumber,
    role = "user",
  } = body;

  if (process.env.NODE_ENV === "development") {
  console.log("Starting registration...");
}

  // Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    if (process.env.NODE_ENV === "development") {
  console.log("Registration failed: User already exists");
}
    const error = new Error("User already exists");
error.statusCode = 409;
throw error;
  }

  if (process.env.NODE_ENV === "development") {
  console.log("Creating new user...");
}

  // Create the user (password will be hashed by the pre-save hook)
  const user = await User.create({
    email,
    password,
    firstName,
    lastName,
    phoneNumber,
    role,
  });

  if (process.env.NODE_ENV === "development") {
  console.log("User created successfully");
}

  // Generate JWT token
  const token = generateToken(user._id);

  return {
    _id: user._id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
    phoneNumber: user.phoneNumber,
    isVerified: user.isVerified,
    token,
  };
};

const loginService = async (body) => {
  const { email, password } = body;
  if (process.env.NODE_ENV === "development") {
  console.log("Login attempt");
}

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    if (process.env.NODE_ENV === "development") {
  console.log("User not found");
}
    const error = new Error("Invalid credentials");
error.statusCode = 401;
throw error;
  }

  if (process.env.NODE_ENV === "development") {
  console.log("User found");
}
  if (process.env.NODE_ENV === "development") {
  console.log("Comparing password...");
}

const isMatch = await user.comparePassword(password);

if (process.env.NODE_ENV === "development") {
  console.log("Password comparison completed");
}

  if (!isMatch) {
    if (process.env.NODE_ENV === "development") {
  console.log("Invalid password");
}
    const error = new Error("Invalid credentials");
error.statusCode = 401;
throw error;
  }

  const token = generateToken(user._id);
  if (process.env.NODE_ENV === "development") {
  console.log("Login successful");
}

  return {
    _id: user._id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
    phoneNumber: user.phoneNumber,
    isVerified: user.isVerified,
    token,
  };
};

const getCurrentUserService = async (user) => {
  return User.findById(user._id).select("-password");
};

const updateProfileService = async (user, body) => {
  const { firstName, lastName, phoneNumber } = body;
  const foundUser = await User.findById(user._id);

if (!foundUser) {
  const error = new Error("User not found");
  error.statusCode = 404;
  throw error;
}
  foundUser.firstName = firstName || foundUser.firstName;
  foundUser.lastName = lastName || foundUser.lastName;
  foundUser.phoneNumber = phoneNumber || foundUser.phoneNumber;
  const updatedUser = await foundUser.save();
  return {
    _id: updatedUser._id,
    email: updatedUser.email,
    firstName: updatedUser.firstName,
    lastName: updatedUser.lastName,
    role: updatedUser.role,
    phoneNumber: updatedUser.phoneNumber,
  };
};

const becomeHostService = async (user) => {
const foundUser = await User.findById(user._id);

if (!foundUser) {
  const error = new Error("User not found");
  error.statusCode = 404;
  throw error;
}

if (foundUser.role === "host") {
  const error = new Error("User is already a host");
  error.statusCode = 409;
  throw error;
}
  foundUser.role = "host";
  const updatedUser = await foundUser.save();
  return {
    _id: updatedUser._id,
    email: updatedUser.email,
    firstName: updatedUser.firstName,
    lastName: updatedUser.lastName,
    role: updatedUser.role,
    phoneNumber: updatedUser.phoneNumber,
  };
};

const updateHostPaymentDetailsService = async (user, paymentDetails) => {
const foundUser = await User.findById(user._id);

if (!foundUser) {
  const error = new Error("User not found");
  error.statusCode = 404;
  throw error;
}

if (foundUser.role !== "host") {
  const error = new Error("User is not a host");
  error.statusCode = 403;
  throw error;
}
  const { accountNumber, panCard, bankName, ifscCode, accountHolderName } =
    paymentDetails;

  // Validate required fields
  if (
    !accountNumber ||
    !panCard ||
    !bankName ||
    !ifscCode ||
    !accountHolderName
  ) {
    const error = new Error("All payment details are required");
error.statusCode = 400;
throw error;
  }

  // Validate PAN format (Indian PAN: 10 characters, alphanumeric)
  if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(panCard)) {
    const error = new Error(
  "Invalid PAN format. PAN should be 10 characters (e.g., AAAAA1234A)"
);
error.statusCode = 400;
throw error;
  }

  // Validate account number (basic validation)
  if (accountNumber.length < 9 || accountNumber.length > 18) {
const error = new Error(
  "Invalid account number. Should be between 9-18 digits"
);
error.statusCode = 400;
throw error;
  }

  // Validate IFSC code format
  if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifscCode)) {
   const error = new Error(
  "Invalid IFSC code format. Should be 11 characters (e.g., SBIN0001234)"
);
error.statusCode = 400;
throw error;
  }

  foundUser.hostPaymentDetails = {
    accountNumber,
    panCard: panCard.toUpperCase(),
    bankName,
    ifscCode: ifscCode.toUpperCase(),
    accountHolderName,
    isVerified: false, // Will be verified by admin
  };

  const updatedUser = await foundUser.save();
  return {
    _id: updatedUser._id,
    email: updatedUser.email,
    firstName: updatedUser.firstName,
    lastName: updatedUser.lastName,
    role: updatedUser.role,
    hostPaymentDetails: updatedUser.hostPaymentDetails,
  };
};

module.exports = {
  registerService,
  loginService,
  getCurrentUserService,
  updateProfileService,
  becomeHostService,
  updateHostPaymentDetailsService,
};
