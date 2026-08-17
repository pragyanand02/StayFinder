import React, { useState, useRef, useEffect } from "react";
import api from "../../api";

const ChatWindow = ({ onClose }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! 👋 I'm your StayFinder Concierge. How can I help you find your dream vacation stay in India or abroad today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const suggestions = [
    "🏖️ Stays in Goa",
    "🏰 Haveli in Jaipur",
    "🏔️ Chalet in Manali",
    "🌺 Villa in Bali",
    "🗼 Paris Eiffel Stay",
    "💳 How does booking work?",
    "🏡 How to become a host?",
    "📅 Cancellation policy",
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const sendQuery = async (queryText) => {
    if (!queryText.trim() || loading) return;

    const userMessage = {
      id: Date.now(),
      text: queryText.trim(),
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await api.post("/assistant", { message: queryText.trim() });

      const botMessage = {
        id: Date.now() + 1,
        text: response.data?.message || "I'm here to help with your StayFinder reservations!",
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error sending message:", error);

      const errorMessage = {
        id: Date.now() + 1,
        text:
          error.response?.data?.message ||
          "Welcome to StayFinder! Explore top vacation rentals in India and worldwide from the Explore page.",
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    sendQuery(input);
  };

  return (
    <div className="fixed bottom-20 md:bottom-24 right-3 sm:right-6 w-[94vw] sm:w-[410px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 h-[520px] max-h-[82vh] border border-gray-200 overflow-hidden animate-fadeIn">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white px-4 py-3.5 flex justify-between items-center shadow flex-shrink-0">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm text-lg">
            🤖
          </div>
          <div>
            <h3 className="font-bold text-sm leading-tight text-white">
              StayFinder Assistant
            </h3>
            <span className="text-[11px] text-blue-100 flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
              Online & Ready to Help
            </span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-white hover:bg-white/20 rounded-full p-1.5 transition text-lg leading-none"
          aria-label="Close chat"
        >
          ✕
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/60 min-h-0">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {msg.sender === "bot" && (
              <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs mr-2 flex-shrink-0 self-end mb-1 shadow-sm">
                🏡
              </div>
            )}
            <div
              className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm shadow-sm ${
                msg.sender === "user"
                  ? "bg-blue-600 text-white rounded-br-none font-medium"
                  : "bg-white text-gray-800 rounded-bl-none border border-gray-200/70"
              }`}
            >
              <p className="whitespace-pre-line leading-relaxed text-[13px]">{msg.text}</p>
              <span
                className={`text-[10px] mt-1 block ${
                  msg.sender === "user" ? "text-blue-100 text-right" : "text-gray-400"
                }`}
              >
                {msg.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start items-center space-x-2">
            <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs shadow-sm">
              🏡
            </div>
            <div className="bg-white border border-gray-200/70 px-4 py-2.5 rounded-2xl rounded-bl-none shadow-sm">
              <div className="flex space-x-1.5 items-center h-4">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-150"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-300"></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggestion Chips Carousel */}
      <div className="p-2 border-t border-gray-100 bg-white flex overflow-x-auto gap-1.5 text-xs no-scrollbar flex-shrink-0">
        {suggestions.map((item, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => sendQuery(item)}
            className="whitespace-nowrap px-3 py-1.5 bg-gray-100 hover:bg-blue-50 hover:text-blue-600 text-gray-700 rounded-full transition text-[11px] font-medium border border-gray-200/80 flex-shrink-0"
          >
            {item}
          </button>
        ))}
      </div>

      {/* Input Form (Fixed at bottom) */}
      <form
        onSubmit={handleSendMessage}
        className="p-3 flex gap-2 bg-white border-t border-gray-100 flex-shrink-0"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about Goa, Manali, Bali, booking..."
          className="flex-1 px-3.5 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-gray-50 focus:bg-white transition"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white px-4 py-2.5 rounded-xl transition text-sm font-semibold shadow-md flex items-center justify-center flex-shrink-0"
          aria-label="Send message"
        >
          <svg className="w-4 h-4 transform rotate-90" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"/>
          </svg>
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;
