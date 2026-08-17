const { GoogleGenAI } = require("@google/genai");
const Listing = require("../models/Listing");

// Helper to extract keywords and search database
const searchListingsFromDatabase = async (queryText) => {
  try {
    const rawTokens = queryText
      .toLowerCase()
      .replace(/[^\w\s]/gi, "")
      .split(/\s+/)
      .filter((t) => t.length > 2 && !["the", "and", "for", "with", "any", "are", "you", "can", "show", "find", "have", "want", "look", "looking", "stays", "stay", "hotel", "hotels", "places", "place"].includes(t));

    const orClauses = [];

    // Check for specific destinations and keywords
    for (const token of rawTokens) {
      orClauses.push(
        { "location.city": new RegExp(token, "i") },
        { "location.state": new RegExp(token, "i") },
        { "location.country": new RegExp(token, "i") },
        { title: new RegExp(token, "i") },
        { description: new RegExp(token, "i") },
        { propertyType: new RegExp(token, "i") }
      );
    }

    let listings = [];
    if (orClauses.length > 0) {
      listings = await Listing.find({
        status: "active",
        $or: orClauses,
      })
        .limit(3)
        .lean();
    }

    // Fallback: If query specifically asked for stays/properties without specific match, show top featured
    if (
      (!listings || listings.length === 0) &&
      (queryText.includes("stay") ||
        queryText.includes("hotel") ||
        queryText.includes("villa") ||
        queryText.includes("place") ||
        queryText.includes("recommend") ||
        queryText.includes("top") ||
        queryText.includes("best") ||
        queryText.includes("india") ||
        queryText.includes("all"))
    ) {
      listings = await Listing.find({ status: "active" })
        .sort({ averageRating: -1 })
        .limit(3)
        .lean();
    }

    return listings;
  } catch (err) {
    console.warn("Database search error in assistant:", err.message);
    return [];
  }
};

// Intelligent Rule-Based Engine
const generateSmartPlatformResponse = async (userMessage) => {
  const query = userMessage.toLowerCase().trim();

  // 1. Greetings
  if (
    query === "hi" ||
    query === "hello" ||
    query === "hey" ||
    query === "namaste" ||
    query === "hii" ||
    query.startsWith("hi ") ||
    query.startsWith("hello ")
  ) {
    return `Hello! 👋 Welcome to StayFinder! How can I help you today?\n\n• 🏖️ Ask for stays (e.g. "Stays in Goa", "Heritage Haveli in Jaipur", "Villas in Bali")\n• 📅 Learn how to book or check payment methods\n• 🏡 Inquire about becoming a verified host\n• ♻️ Check carbon eco-footprint info`;
  }

  // 2. Booking & Reservation process
  if (
    query.includes("how to book") ||
    query.includes("how do i book") ||
    query.includes("reserve") ||
    query.includes("reservation") ||
    query.includes("booking")
  ) {
    return `Booking a stay on StayFinder is super easy:\n\n1. 🔍 **Browse & Choose**: Select your favorite property on the Explore page.\n2. 📅 **Select Dates & Guests**: Pick check-in, check-out dates, and number of guests.\n3. 💳 **Reserve & Pay**: Click 'Reserve & Pay' to checkout via Razorpay (UPI, Credit/Debit Cards, NetBanking).\n4. 📱 **Instant Confirmation**: Your confirmed reservation will show up under 'My Bookings'!`;
  }

  // 3. Host Registration & Verification
  if (
    query.includes("become host") ||
    query.includes("become a host") ||
    query.includes("how to host") ||
    query.includes("list my property") ||
    query.includes("list property") ||
    query.includes("kyc") ||
    query.includes("verification")
  ) {
    return `To list your home and earn as a StayFinder Host:\n\n1. Click **'Apply for Host'** in the navbar.\n2. Complete our 4-step KYC verification (Personal Info, Aadhaar/PAN, Bank Details, and Property Address).\n3. Once approved by our team, you can list unlimited villas, apartments, or havelis and manage bookings directly from your **Host Dashboard**!`;
  }

  // 4. Payment & Security
  if (
    query.includes("payment") ||
    query.includes("pay") ||
    query.includes("razorpay") ||
    query.includes("upi") ||
    query.includes("card") ||
    query.includes("price")
  ) {
    return `We support 100% secure payments via **Razorpay**:\n\n• 💳 **Cards**: Visa, Mastercard, RuPay, Amex\n• 📱 **UPI**: Google Pay, PhonePe, Paytm, BHIM\n• 🏦 **Net Banking**: All major Indian and international banks\n\nAll transactions are secured with 256-bit SSL encryption.`;
  }

  // 5. Cancellation & Refunds
  if (
    query.includes("cancel") ||
    query.includes("refund") ||
    query.includes("cancellation")
  ) {
    return `StayFinder Cancellation & Refund Policy:\n\n• **Free Cancellation**: Cancel up to 48 hours prior to check-in for a 100% full refund.\n• **Within 48 hours**: 50% refund applied.\n• **How to cancel**: Go to 'My Bookings', select the reservation, and click 'Cancel Booking'. Refunds process back in 3-5 business days.`;
  }

  // 6. Carbon footprint & sustainability
  if (
    query.includes("carbon") ||
    query.includes("footprint") ||
    query.includes("eco") ||
    query.includes("green") ||
    query.includes("sustainable")
  ) {
    return `🌱 **StayFinder Eco-Metrics**:\nEvery stay on StayFinder calculates an automated **Carbon Footprint score** (kg CO2e per night) based on its square footage, room type, and energy amenities (AC, pool heating, heating). Choosing green stays helps reduce your carbon footprint!`;
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
    return `Our 24/7 customer support team is always here for you:\n\n📧 **Email**: support@stayfinder.com\n📞 **Helpline**: +91 98200 11223\n💬 You can also contact property hosts directly using the **'Contact Host'** button on any listing page!`;
  }

  // 8. Database Property Search (for any destination, city, country, or stay type)
  const matchedListings = await searchListingsFromDatabase(query);

  if (matchedListings && matchedListings.length > 0) {
    let reply = `Here are some top stays matching your request:\n\n`;
    matchedListings.forEach((item, index) => {
      reply += `🏡 ${index + 1}. **${item.title}**\n📍 Location: ${item.location?.city || ""}, ${item.location?.country || ""}\n💰 Price: $${item.price?.base || 0}/night | ⭐ Rating: ${item.averageRating || 4.9} (${item.maxGuests || 2} guests)\n\n`;
    });
    reply += `You can view photos and reserve directly from the Explore page!`;
    return reply;
  }

  // Default response
  return `I'm your StayFinder AI Assistant 🏡!\n\nI can help you:\n• Find top stays (e.g. "Stays in Goa", "Palace in Udaipur", "Villas in Bali", "Chalet in Manali")\n• Guide you on **booking** and **payment options**\n• Explain **host KYC registration** and **cancellation policies**\n\nWhat would you like to explore?`;
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

    // If a valid Google Gemini API key is configured, use Gemini
    if (apiKey && apiKey.startsWith("AIzaSy")) {
      try {
        const ai = new GoogleGenAI({ apiKey });
        const prompt = `
You are a warm, helpful, and knowledgeable AI concierge for StayFinder, a property rental platform featuring top destinations across India (Goa, Jaipur, Udaipur, Manali, Kerala, Mumbai, Rishikesh, Bangalore) and Worldwide (Bali, Paris, Dubai, Santorini, Tokyo, Switzerland, Maldives).

Provide friendly, concise, and helpful answers to user queries regarding:
- Finding and exploring vacation rentals (villas, cabins, apartments, heritage havelis)
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
        console.warn("Gemini API skipped, using intelligent database engine:", geminiError.message);
      }
    }

    // Dynamic database-aware intelligent engine
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
        "Welcome to StayFinder! You can explore vacation homes across India and worldwide, book stays securely with Razorpay, or apply to become a host.",
      userId: req.user ? req.user.id : null,
    });
  }
};