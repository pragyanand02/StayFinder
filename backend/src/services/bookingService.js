const Booking = require("../models/Booking");
const Listing = require("../models/Listing");

const createBookingService = async (user, body) => {
  const { listingId, checkIn, checkOut, guests } = body;
  const listing = await Listing.findById(listingId);
  if (!listing) throw new Error("Listing not found");

  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  const nights = Math.ceil(
    (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24)
  );

  if (nights <= 0) {
    throw new Error("Check-out date must be after check-in date");
  }

  const basePrice = (listing.price?.base || 0) * nights;
  const cleaningFee = listing.price?.cleaningFee || 0;
  const serviceFee = listing.price?.serviceFee || 0;
  const totalPrice = basePrice + cleaningFee + serviceFee;

  const booking = await Booking.create({
    listing: listingId,
    user: user._id,
    checkIn: checkInDate,
    checkOut: checkOutDate,
    guests,
    totalPrice,
    status: "confirmed",
  });

  return booking;
};

const getUserBookingsService = async (user) => {
  return Booking.find({ user: user._id })
    .populate("listing")
    .sort({ createdAt: -1 });
};

const getHostBookingsService = async (user) => {
  const listings = await Listing.find({ host: user._id });
  const listingIds = listings.map((listing) => listing._id);
  return Booking.find({ listing: { $in: listingIds } })
    .populate("listing")
    .populate("user", "firstName lastName email phoneNumber")
    .sort({ createdAt: -1 });
};

const getBookingService = async (user, bookingId) => {
  const booking = await Booking.findById(bookingId)
    .populate("listing")
    .populate("user", "firstName lastName email phoneNumber");
  if (!booking) throw new Error("Booking not found");

  const isOwner = booking.user._id.toString() === user._id.toString();
  const isHost =
    booking.listing?.host?.toString() === user._id.toString();
  const isAdmin = user.role === "admin";

  if (!isOwner && !isHost && !isAdmin) {
    throw new Error("Not authorized to view this booking");
  }

  return booking;
};

const updateBookingStatusService = async (user, bookingId, status) => {
  const booking = await Booking.findById(bookingId);
  if (!booking) throw new Error("Booking not found");
  const listing = await Listing.findById(booking.listing);
  if (!listing) throw new Error("Listing not found");

  const isOwner = booking.user.toString() === user._id.toString();
  const isHost = listing.host.toString() === user._id.toString();
  const isAdmin = user.role === "admin";

  if (!isOwner && !isHost && !isAdmin) {
    throw new Error("Not authorized to update this booking");
  }

  booking.status = status;
  await booking.save();
  return booking;
};

const deleteBookingService = async (user, bookingId) => {
  const booking = await Booking.findById(bookingId);
  if (!booking) throw new Error("Booking not found");
  const listing = await Listing.findById(booking.listing);

  const isOwner = booking.user.toString() === user._id.toString();
  const isHost = listing && listing.host.toString() === user._id.toString();
  const isAdmin = user.role === "admin";

  if (!isOwner && !isHost && !isAdmin) {
    throw new Error("Not authorized to cancel or delete this booking");
  }

  await booking.deleteOne();
  return { message: "Booking cancelled successfully" };
};

module.exports = {
  createBookingService,
  getUserBookingsService,
  getHostBookingsService,
  getBookingService,
  updateBookingStatusService,
  deleteBookingService,
};
