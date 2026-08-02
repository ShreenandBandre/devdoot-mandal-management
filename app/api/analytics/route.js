// app/api/analytics/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Donation from "@/lib/models/Donation";
import Expense from "@/lib/models/Expense";
 
export async function GET() {
  await connectDB();
 
  const dailyCollection = await Donation.aggregate([
    { $match: { isDeleted: false } },
    { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, total: { $sum: "$amount" } } },
    { $sort: { _id: 1 } },
  ]);
 
  const cashVsUpi = await Donation.aggregate([
    { $match: { isDeleted: false } },
    { $group: { _id: "$paymentMode", total: { $sum: "$amount" } } },
  ]);
 
  const expenseByCategory = await Expense.aggregate([
    { $match: { isDeleted: false } },
    { $group: { _id: "$category", total: { $sum: "$amount" } } },
    { $sort: { total: -1 } },
  ]);
 
  const topCollectors = await Donation.aggregate([
    { $match: { isDeleted: false } },
    { $group: { _id: "$collectorName", total: { $sum: "$amount" }, count: { $sum: 1 } } },
    { $sort: { total: -1 } },
    { $limit: 10 },
  ]);
 
  return NextResponse.json({ dailyCollection, cashVsUpi, expenseByCategory, topCollectors });
}