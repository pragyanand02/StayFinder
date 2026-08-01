const mongoose = require("mongoose");
const dns = require("dns");

// Force Node.js to use Google DNS for SRV lookups
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const connectDB = async () => {
  try {
    const options = {
      serverSelectionTimeoutMS: 5000,
      family: 4,
    };

    const mongoURI =
      process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/stayfinder";

    if (process.env.NODE_ENV === "development") {
  console.log("Attempting to connect to MongoDB...");
}

    const conn = await mongoose.connect(mongoURI, options);

    console.log("✅ MongoDB Connected");

if (process.env.NODE_ENV === "development") {
  console.log(`Host: ${conn.connection.host}`);
}

    mongoose.connection.on("error", (err) => {
      console.error("MongoDB connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("MongoDB disconnected");
    });

    process.on("SIGINT", async () => {
      try {
        await mongoose.connection.close();
        console.log("MongoDB connection closed through app termination");
        process.exit(0);
      } catch (err) {
        console.error("Error during MongoDB disconnection:", err);
        process.exit(1);
      }
    });
  } catch (error) {
    console.error("❌ Error connecting to MongoDB:", error.message);

if (process.env.NODE_ENV === "development") {
  console.error(error);
}

    if (error.name === "MongoServerSelectionError") {
      console.error("\nPossible solutions:");
      console.error("1. Make sure MongoDB is running on your system");
      console.error(
        "2. Check if MongoDB is running on the correct port (default: 27017)"
      );
      console.error("3. Verify your MongoDB connection string in .env file");
      console.error("4. Check if your firewall is blocking the connection");
    }

    process.exit(1);
  }
};

module.exports = connectDB;