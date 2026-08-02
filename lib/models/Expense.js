import mongoose from "mongoose";
 
const CATEGORIES = ["Decoration", "Sound System", "Lighting", "Flowers", "Prasad",
  "Food", "Printing", "Transportation", "Electricity", "Miscellaneous"];
 
const ExpenseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: { type: String, enum: CATEGORIES, required: true },
    amount: { type: Number, required: true, min: 1 },
    paymentMode: { type: String, enum: ["Cash", "UPI"], required: true },
    vendor: String,
    billUrl: String,
    description: String,
    date: { type: Date, required: true, default: Date.now },
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    festivalYear: { type: Number, required: true },
    status: { type: String, enum: ["Pending", "Approved"], default: "Approved" },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);
 
export const EXPENSE_CATEGORIES = CATEGORIES;
export default mongoose.models.Expense || mongoose.model("Expense", ExpenseSchema);