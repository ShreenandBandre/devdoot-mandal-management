// app/api/donations/history/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Donation from "@/lib/models/Donation";
 
export async function GET(req) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const name = searchParams.get("name");
  const address = searchParams.get("address");
  if (!name || !address) return NextResponse.json({ error: "name & address required" }, { status: 400 });
 
  const records = await Donation.find({
    name: new RegExp(`^${name}$`, "i"),
    address: new RegExp(`^${address}$`, "i"),
    isDeleted: false,
  }).select("festivalYear amount").lean();
 
  const history = {};
  records.forEach((r) => { history[r.festivalYear] = (history[r.festivalYear] || 0) + r.amount; });
  return NextResponse.json({ history });
}