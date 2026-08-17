import React from "react";
import { Link } from "react-router-dom";
import StarRating from "./StarRating";
import VerifiedBadge from "./VerifiedBadge";

const PropertyCard = ({ property }) => {
  if (!property) return null;

  const imageUrl =
    property.images?.[0]?.url ||
    (typeof property.images?.[0] === "string" ? property.images[0] : "") ||
    "/images/no-image-placeholder.jpg";

  const carbonScore =
    property.carbonFootprint?.perNight ||
    property.carbonFootprint?.value ||
    0;

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100 flex flex-col h-full">
      <Link to={`/listings/${property._id}`} className="flex flex-col h-full">
        {/* Image & Badges */}
        <div className="relative overflow-hidden aspect-[4/3] bg-gray-100">
          <img
            src={imageUrl}
            alt={property.title || "Property"}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/images/no-image-placeholder.jpg";
            }}
          />
          <div className="absolute top-3 right-3">
            <span className="bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-semibold text-gray-800 capitalize shadow-sm">
              {property.propertyType || "Stay"}
            </span>
          </div>
          {property.averageRating > 0 && (
            <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center shadow-sm">
              <StarRating rating={property.averageRating} size="sm" />
              <span className="text-xs font-bold text-gray-800 ml-1">
                {property.averageRating.toFixed(1)}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-1">
          {/* Title & Verified Badge */}
          <div className="mb-1">
            <h3 className="text-base font-bold text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
              {property.title}
            </h3>
            {property.host?.isVerified && (
              <div className="mt-0.5">
                <VerifiedBadge isVerified={true} size="sm" showText={true} />
              </div>
            )}
          </div>

          {/* Location */}
          <div className="flex items-center text-gray-500 text-xs mb-3">
            <svg
              className="w-3.5 h-3.5 mr-1 text-gray-400 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="truncate">
              {property.location?.city ? `${property.location.city}, ` : ""}
              {property.location?.country || "Global"}
            </span>
          </div>

          {/* Capacity specs */}
          <div className="flex items-center justify-between text-xs text-gray-500 mb-3 bg-gray-50 py-1.5 px-2.5 rounded-lg">
            <span>👥 {property.maxGuests || 1} guests</span>
            <span>🛏️ {property.bedrooms || 1} bed{(property.bedrooms || 1) > 1 ? "s" : ""}</span>
            <span>🚿 {property.bathrooms || 1} bath</span>
          </div>

          <div className="flex-1" />

          {/* Carbon Footprint badge if applicable */}
          {carbonScore > 0 && (
            <div className="bg-emerald-50/80 border border-emerald-200/60 rounded-lg py-1 px-2.5 flex items-center justify-between text-[11px] mb-3">
              <span className="text-emerald-700 font-medium flex items-center gap-1">
                🌱 Eco-Score
              </span>
              <span className="text-emerald-800 font-bold">
                {carbonScore} kg CO2e/night
              </span>
            </div>
          )}

          {/* Pricing */}
          <div className="flex items-baseline justify-between pt-2 border-t border-gray-100">
            <div>
              <span className="text-lg font-extrabold text-gray-900">
                ${property.price?.base || 0}
              </span>
              <span className="text-gray-500 text-xs ml-1 font-normal">/ night</span>
            </div>
            {property.price?.cleaningFee > 0 && (
              <span className="text-[11px] text-gray-400">
                +${property.price.cleaningFee} cleaning
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default PropertyCard;
