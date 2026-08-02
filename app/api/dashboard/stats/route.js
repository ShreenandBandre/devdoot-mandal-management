// app/api/dashboard/stats/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Donation from "@/lib/models/Donation";
import Expense from "@/lib/models/Expense";
import User from "@/lib/models/User";
 
function startOfDay(d = new Date()) { const x = new Date(d); x.setHours(0,0,0,0); return x; }
function startOfWeek(d = new Date()) { const x = startOfDay(d); x.setDate(x.getDate() - x.getDay()); return x; }
function startOfMonth(d = new Date()) { return new Date(d.getFullYear(), d.getMonth(), 1); }
 
export async function GET() {
  await connectDB();
  const today = startOfDay(), week = startOfWeek(), month = startOfMonth();
  const donationFilter = { isDeleted: false };
  const expenseFilter = { isDeleted: false };
 
  const sum = (arr) => arr[0]?.total || 0;
 
  const [
    todayCollection, weekCollection, monthCollection, totalCollection,
    cashCollection, upiCollection, totalReceipts,
    todayExpenses, monthExpenses, totalExpenses,
    volunteerCount, avgDonation, topDonation,
  ] = await Promise.all([
    Donation.aggregate([{ $match: { ...donationFilter, createdAt: { $gte: today } } }, { $group: { _id: null, total: { $sum: "$amount" } } }]).then(sum),
    Donation.aggregate([{ $match: { ...donationFilter, createdAt: { $gte: week } } }, { $group: { _id: null, total: { $sum: "$amount" } } }]).then(sum),
    Donation.aggregate([{ $match: { ...donationFilter, createdAt: { $gte: month } } }, { $group: { _id: null, total: { $sum: "$amount" } } }]).then(sum),
    Donation.aggregate([{ $match: donationFilter }, { $group: { _id: null, total: { $sum: "$amount" } } }]).then(sum),
    Donation.aggregate([{ $match: { ...donationFilter, paymentMode: "Cash" } }, { $group: { _id: null, total: { $sum: "$amount" } } }]).then(sum),
    Donation.aggregate([{ $match: { ...donationFilter, paymentMode: "UPI" } }, { $group: { _id: null, total: { $sum: "$amount" } } }]).then(sum),
    Donation.countDocuments(donationFilter),
    Expense.aggregate([{ $match: { ...expenseFilter, date: { $gte: today } } }, { $group: { _id: null, total: { $sum: "$amount" } } }]).then(sum),
    Expense.aggregate([{ $match: { ...expenseFilter, date: { $gte: month } } }, { $group: { _id: null, total: { $sum: "$amount" } } }]).then(sum),
    Expense.aggregate([{ $match: expenseFilter }, { $group: { _id: null, total: { $sum: "$amount" } } }]).then(sum),
    User.countDocuments({ role: "volunteer", isActive: true }),
    Donation.aggregate([{ $match: donationFilter }, { $group: { _id: null, avg: { $avg: "$amount" } } }]).then((a) => a[0]?.avg || 0),
    Donation.findOne(donationFilter).sort({ amount: -1 }).select("name amount").lean(),
  ]);
 
  return NextResponse.json({
    income: { todayCollection, weekCollection, monthCollection, totalCollection, cashCollection, upiCollection, totalReceipts },
    expense: { todayExpenses, monthExpenses, totalExpenses },
    financial: { netBalance: totalCollection - totalExpenses },
    other: { volunteerCount, avgDonation: Math.round(avgDonation), topDonation },
  });
}