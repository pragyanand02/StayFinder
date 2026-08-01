const { MongoClient } = require("mongodb");

const uri = "mongodb+srv://patelg1718_db_user:StayFinder%402026%23123@cluster0.ovtvos0.mongodb.net/?appName=Cluster0";

async function test() {
  try {
    console.log("Connecting...");
    const client = new MongoClient(uri);
    await client.connect();
    console.log("✅ Connected successfully!");
    await client.close();
  } catch (err) {
    console.error("❌ Error:");
    console.error(err);
  }
}

test();