import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

const HostVerificationForm = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Step 1: Personal Info
  const [personalInfo, setPersonalInfo] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
  });

  // Step 2: Documents
  const [documents, setDocuments] = useState({
    aadharNumber: "",
    aadharFile: "",
    panNumber: "",
    panFile: "",
  });

  // Step 3: Bank Details
  const [bankDetails, setBankDetails] = useState({
    accountNumber: "",
    ifscCode: "",
    accountHolderName: "",
  });

  // Step 4: Location
  const [location, setLocation] = useState({
    address: "",
    city: "",
    state: "",
    country: "",
  });

  const handlePersonalInfoChange = (e) => {
    const { name, value } = e.target;
    setPersonalInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleDocumentChange = (e) => {
    const { name, value, files } = e.target;
    if (files && files[0]) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setDocuments((prev) => ({ ...prev, [name]: ev.target.result }));
      };
      reader.readAsDataURL(files[0]);
    } else {
      setDocuments((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleBankDetailsChange = (e) => {
    const { name, value } = e.target;
    setBankDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleLocationChange = (e) => {
    const { name, value } = e.target;
    setLocation((prev) => ({ ...prev, [name]: value }));
  };

  const submitStep = async () => {
    try {
      setLoading(true);
      setError("");

      let stepData = {};
      if (currentStep === 1) stepData = personalInfo;
      else if (currentStep === 2) stepData = documents;
      else if (currentStep === 3) stepData = bankDetails;
      else if (currentStep === 4) stepData = location;

      await api.post(`/host-verification/step/${currentStep}`, stepData);

      if (currentStep < 4) {
        setCurrentStep(currentStep + 1);
      } else {
        setSuccess("✅ Verification submitted successfully! Redirecting...");
        setTimeout(() => {
          navigate("/host/verification-pending");
        }, 1200);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error submitting step");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
          Host Verification
        </h1>
        <p className="text-gray-600 text-sm mb-6">
          Complete KYC to start hosting guests and listing properties on StayFinder.
        </p>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`flex-1 h-2.5 mx-1 rounded-full transition-all duration-300 ${
                  step <= currentStep ? "bg-blue-600" : "bg-gray-200"
                }`}
              ></div>
            ))}
          </div>
          <p className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Step {currentStep} of 4: {
              currentStep === 1 ? "Personal Details" :
              currentStep === 2 ? "Identity Documents" :
              currentStep === 3 ? "Bank Account" : "Property Address"
            }
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm">
            {success}
          </div>
        )}

        {/* Step 1: Personal Info */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">First Name</label>
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={personalInfo.firstName}
                onChange={handlePersonalInfoChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Last Name</label>
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={personalInfo.lastName}
                onChange={handlePersonalInfoChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Phone Number</label>
              <input
                type="tel"
                name="phoneNumber"
                placeholder="e.g. +91 9876543210"
                value={personalInfo.phoneNumber}
                onChange={handlePersonalInfoChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
          </div>
        )}

        {/* Step 2: Documents */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Aadhaar Card Number</label>
              <input
                type="text"
                name="aadharNumber"
                placeholder="12-digit Aadhaar Number"
                value={documents.aadharNumber}
                onChange={handleDocumentChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Upload Aadhaar Photo</label>
              <input
                type="file"
                name="aadharFile"
                accept="image/*,.pdf"
                onChange={handleDocumentChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">PAN Card Number</label>
              <input
                type="text"
                name="panNumber"
                placeholder="10-digit PAN (e.g. ABCDE1234F)"
                value={documents.panNumber}
                onChange={handleDocumentChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm uppercase"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Upload PAN Photo</label>
              <input
                type="file"
                name="panFile"
                accept="image/*,.pdf"
                onChange={handleDocumentChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm"
              />
            </div>
          </div>
        )}

        {/* Step 3: Bank Details */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Bank Account Number</label>
              <input
                type="text"
                name="accountNumber"
                placeholder="Account Number"
                value={bankDetails.accountNumber}
                onChange={handleBankDetailsChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">IFSC Code</label>
              <input
                type="text"
                name="ifscCode"
                placeholder="e.g. SBIN0001234"
                value={bankDetails.ifscCode}
                onChange={handleBankDetailsChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm uppercase"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Account Holder Name</label>
              <input
                type="text"
                name="accountHolderName"
                placeholder="Name as per bank records"
                value={bankDetails.accountHolderName}
                onChange={handleBankDetailsChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
          </div>
        )}

        {/* Step 4: Location */}
        {currentStep === 4 && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Street Address</label>
              <input
                type="text"
                name="address"
                placeholder="House / Street / Area"
                value={location.address}
                onChange={handleLocationChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">City</label>
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={location.city}
                  onChange={handleLocationChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">State</label>
                <input
                  type="text"
                  name="state"
                  placeholder="State"
                  value={location.state}
                  onChange={handleLocationChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Country</label>
              <input
                type="text"
                name="country"
                placeholder="Country (e.g. India, USA)"
                value={location.country}
                onChange={handleLocationChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-4 mt-8">
          {currentStep > 1 && (
            <button
              onClick={() => setCurrentStep(currentStep - 1)}
              className="flex-1 px-6 py-2.5 border border-gray-300 rounded-xl hover:bg-gray-50 transition text-sm font-semibold text-gray-700"
            >
              Previous
            </button>
          )}
          <button
            onClick={submitStep}
            disabled={loading}
            className="flex-1 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-xl transition text-sm font-semibold shadow-md"
          >
            {loading ? "Submitting..." : currentStep === 4 ? "Complete Verification" : "Continue →"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HostVerificationForm;
