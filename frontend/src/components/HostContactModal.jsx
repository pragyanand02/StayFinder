import React, { useState, useEffect } from "react";
import api from "../api";

const HostContactModal = ({ isOpen, onClose, listingId, host: initialHost }) => {
  const [host, setHost] = useState(initialHost || null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSent(false);
      setMessage("");
      if (!host && listingId) {
        fetchHostContact();
      }
    }
  }, [isOpen, listingId]);

  const fetchHostContact = async () => {
    try {
      const response = await api.get(`/listings/${listingId}/host-contact`);
      setHost(response.data);
    } catch (err) {
      console.warn("Could not fetch host contact:", err);
    }
  };

  if (!isOpen) return null;

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setLoading(true);
    try {
      // Simulate direct message to host
      await new Promise((resolve) => setTimeout(resolve, 600));
      setSent(true);
      setTimeout(() => {
        onClose();
        setSent(false);
      }, 1500);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md animate-fadeIn border border-gray-100">
        <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <span>📞</span> Contact Property Host
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 rounded-lg p-1 text-2xl font-bold leading-none"
          >
            ✕
          </button>
        </div>

        {host && (
          <div className="mb-4 p-4 bg-blue-50 border border-blue-100 rounded-xl">
            <p className="font-bold text-gray-900 text-sm">
              {host.firstName} {host.lastName}
            </p>
            {host.phoneNumber && (
              <p className="text-xs text-blue-700 mt-1 flex items-center gap-1 font-semibold">
                <span>📱 Phone:</span> {host.phoneNumber}
              </p>
            )}
            {host.email && (
              <p className="text-xs text-gray-600 mt-0.5 flex items-center gap-1">
                <span>📧 Email:</span> {host.email}
              </p>
            )}
          </div>
        )}

        {sent ? (
          <div className="py-6 text-center text-green-600 font-semibold space-y-2">
            <div className="text-3xl">✅</div>
            <p>Message sent to host successfully!</p>
          </div>
        ) : (
          <form onSubmit={handleSendMessage}>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Your Message or Inquiry:
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Hi, I have a question regarding check-in time and parking availability..."
              className="w-full p-3 border border-gray-300 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              rows="4"
              required
            />

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl hover:bg-gray-50 text-sm font-semibold text-gray-700 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !message.trim()}
                className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm transition shadow disabled:opacity-50"
              >
                {loading ? "Sending..." : "Send Message"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default HostContactModal;
