// Calculate carbon footprint for a property
const calculateCarbonFootprint = async (propertyData) => {
  try {
    let baseEmissions = 5; // kg CO2e per night

    // Adjust based on property type
    const propertyTypeMultiplier = {
      apartment: 0.8,
      house: 1.2,
      villa: 1.5,
      cottage: 0.9,
      studio: 0.6,
      cabin: 0.7,
      condo: 0.8,
    };

    const multiplier =
      propertyTypeMultiplier[propertyData.propertyType] || 1;
    baseEmissions *= multiplier;

    // Adjust based on amenities
    if (propertyData.amenities && Array.isArray(propertyData.amenities)) {
      const lowerAmenities = propertyData.amenities.map((a) => String(a).toLowerCase());
      if (lowerAmenities.includes("pool")) baseEmissions += 2;
      if (lowerAmenities.includes("hot_tub") || lowerAmenities.includes("hot tub")) baseEmissions += 1.5;
      if (lowerAmenities.includes("gym")) baseEmissions += 1;
      if (lowerAmenities.includes("ac") || lowerAmenities.includes("air conditioning")) baseEmissions += 1;
    }

    // Adjust based on max guests
    if (propertyData.maxGuests) {
      baseEmissions += propertyData.maxGuests * 0.5;
    }

    const perNight = Math.round(baseEmissions * 100) / 100;

    return {
      value: perNight,
      perNight: perNight,
      unit: "kg CO2e",
      category: "accommodation",
      calculatedAt: new Date(),
    };
  } catch (error) {
    console.error("Error calculating carbon footprint:", error);
    return {
      value: 5,
      perNight: 5,
      unit: "kg CO2e",
      category: "accommodation",
      calculatedAt: new Date(),
    };
  }
};

// Get carbon footprint for multiple properties
const getCarbonFootprintBatch = async (properties) => {
  try {
    const results = await Promise.all(
      properties.map((property) => calculateCarbonFootprint(property))
    );
    return results;
  } catch (error) {
    console.error("Error calculating batch carbon footprint:", error);
    return properties.map(() => ({
      value: 5,
      perNight: 5,
      unit: "kg CO2e",
      category: "accommodation",
      calculatedAt: new Date(),
    }));
  }
};

module.exports = {
  calculateCarbonFootprint,
  getCarbonFootprintBatch,
};
