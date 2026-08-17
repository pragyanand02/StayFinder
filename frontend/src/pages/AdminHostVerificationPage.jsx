import React, { useState, useEffect } from "react";
import api from "../api";
import LoadingSpinner from "../components/LoadingSpinner";

const AdminHostVerificationPage = () => {
  const [applications, setApplications] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchPendingApplications();
  }, []);

  const fetchPendingApplications = async () => {
    try {
      setLoading(true);
      const response = await api.get("/host-verification/pending");
      setApplications(response.data.verifications || []);
    } catch (error) {
      console.error("Error fetching applications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!selectedApp) return;

    try {
      setActionLoading(true);
      await api.put(`/host-verification/${selectedApp._id}/approve`, { notes });
      alert("✅ Application approved! Host role has been granted.");
      setSelectedApp(null);
      setNotes("");
      fetchPendingApplications();
    } catch (error) {
      console.error("Error approving application:", error);
      alert(error.response?.data?.message || "Error approving application");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!selectedApp) return;

    const reason = prompt("Enter rejection reason:");
    if (!reason) return;

    try {
      setActionLoading(true);
      await api.put(`/host-verification/${selectedApp._id}/reject`, {
        rejectionReason: reason,
      });
      alert("Application rejected.");
      setSelectedApp(null);
      setNotes("");
      fetchPendingApplications();
    } catch (error) {
      console.error("Error rejecting application:", error);
      alert(error.response?.data?.message || "Error rejecting application");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" text="Loading verification requests..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">
              Host Verification Requests
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              Review KYC submissions, identity documents, and approve host privileges.
            </p>
          </div>
          <button
            onClick={fetchPendingApplications}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm"
          >
            🔄 Refresh
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Applications List */}
          <div className="md:col-span-1 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-gray-50/50">
              <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                Pending ({applications.length})
              </h2>
            </div>
            <div className="divide-y divide-gray-100 max-h-[500px] overflow-y-auto">
              {applications.length === 0 ? (
                <div className="p-8 text-center text-gray-400 text-sm">
                  No pending verification requests 🎉
                </div>
              ) : (
                applications.map((app) => (
                  <div
                    key={app._id}
                    onClick={() => setSelectedApp(app)}
                    className={`p-4 cursor-pointer transition ${
                      selectedApp?._id === app._id
                        ? "bg-blue-50 border-l-4 border-blue-600"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <p className="font-semibold text-gray-900 text-sm">
                      {app.user?.firstName} {app.user?.lastName}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{app.user?.email}</p>
                    <p className="text-[11px] text-gray-400 mt-1">
                      Submitted: {new Date(app.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Application Details */}
          <div className="md:col-span-2">
            {selectedApp ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
                <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {selectedApp.user?.firstName} {selectedApp.user?.lastName}
                    </h2>
                    <p className="text-xs text-gray-500">{selectedApp.user?.email}</p>
                  </div>
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">
                    Pending Review
                  </span>
                </div>

                {/* Personal Info */}
                <div>
                  <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-2">
                    1. Personal Information
                  </h3>
                  <div className="grid grid-cols-2 gap-3 bg-gray-50 p-4 rounded-xl text-sm">
                    <div>
                      <p className="text-xs text-gray-500">First Name</p>
                      <p className="font-semibold">{selectedApp.personalInfo?.firstName || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Last Name</p>
                      <p className="font-semibold">{selectedApp.personalInfo?.lastName || "N/A"}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-xs text-gray-500">Phone Number</p>
                      <p className="font-semibold">{selectedApp.personalInfo?.phoneNumber || "N/A"}</p>
                    </div>
                  </div>
                </div>

                {/* Identity Documents */}
                <div>
                  <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-2">
                    2. Documents
                  </h3>
                  <div className="grid grid-cols-2 gap-3 bg-gray-50 p-4 rounded-xl text-sm">
                    <div>
                      <p className="text-xs text-gray-500">Aadhaar Number</p>
                      <p className="font-semibold">{selectedApp.documents?.aadharNumber || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">PAN Number</p>
                      <p className="font-semibold uppercase">{selectedApp.documents?.panNumber || "N/A"}</p>
                    </div>
                  </div>
                </div>

                {/* Bank Details */}
                <div>
                  <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-2">
                    3. Bank Details
                  </h3>
                  <div className="grid grid-cols-2 gap-3 bg-gray-50 p-4 rounded-xl text-sm">
                    <div>
                      <p className="text-xs text-gray-500">Account Number</p>
                      <p className="font-semibold">{selectedApp.bankDetails?.accountNumber || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">IFSC Code</p>
                      <p className="font-semibold uppercase">{selectedApp.bankDetails?.ifscCode || "N/A"}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-xs text-gray-500">Account Holder Name</p>
                      <p className="font-semibold">{selectedApp.bankDetails?.accountHolderName || "N/A"}</p>
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div>
                  <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-2">
                    4. Location
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-xl text-sm">
                    <p className="font-medium text-gray-800">
                      {selectedApp.locationVerification?.address || "Address not provided"}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {selectedApp.locationVerification?.city}, {selectedApp.locationVerification?.state}, {selectedApp.locationVerification?.country}
                    </p>
                  </div>
                </div>

                {/* Admin Notes */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                    Admin Notes
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    rows="2"
                    placeholder="Add approval / rejection notes (optional)..."
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={handleApprove}
                    disabled={actionLoading}
                    className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-bold py-2.5 px-4 rounded-xl shadow transition text-sm"
                  >
                    {actionLoading ? "Processing..." : "✅ Approve Host"}
                  </button>
                  <button
                    onClick={handleReject}
                    disabled={actionLoading}
                    className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold py-2.5 px-4 rounded-xl shadow transition text-sm"
                  >
                    {actionLoading ? "Processing..." : "❌ Reject Application"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center text-gray-400">
                <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Select an applicant from the left to view their KYC documents and approve.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHostVerificationPage;
