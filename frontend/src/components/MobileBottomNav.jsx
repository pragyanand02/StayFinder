import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const MobileBottomNav = () => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 px-2 py-1 shadow-lg">
      <div className="flex justify-around items-center">
        {/* Explore / Home */}
        <Link
          to="/"
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-xs font-medium ${
            isActive("/") ? "text-blue-600 font-bold" : "text-gray-500 hover:text-blue-500"
          }`}
        >
          <svg className="w-6 h-6 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Explore
        </Link>

        {/* My Bookings */}
        <Link
          to={isAuthenticated ? "/bookings" : "/login"}
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-xs font-medium ${
            isActive("/bookings") ? "text-blue-600 font-bold" : "text-gray-500 hover:text-blue-500"
          }`}
        >
          <svg className="w-6 h-6 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Trips
        </Link>

        {/* Host/Admin Section */}
        {isAuthenticated && user?.role === "host" ? (
          <Link
            to="/host/dashboard"
            className={`flex flex-col items-center py-1 px-2 rounded-lg text-xs font-medium ${
              isActive("/host/dashboard") ? "text-blue-600 font-bold" : "text-gray-500 hover:text-blue-500"
            }`}
          >
            <svg className="w-6 h-6 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            Dashboard
          </Link>
        ) : isAuthenticated && user?.role === "admin" ? (
          <Link
            to="/admin/host-verification"
            className={`flex flex-col items-center py-1 px-2 rounded-lg text-xs font-medium ${
              isActive("/admin/host-verification") ? "text-red-600 font-bold" : "text-gray-500 hover:text-red-500"
            }`}
          >
            <svg className="w-6 h-6 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Admin
          </Link>
        ) : (
          <Link
            to={isAuthenticated ? "/host/apply" : "/login"}
            className={`flex flex-col items-center py-1 px-2 rounded-lg text-xs font-medium ${
              isActive("/host/apply") ? "text-blue-600 font-bold" : "text-gray-500 hover:text-blue-500"
            }`}
          >
            <svg className="w-6 h-6 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Host
          </Link>
        )}

        {/* User Profile / Account */}
        <Link
          to={isAuthenticated ? "/profile" : "/login"}
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-xs font-medium ${
            isActive("/profile") || isActive("/login") ? "text-blue-600 font-bold" : "text-gray-500 hover:text-blue-500"
          }`}
        >
          {isAuthenticated ? (
            <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold mb-0.5">
              {user?.firstName ? user.firstName.charAt(0).toUpperCase() : "U"}
            </div>
          ) : (
            <svg className="w-6 h-6 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          )}
          <span>{isAuthenticated ? (user?.firstName || "Account") : "Log In"}</span>
        </Link>
      </div>
    </div>
  );
};

export default MobileBottomNav;
