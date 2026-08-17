const { GoogleGenAI } = require("@google/genai");
const Listing = require("../models/Listing");

// Helper to format intelligent rule-based responses if Gemini is unavailable
const generateSmartPlatformResponse = async (userMessage) => {
  const query = userMessage.toLowerCase().trim();

  // 1. Search / Find properties by city / location
  if (
    query.includes("miami") ||
    query.includes("york") ||
    query.includes("california") ||
    query.includes("san francisco") ||
    query.includes("colorado") ||
    query.includes("aspen") ||
    query.includes("charleston") ||
    query.includes("los angeles") ||
    query.includes("villa") ||
    query.includes("cabin") ||
    query.includes("apartment") ||
    query.includes("studio") ||
    query.includes("condo") ||
    query.includes("property") ||
    query.includes("stay") ||
    query.includes("find") ||
    query.includes("show") ||
    query.includes("list") ||
    query.includes("available") ||
    query.includes("price") ||
    query.includes("cheap") ||
    query.includes("luxury")
  ) {
    try {
      // Find top matching properties from the database
      const dbQuery = { status: "active" };
      if (query.includes("miami")) dbQuery["location.city"] = /miami/i;
      else if (query.includes("york")) dbQuery["location.city"] = /york/i;
      else if (query.includes("san francisco")) dbQuery["location.city"] = /san francisco/i;
      else if (query.includes("aspen") || query.includes("colorado")) dbQuery["location.city"] = /aspen/i;
      else if (query.includes("charleston")) dbQuery["location.city"] = /charleston/i;
      else if (query.includes("los angeles")) dbQuery["location.city"] = /los angeles/i;
      else if (query.includes("villa")) dbQuery.propertyType = "villa";
      else if (query.includes("cabin")) dbQuery.propertyType = "cabin";
      else if (query.includes("apartment")) dbQuery.propertyType = "apartment";
      else if (query.includes("studio")) dbQuery.propertyType = "studio";
      else if (query.includes("condo")) dbQuery.propertyType = "condo";

      const matchedListings = await Listing.find(dbQuery).limit(3).lean();

      if (matchedListings && matchedListings.length > 0) {
        let reply = `Here are some great options I found for you:\n\n`;
        matchedListings.forEach((item, index) => {
          reply += `🏡 ${index + 1}. **${item.title}**\n📍 Location: ${item.location?.city || ""}, ${item.location?.country || ""}\n💰 Price: $${item.price?.base || 0}/night | Rating: ⭐ ${item.averageRating || 4.8}\n\nYou can click on any card on the homepage to view photos and reserve!`;
        });
        return reply;
      }
    } catch (err) {
      console.warn("Error querying database for assistant:", err);
    }
  }

  // 2. Booking & Reservation process
  if (
    query.includes("how to book") ||
    query.includes("how do i book") ||
    query.includes("reserve") ||
    query.includes("reservation") ||
    query.includes("booking")
  ) {
    return `Booking a stay on StayFinder is quick and secure:\n\n1. 🔍 **Browse & Select**: Choose any property from the Explore page.\n2. 📅 **Dates & Guests**: Select your check-in, check-out dates and guest count.\n3. 💳 **Reserve & Pay**: Click 'Reserve & Pay' to checkout securely with Razorpay (Cards, UPI, NetBanking).\n4. 📱 **Confirmation**: Your booking will instantly show in **My Bookings**!`;
  }

  // 3. Host Registration & Verification
  if (
    query.includes("become host") ||
    query.includes("become a host") ||
    query.includes("host") ||
    query.includes("list my property") ||
    query.includes("list property") ||
    query.includes("kyc") ||
    query.includes("verification")
  ) {
    return `To list your home and earn as a StayFinder Host:\n\n1. Click **'Apply for Host'** or visit the **Host** tab.\n2. Complete the **4-step KYC verification** (Personal Info, Aadhaar/PAN, Bank Details, and Property Address).\n3. Once reviewed and approved by our Admin, you can list unlimited properties and manage reservations from your **Host Dashboard**!`;
  }

  // 4. Payment & Razorpay
  if (
    query.includes("payment") ||
    query.includes("pay") ||
    query.includes("razorpay") ||
    query.includes("upi") ||
    query.includes("card")
  ) {
    return `We support 100% secure payments via **Razorpay**:\n\n• Credit & Debit Cards (Visa, Mastercard, RuPay)\n• UPI (Google Pay, PhonePe, Paytm)\n• Net Banking from all major banks\n\nAll transactions are encrypted with industry-standard 256-bit security.`;
  }

  // 5. Cancellation & Refunds
  if (
    query.includes("cancel") ||
    query.includes("refund") ||
    query.includes("cancellation")
  ) {
    return `StayFinder Cancellation & Refund Policy:\n\n• **Full Refund**: Free cancellation up to 48 hours prior to check-in.\n• **Partial Refund**: 50% refund for cancellations made within 48 hours.\n• **How to cancel**: Go to 'My Bookings', select the reservation, and click 'Cancel Booking'. Refunds are credited back to your original payment method in 3-5 business days.`;
  }

  // 6. Carbon footprint & sustainability
  if (
    query.includes("carbon") ||
    query.includes("footprint") ||
    query.includes("eco") ||
    query.includes("green") ||
    query.includes("sustainable")
  ) {
    return `🌱 **StayFinder Eco-Metrics**:\nEvery property on StayFinder includes an automated **Carbon Footprint estimation** (kg CO2e per night) based on its size, room type, and energy amenities (AC, pool, heating). Choosing green stays helps reduce your travel impact!`;
  }

  // 7. Safety & Contact
  if (
    query.includes("contact") ||
    query.includes("phone") ||
    query.includes("email") ||
    query.includes("support") ||
    query.includes("help") ||
    query.includes("call")
  ) {
    return `Our 24/7 customer support team is always here for you:\n\n📧 **Email**: support@stayfinder.com\n📞 **Toll-Free**: +1 (800) 555-STAY\n💬 You can also contact property hosts directly using the **'Contact Host'** button on any listing page!`;
  }

  // Default friendly guidance
  return `Hello! I'm your StayFinder AI Assistant 🏡. How can I help you today?\n\n• Ask about **destinations** (e.g. "Stays in Miami" or "Cozy mountain cabins")\n• Learn **how to book** or check **payment options**\n• Inquire about **becoming a verified host**\n• Check **cancellation and refund rules**`;
};

// Chat endpoint handler
exports.chat = async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.user ? req.user.id : null;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    const userText = message.trim();
    const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;

    // If a valid Google Gemini API key is provided and does not fail, try Gemini
    if (apiKey && apiKey.startsWith("AIzaSy")) {
      try {
        const ai = new GoogleGenAI({ apiKey });
        const prompt = `
You are a warm, knowledgeable assistant for StayFinder, a property rental platform similar to Airbnb.
Provide friendly, concise, and helpful answers to user queries regarding:
- Finding and exploring vacation rentals (villas, cabins, apartments)
- Booking procedures and payments (Razorpay)
- Host verification, KYC, and listing management
- Carbon footprint and eco-friendly travel
- Cancellation and refund policies

User query:
${userText}
`;
        const response = await ai.models.generateContent({
          model: process.env.GEMINI_MODEL || "gemini-1.5-flash",
          contents: prompt,
        });

        const replyText =
          response.text ||
          response.candidates?.[0]?.content?.parts?.[0]?.text;

        if (replyText && replyText.trim()) {
          return res.status(200).json({
            success: true,
            message: replyText.trim(),
            userId,
          });
        }
      } catch (geminiError) {
        console.warn("Gemini API call skipped, using smart platform engine:", geminiError.message);
      }
    }

    // Smart platform engine (instant, reliable, connects to MongoDB listings)
    const smartReply = await generateSmartPlatformResponse(userText);

    return res.status(200).json({
      success: true,
      message: smartReply,
      userId,
    });
  } catch (error) {
    console.error("Assistant chat error:", error);
    res.status(200).json({
      success: true,
      message:
        "Welcome to StayFinder! You can explore vacation homes, book stays securely with Razorpay, or apply to become a host from the menu.",
      userId: req.user ? req.user.id : null,
    });
  }
};