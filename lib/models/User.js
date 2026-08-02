import mongoose from "mongoose";
 
const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "volunteer"], default: "volunteer" },
    phone: String,
    isActive: { type: Boolean, default: true },
    lastLogin: Date,
  },
  { timestamps: true }
);
 
export default mongoose.models.User || mongoose.model("User", UserSchema);