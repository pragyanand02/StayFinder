import React, { useState } from "react";

const SearchBar = ({ onSearch, loading = false }) => {
  const [searchData, setSearchData] = useState({
    location: "",
    checkIn: "",
    checkOut: "",
    guests: 1,
    minPrice: "",
    maxPrice: "",
    propertyType: "",
  });

  const popularDestinations = [
    { label: "🏖️ Goa, India", query: "Goa" },
    { label: "🏰 Jaipur, India", query: "Jaipur" },
    { label: "🏔️ Manali, India", query: "Manali" },
    { label: "🌴 Kerala, India", query: "Alleppey" },
    { label: "🌊 Udaipur, India", query: "Udaipur" },
    { label: "🏙️ Mumbai, India", query: "Mumbai" },
    { label: "🌺 Bali, Indonesia", query: "Bali" },
    { label: "🗼 Paris, France", query: "Paris" },
    { label: "✨ Dubai, UAE", query: "Dubai" },
    { label: "🌅 Santorini, Greece", query: "Santorini" },
    { label: "🗾 Tokyo, Japan", query: "Tokyo" },
    { label: "🏝️ Maldives", query: "Malé" },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleQuickDestination = (query) => {
    const updated = { ...searchData, location: query };
    setSearchData(updated);
    onSearch(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchData);
  };

  const propertyTypes = [
    { value: "", label: "Any Property Type" },
    { value: "villa", label: "Luxury Villa" },
    { value: "house", label: "Heritage House / Haveli" },
    { value: "apartment", label: "Apartment / Penthouse" },
    { value: "cabin", label: "Mountain Cabin / Chalet" },
    { value: "condo", label: "Condo" },
    { value: "studio", label: "Studio" },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 mb-8">
      {/* Quick Destination Chips */}
      <div className="mb-4">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
          Popular Destinations (Desh-Videsh):
        </p>
        <div className="flex overflow-x-auto gap-2 pb-1 no-scrollbar">
          {popularDestinations.map((dest, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleQuickDestination(dest.query)}
              className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium transition ${
                searchData.location.toLowerCase() === dest.query.toLowerCase()
                  ? "bg-blue-600 text-white shadow-sm font-semibold"
                  : "bg-gray-100 hover:bg-blue-50 hover:text-blue-600 text-gray-700 border border-gray-200/60"
              }`}
            >
              {dest.label}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Location */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Destination / City / Country
            </label>
            <input
              type="text"
              name="location"
              value={searchData.location}
              onChange={handleInputChange}
              placeholder="e.g. Goa, Jaipur, Paris, Bali..."
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          {/* Check-in */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Check-in Date
            </label>
            <input
              type="date"
              name="checkIn"
              value={searchData.checkIn}
              onChange={handleInputChange}
              min={new Date().toISOString().split("T")[0]}
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          {/* Check-out */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Check-out Date
            </label>
            <input
              type="date"
              name="checkOut"
              value={searchData.checkOut}
              onChange={handleInputChange}
              min={searchData.checkIn || new Date().toISOString().split("T")[0]}
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          {/* Guests */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Guests
            </label>
            <select
              name="guests"
              value={searchData.guests}
              onChange={handleInputChange}
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 10].map((num) => (
                <option key={num} value={num}>
                  {num} {num === 1 ? "Guest" : "Guests"}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Advanced Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 border-t border-gray-100">
          {/* Property Type */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Accommodation Type
            </label>
            <select
              name="propertyType"
              value={searchData.propertyType}
              onChange={handleInputChange}
              className="w-full px-3.5 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
            >
              {propertyTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Min Price */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Min Price ($/night)
            </label>
            <input
              type="number"
              name="minPrice"
              value={searchData.minPrice}
              onChange={handleInputChange}
              placeholder="0"
              min="0"
              className="w-full px-3.5 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          {/* Max Price */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Max Price ($/night)
            </label>
            <input
              type="number"
              name="maxPrice"
              value={searchData.maxPrice}
              onChange={handleInputChange}
              placeholder="1000"
              min="0"
              className="w-full px-3.5 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
        </div>

        {/* Search Button */}
        <div className="flex justify-center pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 px-10 rounded-xl shadow-lg transition duration-200 disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Searching stays...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span>Search Stays</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;
