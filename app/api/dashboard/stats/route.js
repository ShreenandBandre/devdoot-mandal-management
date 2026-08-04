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
    // Authentication security check to block unauthorized access to dashboard stats
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Invalid session token" }, { status: 401 });
    }

    console.log("\n========== DASHBOARD API ==========");

    await connectDB();
    console.log("✅ MongoDB Connected");

    const count = await Donation.countDocuments();
    console.log("Donation Count:", count);

    const docs = await Donation.find().limit(3).lean();
    console.log("Sample Donations:", docs);

    const aggregateTest = await Donation.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);

    console.log("Aggregate Test:", aggregateTest);

    const today = startOfDay();
    const week = startOfWeek();
    const month = startOfMonth();

    const donationFilter = { isDeleted: false };
    const expenseFilter = { isDeleted: false };

    const sum = (arr) => arr[0]?.total || 0;

    const [
      todayCollection,
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
      Donation.aggregate([
        {
          $match: {
            ...donationFilter,
            createdAt: { $gte: today },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$amount" },
          },
        },
      ]).then(sum),

      Donation.aggregate([
        {
          $match: {
            ...donationFilter,
            createdAt: { $gte: week },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$amount" },
          },
        },
      ]).then(sum),

      Donation.aggregate([
        {
          $match: {
            ...donationFilter,
            createdAt: { $gte: month },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$amount" },
          },
        },
      ]).then(sum),

      Donation.aggregate([
        {
          $match: donationFilter,
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$amount" },
          },
        },
      ]).then(sum),

      Donation.aggregate([
        {
          $match: {
            ...donationFilter,
            paymentMode: "Cash",
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$amount" },
          },
        },
      ]).then(sum),

      Donation.aggregate([
        {
          $match: {
            ...donationFilter,
            paymentMode: "UPI",
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$amount" },
          },
        },
      ]).then(sum),

      Donation.countDocuments(donationFilter),

      Expense.aggregate([
        {
          $match: {
            ...expenseFilter,
            date: { $gte: today },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$amount" },
          },
        },
      ]).then(sum),

      Expense.aggregate([
        {
          $match: {
            ...expenseFilter,
            date: { $gte: month },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$amount" },
          },
        },
      ]).then(sum),

      Expense.aggregate([
        {
          $match: expenseFilter,
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$amount" },
          },
        },
      ]).then(sum),

      User.countDocuments({
        role: "volunteer",
        isActive: true,
      }),

      Donation.aggregate([
        {
          $match: donationFilter,
        },
        {
          $group: {
            _id: null,
            avg: { $avg: "$amount" },
          },
        },
      ]).then((a) => a[0]?.avg || 0),

      Donation.findOne(donationFilter)
        .sort({ amount: -1 })
        .select("name amount")
        .lean(),
    ]);

    console.log("========== FINAL STATS ==========");
    console.log({
      todayCollection,
      weekCollection,
      monthCollection,
      totalCollection,
      cashCollection,
      upiCollection,
      totalReceipts,
      volunteerCount,
      avgDonation,
      topDonation,
    });

    return NextResponse.json({
      income: {
        todayCollection,
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

    return NextResponse.json(
      {
        error: err.message,
      },
      {
        status: 500,
      }
    );
  }
}