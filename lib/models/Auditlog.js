import mongoose from "mongoose";
 
const AuditLogSchema = new mongoose.Schema(
  {
    action: { type: String, required: true },
    performedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    performedByName: String,
    targetType: String,
    targetId: mongoose.Schema.Types.ObjectId,
    meta: mongoose.Schema.Types.Mixed,
  },
  { timestamps: true }
);
 
export default mongoose.models.AuditLog || mongoose.model("AuditLog", AuditLogSchema);