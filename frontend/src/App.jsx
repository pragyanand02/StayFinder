import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import ChatButton from "./components/Chat/ChatButton.jsx";
import MobileBottomNav from "./components/MobileBottomNav.jsx";
import HomePage from "./pages/HomePage.jsx";
import ListingDetailPage from "./pages/ListingDetailPage.jsx";
import CreateListingPage from "./pages/CreateListingPage.jsx";
import EditListingPage from "./pages/EditListingPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import BookingsPage from "./pages/BookingsPage.jsx";
import HostDashboard from "./pages/HostDashboard.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminHostVerificationPage from "./pages/AdminHostVerificationPage";
import "./index.css";
import "./App.css";

const App = () => (
  <AuthProvider>
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <main className="flex-grow pb-12 md:pb-0">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/listings/:id" element={<ListingDetailPage />} />
            <Route
              path="/listings/new"
              element={
                <ProtectedRoute>
                  <CreateListingPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/listings/:id/edit"
              element={
                <ProtectedRoute>
                  <EditListingPage />
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
              path="/bookings"
              element={
                <ProtectedRoute>
                  <BookingsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/host/dashboard"
              element={
                <ProtectedRoute>
                  <HostDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route path="/host/become" element={<Navigate to="/" replace />} />
            <Route path="/host/apply" element={<Navigate to="/" replace />} />
            <Route path="/host/verification-pending" element={<Navigate to="/" replace />} />
            <Route
              path="/admin/host-verification"
              element={
                <ProtectedRoute>
                  <AdminHostVerificationPage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
        <MobileBottomNav />
        <ChatButton />
      </div>
    </Router>
  </AuthProvider>
);

export default App;
