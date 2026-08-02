// app/api/receipts/[id]/pdf/route.js
import { connectDB } from "@/lib/db";
import Donation from "@/lib/models/Donation";
import Receipt from "@/lib/models/Receipt";
import Settings from "@/lib/models/Settings";
import { renderReceiptPDF } from "@/lib/generateReceiptPDF";
 
export async function GET(req, { params }) {
  await connectDB();
  const donation = await Donation.findById(params.id).lean();
  if (!donation) return new Response("Not found", { status: 404 });
 
  const receipt = await Receipt.findOneAndUpdate(
    { donation: donation._id },
    { $inc: { downloadCount: 1 } },
    { new: true }
  );
  const settings = await Settings.findOne().lean();
 
  const pdfBuffer = await renderReceiptPDF({
    donation,
    settings: settings || { mandalName: "Devdoot Mandal" },
    qrCodeDataUrl: receipt.qrCodeDataUrl,
  });
 
  return new Response(pdfBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${donation.receiptNumber}.pdf"`,
    },
  });
}