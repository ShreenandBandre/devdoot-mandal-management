// app/api/receipts/search/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Donation from "@/lib/models/Donation";
 
export async function GET(req) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";
  const dateFrom = searchParams.get("dateFrom");
  const dateTo = searchParams.get("dateTo");
  const amountMin = searchParams.get("amountMin");
  const amountMax = searchParams.get("amountMax");
  const collector = searchParams.get("collector");
  const paymentMode = searchParams.get("paymentMode");
 
  const filter = { isDeleted: false };
  if (q) filter.$or = [
    { receiptNumber: new RegExp(q, "i") },
    { name: new RegExp(q, "i") },
    { address: new RegExp(q, "i") },
  ];
  if (dateFrom || dateTo) filter.createdAt = {
    ...(dateFrom && { $gte: new Date(dateFrom) }),
    ...(dateTo && { $lte: new Date(dateTo) }),
  };
  if (amountMin || amountMax) filter.amount = {
    ...(amountMin && { $gte: Number(amountMin) }),
    ...(amountMax && { $lte: Number(amountMax) }),
  };
  if (collector) filter.collectorName = new RegExp(collector, "i");
  if (paymentMode) filter.paymentMode = paymentMode;
 
  const results = await Donation.find(filter).sort({ createdAt: -1 }).limit(100).lean();
  return NextResponse.json(results);
}