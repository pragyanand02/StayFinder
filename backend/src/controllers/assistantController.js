const { GoogleGenAI } = require("@google/genai");

// Initialize Gemini
const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

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

    const prompt = `
You are a helpful assistant for StayFinder, an Airbnb-like property rental platform.

Help users with:
- Property listings
- Bookings
- Hosts
- Reviews
- Rental related questions

User:
${message}
`;

    const response = await ai.models.generateContent({
      model: "gemini-flash-latest",
      contents: prompt,
    });

    res.status(200).json({
      success: true,
      message: response.text,
      userId,
    });
  } catch (error) {
    console.error("Gemini Error:", error);

    res.status(500).json({
      success: false,
      message: "Error processing your message",
      error: error.message,
    });
  }
};