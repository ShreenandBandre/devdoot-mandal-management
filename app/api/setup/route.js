import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/User";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    await connectDB();

    let createdCount = 0;
    const responseDetails = {};

    // 1. Check or Create Admin
    const existingAdmin = await User.findOne({ email: "admin@devdoot.com" });
    if (!existingAdmin) {
      const hashedAdminPassword = await bcrypt.hash("admin123", 10);
      await User.create({
        name: "Admin",
        email: "admin@devdoot.com",
        password: hashedAdminPassword,
        role: "admin",
        isActive: true,
      });
      responseDetails.admin = { email: "admin@devdoot.com", password: "admin123" };
      createdCount++;
    }

    // 2. Check or Create Default Volunteer
    const existingVolunteer = await User.findOne({ email: "volunteer@devdoot.com" });
    if (!existingVolunteer) {
      const hashedVolPassword = await bcrypt.hash("volunteer123", 10);
      await User.create({
        name: "Field Volunteer",
        email: "volunteer@devdoot.com",
        phone: "9876543210",
        password: hashedVolPassword,
        role: "volunteer",
        isActive: true,
      });
      responseDetails.volunteer = { email: "volunteer@devdoot.com", password: "volunteer123" };
      createdCount++;
    }

    if (createdCount === 0) {
      return NextResponse.json({
        success: false,
        message: "Admin and Volunteer already exist",
      });
    }

    return NextResponse.json({
      success: true,
      message: "Users created successfully",
      credentials: responseDetails,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}