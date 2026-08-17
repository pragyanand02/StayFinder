const Razorpay = require("razorpay");
const crypto = require("crypto");
const Booking = require("../models/Booking");

let razorpay = null;
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
}

// Create payment order
exports.createPaymentOrder = async (req, res) => {
  try {
    const { bookingId, amount } = req.body;

    if (!bookingId || amount === undefined) {
      return res.status(400).json({
        success: false,
        message: "Booking ID and amount are required",
      });
    }

    const keyId = process.env.RAZORPAY_KEY_ID || "rzp_test_mockkey";
    let order = null;

    if (razorpay) {
      const options = {
        amount: Math.round(Number(amount) * 100), // Convert to paise
        currency: "INR",
        receipt: `booking_${bookingId}`,
      };
      order = await razorpay.orders.create(options);
    } else {
      // Mock order for development/testing without live keys
      order = {
        id: `order_mock_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        amount: Math.round(Number(amount) * 100),
        currency: "INR",
        receipt: `booking_${bookingId}`,
        status: "created",
      };
    }

    // Update booking with order ID
    await Booking.findByIdAndUpdate(bookingId, {
      razorpayOrderId: order.id,
    });

    res.status(200).json({
      success: true,
      order,
      orderId: order.id,
      keyId: keyId,
    });
  } catch (error) {
    console.error("Error in createPaymentOrder:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create payment order",
    });
  }
};

// Verify payment
exports.verifyPayment = async (req, res) => {
  try {
    const razorpay_payment_id =
      req.body.razorpay_payment_id || req.body.paymentId;
    const razorpay_order_id =
      req.body.razorpay_order_id || req.body.orderId;
    const razorpay_signature =
      req.body.razorpay_signature || req.body.signature;
    let bookingId = req.body.bookingId;

    if (!razorpay_payment_id || !razorpay_order_id) {
      return res.status(400).json({
        success: false,
        message: "Payment details (payment ID and order ID) are required",
      });
    }

    // Find booking by ID or by razorpayOrderId
    let booking = null;
    if (bookingId) {
      booking = await Booking.findById(bookingId);
    }
    if (!booking && razorpay_order_id) {
      booking = await Booking.findOne({ razorpayOrderId: razorpay_order_id });
      if (booking) {
        bookingId = booking._id;
      }
    }

    // Verify signature if secret is provided and not a mock order
    if (
      process.env.RAZORPAY_KEY_SECRET &&
      !razorpay_order_id.startsWith("order_mock_") &&
      razorpay_signature
    ) {
      const body = razorpay_order_id + "|" + razorpay_payment_id;
      const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(body)
        .digest("hex");

      if (expectedSignature !== razorpay_signature) {
        return res.status(400).json({
          success: false,
          message: "Payment verification signature mismatch",
        });
      }
    }

    // Update booking
    if (bookingId) {
      booking = await Booking.findByIdAndUpdate(
        bookingId,
        {
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature || "mock_signature",
          status: "confirmed",
          paymentStatus: "paid",
        },
        { new: true }
      );
    }

    res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      booking,
    });
  } catch (error) {
    console.error("Error in verifyPayment:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Payment verification failed",
    });
  }
};

// Get payment details
exports.getPaymentDetails = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    res.status(200).json({
      success: true,
      payment: {
        razorpayOrderId: booking.razorpayOrderId,
        razorpayPaymentId: booking.razorpayPaymentId,
        paymentStatus: booking.paymentStatus,
        totalPrice: booking.totalPrice,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Refund booking payment
exports.refundBookingPayment = async (req, res) => {
  try {
    const { bookingId } = req.body;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (!booking.razorpayPaymentId) {
      return res.status(400).json({
        success: false,
        message: "No payment to refund",
      });
    }

    let refund = { id: `rfnd_${Date.now()}` };
    if (razorpay && !booking.razorpayPaymentId.startsWith("pay_mock_")) {
      refund = await razorpay.payments.refund(booking.razorpayPaymentId, {
        amount: Math.round(booking.totalPrice * 100),
      });
    }

    // Update booking
    await Booking.findByIdAndUpdate(bookingId, {
      paymentStatus: "refunded",
      status: "cancelled",
    });

    res.status(200).json({
      success: true,
      message: "Refund processed successfully",
      refund,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
