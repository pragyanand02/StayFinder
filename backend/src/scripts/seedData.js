require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");
const Listing = require("../models/Listing");
const connectDB = require("../config/db");
const { calculateCarbonFootprint } = require("../services/carbonService");

const seedData = async () => {
  try {
    await connectDB();

    console.log("🧹 Clearing existing listings and seed users...");
    await User.deleteMany({
      email: {
        $in: [
          "rohit.sharma@stayfinder.in",
          "priya.patel@stayfinder.in",
          "arjun.singh@stayfinder.in",
          "claire.dubois@stayfinder.com",
          "wayan.bali@stayfinder.com",
          "kenji.tokyo@stayfinder.com",
          "user@example.com",
          "john.host@example.com",
          "jane.host@example.com",
          "mike.host@example.com",
        ],
      },
    });
    await Listing.deleteMany({});

    console.log("👥 Creating verified hosts for India and International properties...");

    const users = await User.create([
      {
        email: "rohit.sharma@stayfinder.in",
        password: "password123",
        firstName: "Rohit",
        lastName: "Sharma",
        phoneNumber: "+91 9820011223",
        role: "host",
        isVerified: true,
      },
      {
        email: "priya.patel@stayfinder.in",
        password: "password123",
        firstName: "Priya",
        lastName: "Patel",
        phoneNumber: "+91 9879988776",
        role: "host",
        isVerified: true,
      },
      {
        email: "arjun.singh@stayfinder.in",
        password: "password123",
        firstName: "Arjun",
        lastName: "Singh",
        phoneNumber: "+91 9811223344",
        role: "host",
        isVerified: true,
      },
      {
        email: "claire.dubois@stayfinder.com",
        password: "password123",
        firstName: "Claire",
        lastName: "Dubois",
        phoneNumber: "+33 612345678",
        role: "host",
        isVerified: true,
      },
      {
        email: "wayan.bali@stayfinder.com",
        password: "password123",
        firstName: "Wayan",
        lastName: "Suryanata",
        phoneNumber: "+62 8123456789",
        role: "host",
        isVerified: true,
      },
      {
        email: "kenji.tokyo@stayfinder.com",
        password: "password123",
        firstName: "Kenji",
        lastName: "Takahashi",
        phoneNumber: "+81 9012345678",
        role: "host",
        isVerified: true,
      },
      {
        email: "user@example.com",
        password: "password123",
        firstName: "Anand",
        lastName: "Patel",
        phoneNumber: "+91 9898989898",
        role: "user",
      },
    ]);

    console.log(`✅ Created ${users.length} users/hosts.`);

    const hostRohit = users[0]._id;
    const hostPriya = users[1]._id;
    const hostArjun = users[2]._id;
    const hostClaire = users[3]._id;
    const hostWayan = users[4]._id;
    const hostKenji = users[5]._id;

    console.log("🏨 Creating Indian and International Luxury Stays...");

    const sampleListings = [
      // 🇮🇳 INDIA PROPERTIES
      {
        title: "Sunset Palms Beachfront Luxury Villa - Candolim, Goa",
        description:
          "Private 4-bedroom Portuguese luxury villa with direct private access to Candolim beach. Features a private infinity pool, lush tropical garden, in-house chef, and open-air gazebo overlooking the Arabian Sea.",
        host: hostRohit,
        location: {
          address: "Beachfront Villa #4, Candolim Road",
          city: "Goa",
          state: "Goa",
          country: "India",
          coordinates: { lat: 15.518, lng: 73.763 },
        },
        price: {
          base: 180,
          currency: "USD",
          cleaningFee: 30,
          serviceFee: 15,
        },
        images: [
          {
            url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200",
            publicId: "goa_villa_1",
            format: "jpg",
          },
          {
            url: "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1200",
            publicId: "goa_villa_2",
            format: "jpg",
          },
          {
            url: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1200",
            publicId: "goa_villa_3",
            format: "jpg",
          },
        ],
        amenities: [
          "WiFi",
          "Pool",
          "Air conditioning",
          "Kitchen",
          "Free parking",
          "TV",
          "Hot tub",
        ],
        propertyType: "villa",
        roomType: "entire",
        maxGuests: 8,
        bedrooms: 4,
        beds: 5,
        bathrooms: 4,
        averageRating: 4.95,
        status: "active",
      },
      {
        title: "Royal Heritage Haveli & Courtyard Suite - Jaipur, Rajasthan",
        description:
          "Experience royal Rajput hospitality in this 250-year-old restored heritage haveli in the Pink City. Handcrafted jharokhas, marble courtyards, traditional Rajasthani dining, and stunning rooftop views of Nahargarh Fort.",
        host: hostArjun,
        location: {
          address: "Civil Lines, Near Hawa Mahal Road",
          city: "Jaipur",
          state: "Rajasthan",
          country: "India",
          coordinates: { lat: 26.9124, lng: 75.7873 },
        },
        price: {
          base: 140,
          currency: "USD",
          cleaningFee: 25,
          serviceFee: 12,
        },
        images: [
          {
            url: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=1200",
            publicId: "jaipur_haveli_1",
            format: "jpg",
          },
          {
            url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200",
            publicId: "jaipur_haveli_2",
            format: "jpg",
          },
          {
            url: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200",
            publicId: "jaipur_haveli_3",
            format: "jpg",
          },
        ],
        amenities: [
          "WiFi",
          "Air conditioning",
          "Free parking",
          "TV",
          "Kitchen",
        ],
        propertyType: "house",
        roomType: "entire",
        maxGuests: 6,
        bedrooms: 3,
        beds: 3,
        bathrooms: 3,
        averageRating: 4.9,
        status: "active",
      },
      {
        title: "Lake Pichola Palace View Luxury Villa - Udaipur, Rajasthan",
        description:
          "Spectacular lakefront villa directly facing Lake Pichola and the City Palace. Featuring traditional marble carvings, private plunge pool, sunset terrace, and personalized butler service.",
        host: hostArjun,
        location: {
          address: "Haridas Ji Ki Magri, Lake Pichola",
          city: "Udaipur",
          state: "Rajasthan",
          country: "India",
          coordinates: { lat: 24.5854, lng: 73.7125 },
        },
        price: {
          base: 220,
          currency: "USD",
          cleaningFee: 40,
          serviceFee: 20,
        },
        images: [
          {
            url: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200",
            publicId: "udaipur_villa_1",
            format: "jpg",
          },
          {
            url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200",
            publicId: "udaipur_villa_2",
            format: "jpg",
          },
        ],
        amenities: [
          "WiFi",
          "Pool",
          "Air conditioning",
          "Kitchen",
          "Free parking",
          "Hot tub",
        ],
        propertyType: "villa",
        roomType: "entire",
        maxGuests: 6,
        bedrooms: 3,
        beds: 4,
        bathrooms: 3,
        averageRating: 4.98,
        status: "active",
      },
      {
        title: "Himalayan Cedar Wood Chalet & Apple Orchard - Manali",
        description:
          "Cozy handcrafted cedar wood cottage situated inside a serene apple orchard in Old Manali. Panoramic snow-capped mountain views, indoor wood fireplace, private patio, and direct access to mountain trekking trails.",
        host: hostRohit,
        location: {
          address: "Old Manali Village, Log Huts Area",
          city: "Manali",
          state: "Himachal Pradesh",
          country: "India",
          coordinates: { lat: 32.2432, lng: 77.1892 },
        },
        price: {
          base: 95,
          currency: "USD",
          cleaningFee: 20,
          serviceFee: 10,
        },
        images: [
          {
            url: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1200",
            publicId: "manali_chalet_1",
            format: "jpg",
          },
          {
            url: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=1200",
            publicId: "manali_chalet_2",
            format: "jpg",
          },
          {
            url: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1200",
            publicId: "manali_chalet_3",
            format: "jpg",
          },
        ],
        amenities: [
          "WiFi",
          "Heating",
          "Kitchen",
          "Free parking",
          "TV",
        ],
        propertyType: "cabin",
        roomType: "entire",
        maxGuests: 4,
        bedrooms: 2,
        beds: 2,
        bathrooms: 2,
        averageRating: 4.88,
        status: "active",
      },
      {
        title: "Traditional Kerala Backwaters Luxury Houseboat - Alleppey",
        description:
          "Sail through tranquil backwaters, coconut lagoons, and paddy fields on this private premium Kerala Kettuvallam (Houseboat). Includes air-conditioned bedrooms, private sundeck, and authentic Kerala seafood meals prepared by your private chef.",
        host: hostPriya,
        location: {
          address: "Finishing Point Jetty, Punnamada",
          city: "Alleppey",
          state: "Kerala",
          country: "India",
          coordinates: { lat: 9.4981, lng: 76.3388 },
        },
        price: {
          base: 160,
          currency: "USD",
          cleaningFee: 30,
          serviceFee: 15,
        },
        images: [
          {
            url: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1200",
            publicId: "kerala_boat_1",
            format: "jpg",
          },
          {
            url: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=1200",
            publicId: "kerala_boat_2",
            format: "jpg",
          },
        ],
        amenities: [
          "WiFi",
          "Air conditioning",
          "TV",
          "Free parking",
        ],
        propertyType: "villa",
        roomType: "entire",
        maxGuests: 4,
        bedrooms: 2,
        beds: 2,
        bathrooms: 2,
        averageRating: 4.92,
        status: "active",
      },
      {
        title: "Marine Drive Sea-Facing Luxury Penthouse - Mumbai",
        description:
          "High-floor modern penthouse with breathtaking panoramic Arabian Sea and Queen's Necklace views. Located in South Mumbai, minutes away from Colaba, Gateway of India, and Nariman Point.",
        host: hostRohit,
        location: {
          address: "Marine Drive, Churchgate",
          city: "Mumbai",
          state: "Maharashtra",
          country: "India",
          coordinates: { lat: 18.9438, lng: 72.8234 },
        },
        price: {
          base: 240,
          currency: "USD",
          cleaningFee: 45,
          serviceFee: 20,
        },
        images: [
          {
            url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200",
            publicId: "mumbai_penthouse_1",
            format: "jpg",
          },
          {
            url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200",
            publicId: "mumbai_penthouse_2",
            format: "jpg",
          },
        ],
        amenities: [
          "WiFi",
          "Air conditioning",
          "Kitchen",
          "Free parking",
          "TV",
          "Washer",
          "Dryer",
        ],
        propertyType: "apartment",
        roomType: "entire",
        maxGuests: 4,
        bedrooms: 2,
        beds: 2,
        bathrooms: 2,
        averageRating: 4.85,
        status: "active",
      },
      {
        title: "Ganges Riverfront Serene Yoga & Nature Retreat - Rishikesh",
        description:
          "Peaceful eco-resort overlooking the holy Ganga river and foothills of the Himalayas. Features private yoga and meditation pavilion, organic garden cafe, and private river beach access for morning Aarti and walks.",
        host: hostPriya,
        location: {
          address: "Tapovan, Near Laxman Jhula",
          city: "Rishikesh",
          state: "Uttarakhand",
          country: "India",
          coordinates: { lat: 30.1264, lng: 78.3247 },
        },
        price: {
          base: 110,
          currency: "USD",
          cleaningFee: 20,
          serviceFee: 10,
        },
        images: [
          {
            url: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200",
            publicId: "rishikesh_retreat_1",
            format: "jpg",
          },
          {
            url: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1200",
            publicId: "rishikesh_retreat_2",
            format: "jpg",
          },
        ],
        amenities: [
          "WiFi",
          "Kitchen",
          "Free parking",
          "Air conditioning",
        ],
        propertyType: "cabin",
        roomType: "entire",
        maxGuests: 4,
        bedrooms: 2,
        beds: 2,
        bathrooms: 2,
        averageRating: 4.96,
        status: "active",
      },
      {
        title: "Modern Smart Tech Villa with Pool - Indiranagar, Bengaluru",
        description:
          "Ultra-contemporary architect-designed luxury villa in prime Indiranagar. Automated smart lighting, private plunge pool, home theatre, and rooftop barbecue terrace in India's silicon capital.",
        host: hostRohit,
        location: {
          address: "100 Feet Road, Indiranagar",
          city: "Bengaluru",
          state: "Karnataka",
          country: "India",
          coordinates: { lat: 12.9784, lng: 77.6408 },
        },
        price: {
          base: 175,
          currency: "USD",
          cleaningFee: 35,
          serviceFee: 15,
        },
        images: [
          {
            url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200",
            publicId: "bangalore_villa_1",
            format: "jpg",
          },
          {
            url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200",
            publicId: "bangalore_villa_2",
            format: "jpg",
          },
        ],
        amenities: [
          "WiFi",
          "Pool",
          "Air conditioning",
          "Kitchen",
          "Free parking",
          "TV",
          "Washer",
        ],
        propertyType: "villa",
        roomType: "entire",
        maxGuests: 6,
        bedrooms: 3,
        beds: 3,
        bathrooms: 3,
        averageRating: 4.89,
        status: "active",
      },

      // 🌍 INTERNATIONAL (DESH-VIDESH) PROPERTIES
      {
        title: "Tropical Jungle Private Pool Villa - Ubud, Bali",
        description:
          "Secluded Balinese sanctuary surrounded by lush rainforest, rice paddies, and rushing waterfalls in Ubud. Features open-air living pavilions, private infinity pool, outdoor stone bathtub, and sunrise yoga deck.",
        host: hostWayan,
        location: {
          address: "Jalan Raya Sanggingan, Ubud",
          city: "Bali",
          state: "Bali",
          country: "Indonesia",
          coordinates: { lat: -8.5069, lng: 115.2625 },
        },
        price: {
          base: 190,
          currency: "USD",
          cleaningFee: 30,
          serviceFee: 15,
        },
        images: [
          {
            url: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200",
            publicId: "bali_villa_1",
            format: "jpg",
          },
          {
            url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200",
            publicId: "bali_villa_2",
            format: "jpg",
          },
          {
            url: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1200",
            publicId: "bali_villa_3",
            format: "jpg",
          },
        ],
        amenities: [
          "WiFi",
          "Pool",
          "Air conditioning",
          "Kitchen",
          "Free parking",
          "Hot tub",
        ],
        propertyType: "villa",
        roomType: "entire",
        maxGuests: 4,
        bedrooms: 2,
        beds: 2,
        bathrooms: 2,
        averageRating: 4.97,
        status: "active",
      },
      {
        title: "Iconic Eiffel Tower Balcony Apartment - Paris, France",
        description:
          "Classic Parisian Haussmann apartment with uninterrupted direct views of the Eiffel Tower from your private wrought-iron balcony. High ceilings, herringbone parquet, marble fireplace, and footsteps from the Seine river.",
        host: hostClaire,
        location: {
          address: "Avenue de la Bourdonnais, 7th Arr.",
          city: "Paris",
          state: "Île-de-France",
          country: "France",
          coordinates: { lat: 48.8584, lng: 2.2945 },
        },
        price: {
          base: 320,
          currency: "USD",
          cleaningFee: 60,
          serviceFee: 30,
        },
        images: [
          {
            url: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200",
            publicId: "paris_apt_1",
            format: "jpg",
          },
          {
            url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200",
            publicId: "paris_apt_2",
            format: "jpg",
          },
        ],
        amenities: [
          "WiFi",
          "Kitchen",
          "Heating",
          "TV",
          "Washer",
        ],
        propertyType: "apartment",
        roomType: "entire",
        maxGuests: 3,
        bedrooms: 1,
        beds: 2,
        bathrooms: 1,
        averageRating: 4.94,
        status: "active",
      },
      {
        title: "Palm Jumeirah Ultra-Luxury Beachfront Villa - Dubai, UAE",
        description:
          "World-class private signature villa on Palm Jumeirah with private white sand beach, temperature-controlled infinity pool, jacuzzi, and breathtaking views of the Dubai Marina skyline and Atlantis.",
        host: hostRohit,
        location: {
          address: "Frond G, Palm Jumeirah",
          city: "Dubai",
          state: "Dubai",
          country: "United Arab Emirates",
          coordinates: { lat: 25.1124, lng: 55.139 },
        },
        price: {
          base: 650,
          currency: "USD",
          cleaningFee: 120,
          serviceFee: 50,
        },
        images: [
          {
            url: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=1200",
            publicId: "dubai_villa_1",
            format: "jpg",
          },
          {
            url: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200",
            publicId: "dubai_villa_2",
            format: "jpg",
          },
          {
            url: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200",
            publicId: "dubai_villa_3",
            format: "jpg",
          },
        ],
        amenities: [
          "WiFi",
          "Pool",
          "Air conditioning",
          "Kitchen",
          "Free parking",
          "Hot tub",
          "TV",
        ],
        propertyType: "villa",
        roomType: "entire",
        maxGuests: 10,
        bedrooms: 5,
        beds: 6,
        bathrooms: 5,
        averageRating: 4.99,
        status: "active",
      },
      {
        title: "White Cliff Cave Suite with Caldera Sunset - Oia, Santorini",
        description:
          "Traditional whitewashed luxury cave suite carved into the volcanic cliffs of Oia. Private cliffside heated infinity jacuzzi, endless Aegean Sea panorama, and world-famous Santorini sunset vistas.",
        host: hostClaire,
        location: {
          address: "Oia Cliffside Walkway",
          city: "Santorini",
          state: "Cyclades",
          country: "Greece",
          coordinates: { lat: 36.4618, lng: 25.3753 },
        },
        price: {
          base: 380,
          currency: "USD",
          cleaningFee: 50,
          serviceFee: 25,
        },
        images: [
          {
            url: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1200",
            publicId: "santorini_suite_1",
            format: "jpg",
          },
          {
            url: "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=1200",
            publicId: "santorini_suite_2",
            format: "jpg",
          },
        ],
        amenities: [
          "WiFi",
          "Air conditioning",
          "Hot tub",
          "Kitchen",
          "TV",
        ],
        propertyType: "villa",
        roomType: "entire",
        maxGuests: 2,
        bedrooms: 1,
        beds: 1,
        bathrooms: 1,
        averageRating: 4.98,
        status: "active",
      },
      {
        title: "Modern Minimalist Sky Penthouse - Shinjuku, Tokyo",
        description:
          "Futuristic Japanese luxury apartment soaring above Shinjuku. Floor-to-ceiling glass walls showcasing Tokyo Tower, Mount Fuji on clear days, high-speed fiber internet, and traditional Hinoki cypress soaking tub.",
        host: hostKenji,
        location: {
          address: "Nishi-Shinjuku 2-Chome",
          city: "Tokyo",
          state: "Tokyo",
          country: "Japan",
          coordinates: { lat: 35.6938, lng: 139.7034 },
        },
        price: {
          base: 230,
          currency: "USD",
          cleaningFee: 40,
          serviceFee: 20,
        },
        images: [
          {
            url: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=1200",
            publicId: "tokyo_penthouse_1",
            format: "jpg",
          },
          {
            url: "https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?w=1200",
            publicId: "tokyo_penthouse_2",
            format: "jpg",
          },
        ],
        amenities: [
          "WiFi",
          "Air conditioning",
          "Heating",
          "Kitchen",
          "TV",
          "Washer",
          "Dryer",
        ],
        propertyType: "apartment",
        roomType: "entire",
        maxGuests: 3,
        bedrooms: 1,
        beds: 2,
        bathrooms: 1,
        averageRating: 4.91,
        status: "active",
      },
      {
        title: "Alpine Luxury Ski Chalet with Matterhorn View - Zermatt",
        description:
          "Ultimate ski-in/ski-out luxury Swiss chalet overlooking the iconic Matterhorn. Features a private sauna, outdoor hot tub facing snowy peaks, grand stone fireplace, and heated ski storage room.",
        host: hostClaire,
        location: {
          address: "Winkelmatten, Zermatt",
          city: "Zermatt",
          state: "Valais",
          country: "Switzerland",
          coordinates: { lat: 45.9765, lng: 7.7491 },
        },
        price: {
          base: 450,
          currency: "USD",
          cleaningFee: 80,
          serviceFee: 40,
        },
        images: [
          {
            url: "https://images.unsplash.com/photo-1502784444187-359ac186c5bb?w=1200",
            publicId: "swiss_chalet_1",
            format: "jpg",
          },
          {
            url: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=1200",
            publicId: "swiss_chalet_2",
            format: "jpg",
          },
        ],
        amenities: [
          "WiFi",
          "Heating",
          "Hot tub",
          "Kitchen",
          "Free parking",
          "TV",
        ],
        propertyType: "cabin",
        roomType: "entire",
        maxGuests: 6,
        bedrooms: 3,
        beds: 4,
        bathrooms: 3,
        averageRating: 4.96,
        status: "active",
      },
      {
        title: "Overwater Turquoise Lagoon Villa - Maldives",
        description:
          "Direct overwater villa perched above crystal-clear turquoise ocean. Step directly from your private wooden deck into the coral reef lagoon. Includes glass-bottom floor panel, private infinity pool, and daily sunset views.",
        host: hostWayan,
        location: {
          address: "North Malé Atoll",
          city: "Malé",
          state: "Kaafu",
          country: "Maldives",
          coordinates: { lat: 4.1755, lng: 73.5093 },
        },
        price: {
          base: 580,
          currency: "USD",
          cleaningFee: 100,
          serviceFee: 45,
        },
        images: [
          {
            url: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=1200",
            publicId: "maldives_villa_1",
            format: "jpg",
          },
          {
            url: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1200",
            publicId: "maldives_villa_2",
            format: "jpg",
          },
        ],
        amenities: [
          "WiFi",
          "Pool",
          "Air conditioning",
          "Free parking",
          "TV",
        ],
        propertyType: "villa",
        roomType: "entire",
        maxGuests: 2,
        bedrooms: 1,
        beds: 1,
        bathrooms: 1,
        averageRating: 4.99,
        status: "active",
      },
    ];

    const listings = await Listing.create(sampleListings);
    console.log(`✅ Created ${listings.length} luxury Indian and International listings.`);

    console.log("🌱 Calculating carbon footprint for each property...");
    for (const listing of listings) {
      try {
        const carbonData = await calculateCarbonFootprint(listing);
        listing.carbonFootprint = carbonData;
        await listing.save();
      } catch (error) {
        console.warn(`Error calculating carbon for ${listing.title}:`, error.message);
      }
    }

    console.log("\n🎉 Seed process completed successfully!");
    console.log(`📊 Summary: ${users.length} Users/Hosts, ${listings.length} Indian & International Stays.`);
  } catch (error) {
    console.error("❌ Error seeding data:", error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

seedData();
