import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Expense from "@/lib/models/Expense";
import { logActivity } from "@/lib/logActivity";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "100"); 
    const q = searchParams.get("q");
    const category = searchParams.get("category");
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    const filter = { isDeleted: false };
    if (q) filter.$or = [{ title: new RegExp(q, "i") }, { vendor: new RegExp(q, "i") }];
    if (category && category !== "All") filter.category = category;
    if (from || to) filter.date = {
      ...(from && { $gte: new Date(from) }),
      ...(to && { $lte: new Date(to) }),
    };

    const [items, total] = await Promise.all([
      Expense.find(filter).sort({ date: -1, createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
      Expense.countDocuments(filter),
    ]);

    return NextResponse.json({ 
      expenses: items, 
      items, 
      total, 
      page, 
      pages: Math.ceil(total / limit) 
    });
  } catch (error) {
    console.error("GET Expenses Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    // Securely verify user session using cookies
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const user = await verifyToken(token);
    if (!user) {
      return NextResponse.json({ error: "Invalid session token" }, { status: 401 });
    }

    await connectDB();
    const body = await req.json();
    const expense = await Expense.create({
      ...body,
      addedBy: user.id || user._id,
      festivalYear: parseInt(process.env.FESTIVAL_YEAR || "2026"),
    });

    await logActivity({
      action: "EXPENSE_ADDED", 
      performedBy: user.id || user._id, 
      performedByName: user.name || "Admin",
      targetType: "Expense", 
      targetId: expense._id, 
      meta: { amount: body.amount, category: body.category },
    });

    return NextResponse.json({ expense }, { status: 201 });
  } catch (error) {
    console.error("POST Expense Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}