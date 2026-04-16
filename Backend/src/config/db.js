import mongoose from "mongoose";

const connectDB = async () => {
  if (!process.env.DB_URI) {
    console.error("DB_URI is not defined in environment variables");
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.DB_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1);
  }
}

export default connectDB;