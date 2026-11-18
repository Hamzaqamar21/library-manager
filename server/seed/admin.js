import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

import connectDB from "../config/db.js";
import User from "../models/User.js";

dotenv.config();

const seedAdmin = async () => {
  try {
    await connectDB();

    const adminEmail = "hamza@gmail.com";

    const existingAdmin = await User.findOne({
      email: adminEmail
    });

    const hashedPassword = await bcrypt.hash("98765432", 10);

    const admin = existingAdmin
      ? await User.findByIdAndUpdate(
          existingAdmin._id,
          { name: "Admin", password: hashedPassword, role: "admin" },
          { returnDocument: "after" }
        )
      : await User.create({
          name: "Admin",
          email: adminEmail,
          password: hashedPassword,
          role: "admin"
        });

    console.log("Admin seeded successfully!");
    console.log(admin.email);

    process.exit(0);

  } catch (error) {
    console.error("Error seeding admin:", error);
    process.exit(1);
  }
};

seedAdmin();
