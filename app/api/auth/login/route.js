import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/User";
import { comparePassword, signToken } from "@/lib/auth";
import { logActivity } from "@/lib/logActivity";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password required" },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findOne({
      email: email.toLowerCase(),
      isActive: true,
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const valid = await comparePassword(password, user.password);

    if (!valid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // jose signToken() is async
    const token = await signToken({
      id: user._id.toString(),
      role: user.role,
      name: user.name,
    });

    user.lastLogin = new Date();
    await user.save();

    await logActivity({
      action: "LOGIN",
      performedBy: user._id,
      performedByName: user.name,
    });

    // Determine redirect destination based on role (volunteer goes to new donation)
    const redirectTo = user.role === "volunteer" ? "/select-action" : "/dashboard";

    const res = NextResponse.json({
      success: true,
      redirectTo,
      user: {
        id: user._id.toString(),
        name: user.name,
        role: user.role,
        email: user.email,
      },
    });

    res.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return res;
  } catch (err) {
    console.error("Login Error:", err);

    return NextResponse.json(
      {
        success: false,
        error: "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
}