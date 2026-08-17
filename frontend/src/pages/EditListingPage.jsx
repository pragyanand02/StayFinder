import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api";
import LoadingSpinner from "../components/LoadingSpinner";

const EditListingPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
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
    maxGuests: "",
    bedrooms: "",
    beds: "",
    bathrooms: "",
    amenities: [],
    images: [],
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

  useEffect(() => {
    loadListing();
  }, [id]);

  const loadListing = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/listings/${id}`);
      const listing = response.data;
      setFormData({
        title: listing.title || "",
        description: listing.description || "",
        locationAddress: listing.location?.address || "",
        locationCity: listing.location?.city || "",
        locationState: listing.location?.state || "",
        locationCountry: listing.location?.country || "",
        lat: listing.location?.coordinates?.lat ?? "",
        lng: listing.location?.coordinates?.lng ?? "",
        priceBase: listing.price?.base ?? "",
        currency: listing.price?.currency || "USD",
        cleaningFee: listing.price?.cleaningFee ?? "",
        serviceFee: listing.price?.serviceFee ?? "",
        propertyType: listing.propertyType || "house",
        roomType: listing.roomType || "entire",
        maxGuests: listing.maxGuests ?? "",
        bedrooms: listing.bedrooms ?? "",
        beds: listing.beds ?? "",
        bathrooms: listing.bathrooms ?? "",
        amenities: listing.amenities || [],
        images: listing.images || [],
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load listing");
    } finally {
      setLoading(false);
    }
  };

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

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, { url: event.target.result, publicId: `new_${Date.now()}` }],
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);

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
        propertyType: formData.propertyType,
        roomType: formData.roomType,
        maxGuests: Number(formData.maxGuests),
        bedrooms: Number(formData.bedrooms),
        beds: Number(formData.beds),
        bathrooms: Number(formData.bathrooms),
        amenities: formData.amenities,
        images: formData.images.map((img) => (typeof img === "object" ? img.url : img)),
      };

      await api.put(`/listings/${id}`, payload);
      navigate("/host/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update listing");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" text="Loading listing details..." />;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Edit Listing</h1>

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
              Property Type
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
              Room Type
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
              <label
                key={amenity}
                className="inline-flex items-center space-x-2"
              >
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
            Current Images
          </label>
          {formData.images.length > 0 ? (
            <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {formData.images.map((image, index) => {
                const imgUrl = typeof image === "object" ? image.url : image;
                return (
                  <div key={index} className="relative group">
                    <img
                      src={imgUrl || "/images/no-image-placeholder.jpg"}
                      alt={`Property ${index + 1}`}
                      className="w-full h-32 object-cover rounded-md"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/images/no-image-placeholder.jpg";
                      }}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          images: prev.images.filter((_, i) => i !== index),
                        }))
                      }
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
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
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500">No images uploaded yet</p>
          )}

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Add New Images
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
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
            disabled={saving}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditListingPage;