import mongoose from "mongoose";
 
const SettingsSchema = new mongoose.Schema({
  mandalName: { type: String, default: "Devdoot Mandal" },
  logoUrl: String,
  festivalYear: { type: Number, required: true },
  receiptPrefix: { type: String, default: "DM" },
  upiId: String,
  commonQrUrl: String,
  address: String,
  contactDetails: String,
  footerText: String,
}, { timestamps: true });
 
export default mongoose.models.Settings || mongoose.model("Settings", SettingsSchema);