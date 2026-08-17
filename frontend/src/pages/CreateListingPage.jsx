import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

const CreateListingPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    locationAddress: "",
    locationCity: "",
    locationState: "",
    locationCountry: "",
    lat: "",
    lng: "",
    priceBase: "",
    currency: "USD",
    cleaningFee: "",
    serviceFee: "",
    propertyType: "house",
    roomType: "entire",
    maxGuests: "2",
    bedrooms: "1",
    beds: "1",
    bathrooms: "1",
    amenities: [],
  });

  const amenityOptions = [
    "WiFi",
    "Kitchen",
    "Free parking",
    "Air conditioning",
    "Heating",
    "Washer",
    "Dryer",
    "TV",
    "Pool",
    "Hot tub",
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAmenityToggle = (amenity) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  // Handle image file uploads
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setLoading(true);
    setError(null);

    const uploadPromises = files.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            const maxWidth = 800;
            const maxHeight = 600;
            let width = img.width;
            let height = img.height;

            if (width > height) {
              if (width > maxWidth) {
                height *= maxWidth / width;
                width = maxWidth;
              }
            } else {
              if (height > maxHeight) {
                width *= maxHeight / height;
                height = maxHeight;
              }
            }

            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0, width, height);
            const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.7);
            resolve(compressedDataUrl);
          };
          img.onerror = () => resolve(event.target.result);
          img.src = event.target.result;
        };
        reader.onerror = () => resolve(null);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(uploadPromises)
      .then((newImages) => {
        const validImages = newImages.filter(Boolean);
        if (validImages.length > 0) {
          setUploadedImages((prev) => [...prev, ...validImages]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Upload error:", err);
        setLoading(false);
      });
  };

  const removeImage = (index) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Upload image to Cloudinary if configured, otherwise pass base64 directly
  const uploadImageToCloudinary = async (base64Image) => {
    try {
      const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
      const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

      if (!cloudName || !uploadPreset) {
        // Return base64 directly; backend cloudinary service will process it
        return base64Image;
      }

      const uploadData = new FormData();
      uploadData.append("file", base64Image);
      uploadData.append("upload_preset", uploadPreset);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/upload`,
        {
          method: "POST",
          body: uploadData,
        }
      );

      if (!response.ok) {
        return base64Image;
      }

      const data = await response.json();
      return data.secure_url || base64Image;
    } catch (error) {
      console.warn("Cloudinary direct upload skipped, using backend upload fallback:", error);
      return base64Image;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      if (uploadedImages.length === 0) {
        setError("Please upload at least one image");
        setLoading(false);
        return;
      }

      const imageUploadPromises = uploadedImages.map((img) =>
        uploadImageToCloudinary(img)
      );
      const imageUrls = await Promise.all(imageUploadPromises);

      const payload = {
        title: formData.title,
        description: formData.description,
        location: {
          address: formData.locationAddress,
          city: formData.locationCity,
          state: formData.locationState,
          country: formData.locationCountry,
          coordinates: {
            lat: Number(formData.lat) || 25.7617,
            lng: Number(formData.lng) || -80.1918,
          },
        },
        price: {
          base: Number(formData.priceBase),
          currency: formData.currency || "USD",
          cleaningFee: formData.cleaningFee ? Number(formData.cleaningFee) : 0,
          serviceFee: formData.serviceFee ? Number(formData.serviceFee) : 0,
        },
        images: imageUrls,
        amenities: formData.amenities,
        propertyType: formData.propertyType,
        roomType: formData.roomType,
        maxGuests: Number(formData.maxGuests) || 1,
        bedrooms: Number(formData.bedrooms) || 1,
        beds: Number(formData.beds) || 1,
        bathrooms: Number(formData.bathrooms) || 1,
      };

      await api.post("/listings", payload);
      navigate("/host/dashboard");
    } catch (err) {
      console.error("Error in form submission:", err);
      setError(
        err.response?.data?.message ||
          err.response?.data?.errors?.[0]?.msg ||
          err.message ||
          "Failed to create listing"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Create New Listing</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-md">{error}</div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address
            </label>
            <input
              type="text"
              name="locationAddress"
              value={formData.locationAddress}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              City
            </label>
            <input
              type="text"
              name="locationCity"
              value={formData.locationCity}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              State
            </label>
            <input
              type="text"
              name="locationState"
              value={formData.locationState}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Country
            </label>
            <input
              type="text"
              name="locationCountry"
              value={formData.locationCountry}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price per night
            </label>
            <input
              type="number"
              name="priceBase"
              value={formData.priceBase}
              onChange={handleInputChange}
              required
              min="0"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Currency
            </label>
            <select
              name="currency"
              value={formData.currency}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="USD">USD ($)</option>
              <option value="INR">INR (₹)</option>
              <option value="EUR">EUR (€)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cleaning fee
            </label>
            <input
              type="number"
              name="cleaningFee"
              value={formData.cleaningFee}
              onChange={handleInputChange}
              min="0"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Service fee
            </label>
            <input
              type="number"
              name="serviceFee"
              value={formData.serviceFee}
              onChange={handleInputChange}
              min="0"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Property type
            </label>
            <select
              name="propertyType"
              value={formData.propertyType}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="house">House</option>
              <option value="apartment">Apartment</option>
              <option value="condo">Condo</option>
              <option value="villa">Villa</option>
              <option value="cabin">Cabin</option>
              <option value="studio">Studio</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Room type
            </label>
            <select
              name="roomType"
              value={formData.roomType}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="entire">Entire place</option>
              <option value="private">Private room</option>
              <option value="shared">Shared room</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Maximum guests
            </label>
            <input
              type="number"
              name="maxGuests"
              value={formData.maxGuests}
              onChange={handleInputChange}
              required
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bedrooms
            </label>
            <input
              type="number"
              name="bedrooms"
              value={formData.bedrooms}
              onChange={handleInputChange}
              required
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Beds
            </label>
            <input
              type="number"
              name="beds"
              value={formData.beds}
              onChange={handleInputChange}
              required
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bathrooms
            </label>
            <input
              type="number"
              name="bathrooms"
              value={formData.bathrooms}
              onChange={handleInputChange}
              required
              min="1"
              step="0.5"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
            rows="4"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amenities
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {amenityOptions.map((amenity) => (
              <label key={amenity} className="inline-flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.amenities.includes(amenity)}
                  onChange={() => handleAmenityToggle(amenity)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{amenity}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Images
          </label>
          <div className="flex items-center">
            <label className="flex items-center px-4 py-2 bg-white text-blue-600 rounded-md border border-blue-600 cursor-pointer hover:bg-blue-50">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 11v5m4-5v5"
                />
              </svg>
              Choose Images
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
            <span className="ml-3 text-sm text-gray-500">
              Upload property images (JPG, PNG)
            </span>
          </div>

          {/* Image preview section */}
          {uploadedImages.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 mb-2">
                Uploaded Images ({uploadedImages.length})
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {uploadedImages.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image}
                      alt={`Property image ${index + 1}`}
                      className="w-full h-32 object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate("/host/dashboard")}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating..." : "Create Listing"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateListingPage;
