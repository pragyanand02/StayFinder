import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Navbar = () => {
  const { user, isAuthenticated, logout, loading } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isHostMenuOpen, setIsHostMenuOpen] = useState(false);

  const profileMenuRef = useRef(null);
  const hostMenuRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  // Close all menus when location/route or role changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsProfileMenuOpen(false);
    setIsHostMenuOpen(false);
  }, [location.pathname, user?.role]);

  // Click outside listener for dropdowns
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setIsProfileMenuOpen(false);
      }
      if (
        hostMenuRef.current &&
        !hostMenuRef.current.contains(event.target)
      ) {
        setIsHostMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsProfileMenuOpen(false);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link
              to="/"
              className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent hover:opacity-90 transition flex items-center gap-1.5"
            >
              <span>🏡</span>
              <span>StayFinder</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-3">
            <Link
              to="/"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                isActive("/")
                  ? "text-blue-600 bg-blue-50 font-semibold"
                  : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
              }`}
            >
              Home
            </Link>

            {isAuthenticated && (
              <>
                <Link
                  to="/bookings"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                    isActive("/bookings")
                      ? "text-blue-600 bg-blue-50 font-semibold"
                      : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                  }`}
                >
                  Bookings
                </Link>

                {user?.role === "admin" ? (
                  <Link
                    to="/admin/host-verification"
                    className="bg-red-600 hover:bg-red-700 text-white px-3.5 py-1.5 rounded-lg text-sm font-medium transition flex items-center space-x-1 shadow-sm"
                  >
                    <span>🛡️ Admin Panel</span>
                  </Link>
                ) : user?.role === "host" ? (
                  <div className="relative" ref={hostMenuRef}>
                    <button
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition flex items-center space-x-1 ${
                        isActive("/host/dashboard") || isActive("/listings/new")
                          ? "text-blue-600 bg-blue-50 font-semibold"
                          : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                      }`}
                      onClick={() => setIsHostMenuOpen((open) => !open)}
                    >
                      <span>Host Menu</span>
                      <svg
                        className={`w-4 h-4 transition-transform duration-200 ${
                          isHostMenuOpen ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                    {isHostMenuOpen && (
                      <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl py-1 z-50 border border-gray-100 animate-fadeIn">
                        <Link
                          to="/listings/new"
                          className="px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 flex items-center space-x-2 transition"
                          onClick={() => setIsHostMenuOpen(false)}
                        >
                          <span>➕</span>
                          <span>List New Property</span>
                        </Link>
                        <Link
                          to="/host/dashboard"
                          className="px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 flex items-center space-x-2 transition"
                          onClick={() => setIsHostMenuOpen(false)}
                        >
                          <span>📊</span>
                          <span>Manage Properties</span>
                        </Link>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    to="/host/apply"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-1.5 rounded-lg text-sm font-medium transition flex items-center space-x-1 shadow-sm"
                  >
                    <span>Apply for Host</span>
                    <span className="ml-1 font-bold">→</span>
                  </Link>
                )}
              </>
            )}

            {/* Profile / Auth Menu */}
            {loading ? (
              <div className="w-9 h-9 bg-gray-200 rounded-full animate-pulse ml-2"></div>
            ) : isAuthenticated ? (
              <div className="relative ml-2" ref={profileMenuRef}>
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center space-x-2 focus:outline-none p-1 rounded-full hover:ring-2 hover:ring-blue-400 transition"
                  aria-label="User menu"
                >
                  <div className="w-9 h-9 bg-gradient-to-tr from-blue-600 to-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-sm">
                    {user?.firstName ? user.firstName.charAt(0).toUpperCase() : "U"}
                  </div>
                </button>

                {/* Profile Dropdown */}
                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl py-2 z-50 border border-gray-100 animate-fadeIn">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-bold text-gray-900 truncate">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                      <span className="mt-1 inline-block px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded bg-blue-100 text-blue-700">
                        {user?.role || "user"}
                      </span>
                    </div>

                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition flex items-center gap-2"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      <span>👤</span>
                      <span>Profile</span>
                    </Link>

                    <Link
                      to="/bookings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition flex items-center gap-2"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      <span>🧳</span>
                      <span>My Bookings</span>
                    </Link>

                    <div className="border-t border-gray-100 my-1"></div>

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition flex items-center gap-2"
                    >
                      <span>🚪</span>
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2 ml-2">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-blue-600 px-3 py-1.5 rounded-lg text-sm font-medium transition hover:bg-gray-50"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition shadow-sm"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 hover:text-blue-600 p-2 rounded-lg focus:outline-none hover:bg-gray-100"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Navigation (Strictly md:hidden) */}
        {isMobileMenuOpen && (
          <div className="md:hidden px-3 pt-2 pb-4 space-y-1 bg-white border-t border-gray-100 rounded-b-xl shadow-lg">
            <Link
              to="/"
              className={`block px-3 py-2 rounded-lg text-base font-medium transition ${
                isActive("/") ? "bg-blue-50 text-blue-600 font-semibold" : "text-gray-700 hover:bg-gray-50"
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/bookings"
                  className={`block px-3 py-2 rounded-lg text-base font-medium transition ${
                    isActive("/bookings") ? "bg-blue-50 text-blue-600 font-semibold" : "text-gray-700 hover:bg-gray-50"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  My Bookings
                </Link>

                {user?.role === "admin" ? (
                  <Link
                    to="/admin/host-verification"
                    className="block px-3 py-2 rounded-lg text-base font-medium bg-red-50 text-red-600 hover:bg-red-100"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    🛡️ Admin Panel
                  </Link>
                ) : user?.role === "host" ? (
                  <>
                    <Link
                      to="/host/dashboard"
                      className="block px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-50"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      📊 Host Dashboard
                    </Link>
                    <Link
                      to="/listings/new"
                      className="block px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-50"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      ➕ List New Property
                    </Link>
                  </>
                ) : (
                  <Link
                    to="/host/apply"
                    className="block px-3 py-2 rounded-lg text-base font-medium bg-blue-600 text-white hover:bg-blue-700"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Apply for Host →
                  </Link>
                )}

                <Link
                  to="/profile"
                  className="block px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  👤 Profile ({user?.firstName})
                </Link>

                <button
                  onClick={handleLogout}
                  className="w-full text-left block px-3 py-2 rounded-lg text-base font-medium text-red-600 hover:bg-red-50"
                >
                  🚪 Logout
                </button>
              </>
            ) : (
              <div className="pt-2 border-t border-gray-100 space-y-2">
                <Link
                  to="/login"
                  className="block px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block px-3 py-2 rounded-lg text-base font-medium bg-blue-600 text-white text-center hover:bg-blue-700"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
