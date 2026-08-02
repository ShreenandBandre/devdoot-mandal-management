import mongoose from "mongoose";
 
const ReceiptSchema = new mongoose.Schema(
  {
    donation: { type: mongoose.Schema.Types.ObjectId, ref: "Donation", required: true, unique: true },
    receiptNumber: { type: String, required: true, unique: true },
    qrCodeDataUrl: String,
    pdfPath: String,
    downloadCount: { type: Number, default: 0 },
    printCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);
 
export default mongoose.models.Receipt || mongoose.model("Receipt", ReceiptSchema);