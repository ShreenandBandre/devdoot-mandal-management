// app/api/donations/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Donation from "@/lib/models/Donation";
import Receipt from "@/lib/models/Receipt";
import { generateReceiptNumber } from "@/lib/receiptNumber";
import { generateQR } from "@/lib/generateQR";
import { logActivity } from "@/lib/logActivity";
import { requireUser } from "@/lib/getSession";
 
export async function GET(req) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "500");
  const q = searchParams.get("q");
  const paymentMode = searchParams.get("paymentMode");
  const collector = searchParams.get("collector");
  const from = searchParams.get("from");
  const to = searchParams.get("to");
 
  const filter = { isDeleted: false };
  if (q) filter.$or = [
    { name: new RegExp(q, "i") },
    { address: new RegExp(q, "i") },
    { receiptNumber: new RegExp(q, "i") },
  ];
  if (paymentMode) filter.paymentMode = paymentMode;
  if (collector) filter.collectorName = new RegExp(collector, "i");
  if (from || to) filter.createdAt = {
    ...(from && { $gte: new Date(from) }),
    ...(to && { $lte: new Date(to) }),
  };
 
  const [items, total] = await Promise.all([
    Donation.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
    Donation.countDocuments(filter),
  ]);
 
  return NextResponse.json({ items, total, page, pages: Math.ceil(total / limit) });
}
 
export async function POST(req) {
  const user = await requireUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
 
  await connectDB();
  const body = await req.json();
  const festivalYear = parseInt(process.env.FESTIVAL_YEAR);
 
  if (!body.skipDuplicateCheck) {
    const existing = await Donation.findOne({
      name: new RegExp(`^${body.name}$`, "i"),
      address: new RegExp(`^${body.address}$`, "i"),
      festivalYear,
      isDeleted: false,
    });
    if (existing) {
      return NextResponse.json(
        { warning: "DUPLICATE", message: "A donation already exists for this household this year. Continue anyway?" },
        { status: 409 }
      );
    }
  }
 
  const receiptNumber = await generateReceiptNumber(festivalYear);
  const donation = await Donation.create({
    ...body,
    receiptNumber,
    festivalYear,
    collectedBy: user.id,
  });
 
  const qrCodeDataUrl = await generateQR(
    `${process.env.NEXT_PUBLIC_BASE_URL}/verify/${receiptNumber}`
  );
  await Receipt.create({ donation: donation._id, receiptNumber, qrCodeDataUrl });
 
  await logActivity({
    action: "DONATION_CREATED",
    performedBy: user.id,
    performedByName: user.name,
    targetType: "Donation",
    targetId: donation._id,
    meta: { amount: body.amount, receiptNumber },
  });
 
  return NextResponse.json({ donation }, { status: 201 });
}