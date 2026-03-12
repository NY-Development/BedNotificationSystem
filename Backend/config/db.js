import mongoose from "mongoose";

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;

  try {
    mongoose.connection.once("connected", () => {
      console.log("Database connected");
    });

    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "BedNotify",
      serverSelectionTimeoutMS: 30000, // KEEP this
    });

    isConnected = true;
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    throw error; // IMPORTANT for Vercel
  }
};

export default connectDB;
