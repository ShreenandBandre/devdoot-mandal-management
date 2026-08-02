// lib/receiptNumber.js
import Donation from "@/lib/models/Donation";
 
export async function generateReceiptNumber(festivalYear) {
  const prefix = process.env.RECEIPT_PREFIX || "DM";
  const count = await Donation.countDocuments({ festivalYear });
  const seq = String(count + 1).padStart(6, "0");
  return `${prefix}-${festivalYear}-${seq}`;
}