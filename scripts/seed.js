import dotenv from "dotenv";
dotenv.config();

import { connectDB } from "../lib/db.js";
import User from "../lib/models/User.js";
import Settings from "../lib/models/Settings.js";
import bcrypt from "bcryptjs";

async function seed() {
  try {
    await connectDB();
    console.log("Connected to MongoDB");

    const existingAdmin = await User.findOne({
      email: "admin@devdoot.com",
    });

    if (!existingAdmin) {
      const password = await bcrypt.hash("admin123", 10);

      await User.create({
        name: "Admin User",
        email: "admin@devdoot.com",
        password,
        role: "admin",
        isActive: true,
      });

      console.log("Admin created");
    }

    const existingSettings = await Settings.findOne();

    if (!existingSettings) {
      await Settings.create({
        mandalName: "Devdoot Mandal",
        festivalYear: 2026,
        receiptPrefix: "DM",
        footerText: "Thank you for your generous contribution.",
      });

      console.log("Settings created");
    }

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();