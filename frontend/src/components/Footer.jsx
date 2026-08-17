import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Footer = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [activeModal, setActiveModal] = useState(null);

  const modalContent = {
    about: {
      title: "About StayFinder",
      content:
        "StayFinder is a next-generation vacation rental and homestay platform designed to connect passionate travelers with verified hosts worldwide. We focus on transparency, sustainable travel with carbon footprint estimation, and verified host credentials.",
    },
    contact: {
      title: "Contact Us",
      content:
        "Have questions, need help with a reservation, or want to list your property? Reach out to our 24/7 support team:\n\n📧 Email: support@stayfinder.com\n📞 Phone: +1 (800) 555-STAY (7829)\n🏢 Headquarters: San Francisco, CA",
    },
    help: {
      title: "Help Center & FAQ",
      content:
        "• How do I book a stay? Browse listings, choose check-in/out dates, and click 'Reserve & Pay'.\n• How do I become a host? Click 'Apply for Host', fill out the 4-step verification, and start listing properties once approved.\n• What payment methods are supported? All major debit/credit cards, UPI, and NetBanking via secure Razorpay checkout.",
    },
    safety: {
      title: "Safety & Security",
      content:
        "Your safety is our priority. Every host undergoes KYC verification including Aadhaar/PAN validation. All property locations receive automated safety and neighborhood checks before going live.",
    },
    cancellation: {
      title: "Cancellation Policy",
      content:
        "• Full refund: Free cancellation up to 48 hours before check-in.\n• Partial refund: 50% refund for cancellations made within 48 hours of check-in.\n• Host cancellations: Guests are fully refunded and assisted in finding alternative stays.",
    },
    privacy: {
      title: "Privacy Policy",
      content:
        "We value your privacy. Your personal information, payment credentials, and government ID documents are encrypted and never shared with third parties without your explicit consent.",
    },
    terms: {
      title: "Terms of Service",
      content:
        "By using StayFinder, you agree to treat properties and hosts with respect, comply with local housing regulations, and follow our community safety guidelines.",
    },
  };

  return (
    <>
      <footer className="bg-gray-900 text-white pb-20 md:pb-12 pt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center mb-4">
                <Link to="/" className="text-2xl font-bold text-blue-400 hover:text-blue-300 transition">
                  StayFinder
                </Link>
              </div>
              <p className="text-gray-300 text-sm mb-4">
                Discover unique accommodations around the world. From cozy apartments to luxury villas, find the perfect place for your next adventure.
              </p>
              {/* Working Social Media Links */}
              <div className="flex space-x-4">
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter / X"
                  className="text-gray-400 hover:text-blue-400 transition p-2 bg-gray-800 rounded-full hover:bg-gray-700"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="text-gray-400 hover:text-pink-400 transition p-2 bg-gray-800 rounded-full hover:bg-gray-700"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="text-gray-400 hover:text-blue-500 transition p-2 bg-gray-800 rounded-full hover:bg-gray-700"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="text-gray-400 hover:text-blue-400 transition p-2 bg-gray-800 rounded-full hover:bg-gray-700"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-base font-semibold mb-4 text-white uppercase tracking-wider">
                Quick Links
              </h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/" className="text-gray-300 hover:text-blue-400 transition flex items-center gap-1">
                    <span>→</span> Explore Stays
                  </Link>
                </li>
                <li>
                  <button
                    onClick={() => setActiveModal("about")}
                    className="text-gray-300 hover:text-blue-400 transition text-left"
                  >
                    About Us
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveModal("contact")}
                    className="text-gray-300 hover:text-blue-400 transition text-left"
                  >
                    Contact Support
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveModal("help")}
                    className="text-gray-300 hover:text-blue-400 transition text-left"
                  >
                    Help Center & FAQ
                  </button>
                </li>
              </ul>
            </div>

            {/* User Account / Host Section (Especially for Mobile & Phone Users) */}
            <div>
              <h4 className="text-base font-semibold mb-4 text-white uppercase tracking-wider">
                My Account
              </h4>
              {isAuthenticated ? (
                <div className="space-y-2 text-sm">
                  <div className="p-2 bg-gray-800 rounded-md border border-gray-700 mb-2">
                    <p className="text-xs text-gray-400">Signed in as</p>
                    <p className="font-semibold text-blue-400 truncate">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <span className="inline-block mt-1 px-2 py-0.5 text-xs rounded bg-blue-900/60 text-blue-200 capitalize">
                      {user?.role || "Guest"}
                    </span>
                  </div>
                  <ul className="space-y-2">
                    <li>
                      <Link to="/profile" className="text-gray-300 hover:text-blue-400 transition flex items-center gap-1">
                        <span>👤</span> Profile Settings
                      </Link>
                    </li>
                    <li>
                      <Link to="/bookings" className="text-gray-300 hover:text-blue-400 transition flex items-center gap-1">
                        <span>🧳</span> My Bookings
                      </Link>
                    </li>
                    {user?.role === "host" ? (
                      <li>
                        <Link to="/host/dashboard" className="text-gray-300 hover:text-blue-400 transition flex items-center gap-1">
                          <span>📊</span> Host Dashboard
                        </Link>
                      </li>
                    ) : user?.role === "admin" ? (
                      <li>
                        <Link to="/admin/host-verification" className="text-gray-300 hover:text-red-400 transition flex items-center gap-1">
                          <span>🛡️</span> Admin Panel
                        </Link>
                      </li>
                    ) : (
                      <li>
                        <Link to="/host/apply" className="text-gray-300 hover:text-green-400 transition flex items-center gap-1">
                          <span>🏡</span> Become a Host
                        </Link>
                      </li>
                    )}
                    <li>
                      <button
                        onClick={() => {
                          logout();
                          navigate("/");
                        }}
                        className="text-red-400 hover:text-red-300 transition text-left"
                      >
                        Sign Out
                      </button>
                    </li>
                  </ul>
                </div>
              ) : (
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link to="/login" className="text-gray-300 hover:text-blue-400 transition flex items-center gap-1">
                      <span>🔑</span> Sign In
                    </Link>
                  </li>
                  <li>
                    <Link to="/register" className="text-gray-300 hover:text-blue-400 transition flex items-center gap-1">
                      <span>✨</span> Create New Account
                    </Link>
                  </li>
                  <li>
                    <Link to="/host/become" className="text-gray-300 hover:text-blue-400 transition flex items-center gap-1">
                      <span>🏡</span> Host Your Home
                    </Link>
                  </li>
                </ul>
              )}
            </div>

            {/* Support & Policies */}
            <div>
              <h4 className="text-base font-semibold mb-4 text-white uppercase tracking-wider">
                Trust & Support
              </h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <button
                    onClick={() => setActiveModal("safety")}
                    className="text-gray-300 hover:text-blue-400 transition text-left"
                  >
                    Safety & Security
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveModal("cancellation")}
                    className="text-gray-300 hover:text-blue-400 transition text-left"
                  >
                    Cancellation Policy
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveModal("privacy")}
                    className="text-gray-300 hover:text-blue-400 transition text-left"
                  >
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveModal("terms")}
                    className="text-gray-300 hover:text-blue-400 transition text-left"
                  >
                    Terms of Service
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
            <div>
              © {new Date().getFullYear()} StayFinder, Inc. All rights reserved.
            </div>
            <div className="mt-2 md:mt-0 flex items-center space-x-2">
              <span>🌱 Eco-friendly stays with verified safety</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Informational Modal */}
      {activeModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 text-gray-900 animate-fadeIn">
            <div className="flex justify-between items-center pb-3 border-b">
              <h3 className="text-xl font-bold text-gray-900">
                {modalContent[activeModal]?.title}
              </h3>
              <button
                onClick={() => setActiveModal(null)}
                className="text-gray-400 hover:text-gray-600 rounded-lg p-1 text-2xl font-bold leading-none"
              >
                ✕
              </button>
            </div>
            <div className="mt-4 text-gray-700 whitespace-pre-line text-sm leading-relaxed max-h-96 overflow-y-auto">
              {modalContent[activeModal]?.content}
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setActiveModal(null)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Footer;
