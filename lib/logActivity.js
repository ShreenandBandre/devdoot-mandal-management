// lib/logActivity.js
import { connectDB } from "@/lib/db";
import AuditLog from "@/lib/models/AuditLog";
 
export async function logActivity({ action, performedBy, performedByName, targetType, targetId, meta }) {
  await connectDB();
  await AuditLog.create({ action, performedBy, performedByName, targetType, targetId, meta });
}