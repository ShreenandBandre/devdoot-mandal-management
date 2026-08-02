import mongoose from "mongoose";
 
const DonationSchema = new mongoose.Schema(
  {
    receiptNumber: { type: String, required: true, unique: true },
    name: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    phone: String,
    amount: { type: Number, required: true, min: 1 },
    paymentMode: { type: String, enum: ["Cash", "UPI"], required: true },
    purpose: { type: String, default: "Ganpati Festival Donation" },
    remarks: String,
    collectorName: { type: String, required: true },
    collectedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    festivalYear: { type: Number, required: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);
 
DonationSchema.index({ name: "text", address: "text", receiptNumber: "text" });
DonationSchema.index({ name: 1, address: 1, festivalYear: 1 });
 
export default mongoose.models.Donation || mongoose.model("Donation", DonationSchema);