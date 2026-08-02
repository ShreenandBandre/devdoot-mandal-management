import mongoose from "mongoose";

const VolunteerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String },
  role: { type: String, default: "Volunteer" },
}, { timestamps: true });

export default mongoose.models.Volunteer || mongoose.model("Volunteer", VolunteerSchema);