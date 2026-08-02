// app/api/volunteers/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/User";
import Donation from "@/lib/models/Donation";
import { hashPassword } from "@/lib/auth";
import { requireUser } from "@/lib/getSession";

export async function GET(req) {
  try {
    const user = await requireUser(req);
    if (!user || user.role !== "admin") return NextResponse.json({ error: "Admin only" }, { status: 403 });

    await connectDB();
    const volunteers = await User.find({ role: { $regex: /^volunteer$/i } }).select("-password").lean();

    const performance = await Donation.aggregate([
      { $match: { isDeleted: false } },
      { $group: { _id: "$collectedBy", total: { $sum: "$amount" }, count: { $sum: 1 } } },
    ]);
    const perfMap = Object.fromEntries(performance.map((p) => [String(p._id), p]));

    const enriched = volunteers.map((v) => ({
      ...v,
      totalCollected: perfMap[String(v._id)]?.total || 0,
      receiptCount: perfMap[String(v._id)]?.count || 0,
    }));

    return NextResponse.json({ volunteers: enriched });
  } catch (error) {
    console.error("GET volunteers error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const user = await requireUser(req);
    if (!user || user.role !== "admin") return NextResponse.json({ error: "Admin only" }, { status: 403 });

    await connectDB();
    const body = await req.json();

    if (!body.name || !body.phone || !body.email || !body.password) {
      return NextResponse.json({ error: "Name, phone, email, and password are required fields." }, { status: 400 });
    }

    const existing = await User.findOne({ email: body.email });
    if (existing) {
      return NextResponse.json({ error: "A user with this email already exists." }, { status: 409 });
    }

    const password = await hashPassword(body.password);
    const volunteer = await User.create({
      ...body,
      password,
      role: body.role ? body.role.toLowerCase() : "volunteer",
    });

    const volunteerObj = volunteer.toObject();
    delete volunteerObj.password;

    return NextResponse.json({ volunteer: volunteerObj }, { status: 201 });
  } catch (error) {
    console.error("POST volunteer error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}