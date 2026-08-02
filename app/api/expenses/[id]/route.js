// app/api/expenses/[id]/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Expense from "@/lib/models/Expense";
import { logActivity } from "@/lib/logActivity";
import { requireUser } from "@/lib/getSession";
 
export async function PUT(req, { params }) {
  const user = await requireUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
 
  await connectDB();
  const body = await req.json();
  const expense = await Expense.findByIdAndUpdate(params.id, body, { new: true });
 
  await logActivity({
    action: "EXPENSE_EDITED", performedBy: user.id, performedByName: user.name,
    targetType: "Expense", targetId: expense._id,
  });
  return NextResponse.json({ expense });
}
 
export async function DELETE(req, { params }) {
  const user = await requireUser(req);
  if (!user || user.role !== "admin")
    return NextResponse.json({ error: "Admin only" }, { status: 403 });
 
  await connectDB();
  await Expense.findByIdAndUpdate(params.id, { isDeleted: true });
  await logActivity({ action: "EXPENSE_DELETED", performedBy: user.id, performedByName: user.name, targetId: params.id });
  return NextResponse.json({ ok: true });
}