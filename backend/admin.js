import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB Connected for admin creation...");
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const createAdmin = async () => {
  try {
    await connectDB();

    // Check if admin already exists
    const existingAdmin = await User.findOne({
      email: "admin@gmail.com",
      isDeleted: false,
    });

    if (existingAdmin) {
      console.log("❌ Admin user already exists with this email");
      process.exit(1);
    }

    // ==================== CREATE ADMIN USER ====================
    console.log("Creating admin user...");
    const adminUser = await User.create({
      name: "Barento",
      email: "admin@gmail.com",
      password: "994956",
      role: "admin",
      phone: "1234567890",
      isActive: true,
    });

    console.log("✅ Admin created successfully!");
    console.log(`Admin ID: ${adminUser._id}`);
    console.log(`Admin Name: ${adminUser.name}`);
    console.log(`Admin Email: ${adminUser.email}`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating admin:", error.message);
    process.exit(1);
  }
};

// Run the admin creation
createAdmin();
