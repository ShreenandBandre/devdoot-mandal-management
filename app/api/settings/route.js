// app/api/settings/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Settings from "@/lib/models/Settings";
import { requireUser } from "@/lib/getSession";
 
export async function GET() {
  await connectDB();
  const settings = await Settings.findOne().lean();
  return NextResponse.json({ settings });
}
 
export async function PUT(req) {
  const user = await requireUser(req);
  if (!user || user.role !== "admin") return NextResponse.json({ error: "Admin only" }, { status: 403 });
 
  await connectDB();
  const body = await req.json();
  const settings = await Settings.findOneAndUpdate({}, body, { upsert: true, new: true });
  return NextResponse.json({ settings });
}