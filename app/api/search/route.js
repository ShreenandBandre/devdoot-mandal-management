// app/api/search/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Donation from "@/lib/models/Donation";
import Expense from "@/lib/models/Expense";
import User from "@/lib/models/User";
 
export async function GET(req) {
  await connectDB();
  const q = new URL(req.url).searchParams.get("q") || "";
  if (q.length < 2) return NextResponse.json({ donations: [], expenses: [], volunteers: [] });
 
  const rx = new RegExp(q, "i");
  const [donations, expenses, volunteers] = await Promise.all([
    Donation.find({ isDeleted: false, $or: [{ name: rx }, { receiptNumber: rx }, { address: rx }] }).limit(8).lean(),
    Expense.find({ isDeleted: false, $or: [{ title: rx }, { vendor: rx }] }).limit(8).lean(),
    User.find({ role: "volunteer", name: rx }).select("-password").limit(8).lean(),
  ]);
 
  return NextResponse.json({ donations, expenses, volunteers });
}