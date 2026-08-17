const { GoogleGenAI } = require("@google/genai");

let ai = null;
const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
if (apiKey) {
  try {
    ai = new GoogleGenAI({ apiKey });
  } catch (err) {
    console.error("Error initializing GoogleGenAI:", err);
  }
}

// Chat with assistant
exports.chat = async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.user ? req.user.id : null;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    if (!ai) {
      // Helpful fallback response when Gemini API key is not configured
      const lower = message.toLowerCase();
      let fallbackReply = "Welcome to StayFinder! You can browse listings from the homepage, search by city or country, or apply to become a host to list your own place.";
      if (lower.includes("book") || lower.includes("reserve")) {
        fallbackReply = "To book a stay, browse any listing, choose your check-in and check-out dates and guest count, and click 'Reserve & Pay'.";
      } else if (lower.includes("host") || lower.includes("list")) {
        fallbackReply = "To list your property as a host, click 'Become a Host' in the navbar or visit '/host/become' to start the verification process.";
      } else if (lower.includes("cancel") || lower.includes("refund")) {
        fallbackReply = "You can view and cancel your reservations anytime under 'My Bookings'. Cancellation policies apply based on property rules.";
      }

      return res.status(200).json({
        success: true,
        message: fallbackReply,
        userId,
      });
    }

    const prompt = `
You are a helpful assistant for StayFinder, a property rental platform.
Provide friendly, concise, and accurate answers to user queries regarding:
- Property listings and amenities
- Booking and reservations
- Host verification and property management
- Eco-friendly stays and carbon footprint

User query:
${message}
`;

    const modelName = process.env.GEMINI_MODEL || "gemini-1.5-flash";
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
    });

    const replyText =
      response.text ||
      (response.candidates?.[0]?.content?.parts?.[0]?.text) ||
      "I'm here to help with your StayFinder reservations and listings!";

    res.status(200).json({
      success: true,
      message: replyText,
      userId,
    });
  } catch (error) {
    console.error("Gemini Error:", error);

    res.status(200).json({
      success: true,
      message:
        "Hello! I am your StayFinder assistant. You can explore vacation stays, create bookings, or manage your host properties.",
      userId: req.user ? req.user.id : null,
    });
  }
};