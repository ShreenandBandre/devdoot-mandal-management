// app/api/donations/[id]/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Donation from "@/lib/models/Donation";
import { logActivity } from "@/lib/logActivity";
import { requireUser } from "@/lib/getSession";
 
export async function PUT(req, { params }) {
  const user = await requireUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
 
  await connectDB();
  const body = await req.json();
  const donation = await Donation.findByIdAndUpdate(params.id, body, { new: true });
  if (!donation) return NextResponse.json({ error: "Not found" }, { status: 404 });
 
  await logActivity({
    action: "DONATION_EDITED", performedBy: user.id, performedByName: user.name,
    targetType: "Donation", targetId: donation._id, meta: body,
  });
  return NextResponse.json({ donation });
}
 
export async function DELETE(req, { params }) {
  const user = await requireUser(req);
  if (!user || user.role !== "admin")
    return NextResponse.json({ error: "Admin only" }, { status: 403 });
 
  await connectDB();
  const donation = await Donation.findByIdAndUpdate(params.id, { isDeleted: true }, { new: true });
  await logActivity({
    action: "DONATION_DELETED", performedBy: user.id, performedByName: user.name,
    targetType: "Donation", targetId: donation._id,
  });
  return NextResponse.json({ ok: true });
}