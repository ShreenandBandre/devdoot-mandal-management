import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Donation from "@/lib/models/Donation";
import Expense from "@/lib/models/Expense";
import User from "@/lib/models/User";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

function startOfDay(d = new Date()) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function startOfWeek(d = new Date()) {
  const x = startOfDay(d);
  x.setDate(x.getDate() - x.getDay());
  return x;
}

function startOfMonth(d = new Date()) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

export async function GET(req) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Invalid session token" }, { status: 401 });
    }

    await connectDB();

    const today = startOfDay();
    const week = startOfWeek();
    const month = startOfMonth();

    const donationFilter = { isDeleted: false };
    const expenseFilter = { isDeleted: false };

    const sum = (arr) => arr[0]?.total || 0;

    const [
      todayCollection,
      todayCashCollection,
      todayUpiCollection,
      weekCollection,
      monthCollection,
      totalCollection,
      cashCollection,
      upiCollection,
      totalReceipts,
      todayExpenses,
      monthExpenses,
      totalExpenses,
      volunteerCount,
      avgDonation,
      topDonation,
    ] = await Promise.all([
      // Today Total
      Donation.aggregate([
        { $match: { ...donationFilter, createdAt: { $gte: today } } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]).then(sum),

      // Today Cash
      Donation.aggregate([
        { $match: { ...donationFilter, paymentMode: "Cash", createdAt: { $gte: today } } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]).then(sum),

      // Today UPI
      Donation.aggregate([
        { $match: { ...donationFilter, paymentMode: "UPI", createdAt: { $gte: today } } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]).then(sum),

      // Weekly Collection
      Donation.aggregate([
        { $match: { ...donationFilter, createdAt: { $gte: week } } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]).then(sum),

      // Monthly Collection
      Donation.aggregate([
        { $match: { ...donationFilter, createdAt: { $gte: month } } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]).then(sum),

      // Total Collection
      Donation.aggregate([
        { $match: donationFilter },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]).then(sum),

      // Overall Cash Collection
      Donation.aggregate([
        { $match: { ...donationFilter, paymentMode: "Cash" } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]).then(sum),

      // Overall UPI Collection
      Donation.aggregate([
        { $match: { ...donationFilter, paymentMode: "UPI" } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]).then(sum),

      Donation.countDocuments(donationFilter),

      // Today Expenses
      Expense.aggregate([
        { $match: { ...expenseFilter, date: { $gte: today } } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]).then(sum),

      // Monthly Expenses
      Expense.aggregate([
        { $match: { ...expenseFilter, date: { $gte: month } } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]).then(sum),

      // Total Expenses
      Expense.aggregate([
        { $match: expenseFilter },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]).then(sum),

      User.countDocuments({ role: "volunteer", isActive: true }),

      Donation.aggregate([
        { $match: donationFilter },
        { $group: { _id: null, avg: { $avg: "$amount" } } },
      ]).then((a) => a[0]?.avg || 0),

      Donation.findOne(donationFilter)
        .sort({ amount: -1 })
        .select("name amount")
        .lean(),
    ]);

    return NextResponse.json({
      income: {
        todayCollection,
        todayCashCollection,
        todayUpiCollection,
        weekCollection,
        monthCollection,
        totalCollection,
        cashCollection,
        upiCollection,
        totalReceipts,
      },
      expense: {
        todayExpenses,
        monthExpenses,
        totalExpenses,
      },
      financial: {
        netBalance: totalCollection - totalExpenses,
      },
      other: {
        volunteerCount,
        avgDonation: Math.round(avgDonation),
        topDonation,
      },
    });
  } catch (err) {
    console.error("❌ Dashboard Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}