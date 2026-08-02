// app/api/volunteers/[id]/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/User";
import { requireUser } from "@/lib/getSession";
 
export async function PUT(req, { params }) {
  const user = await requireUser(req);
  if (!user || user.role !== "admin") return NextResponse.json({ error: "Admin only" }, { status: 403 });
 
  await connectDB();
  const body = await req.json();
  const volunteer = await User.findByIdAndUpdate(params.id, body, { new: true }).select("-password");
  return NextResponse.json({ volunteer });
}