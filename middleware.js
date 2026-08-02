import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

// Routes that require admin privileges
const ADMIN_ONLY = [
  "/dashboard/volunteers",
  "/dashboard/settings",
  "/dashboard/treasurer",
];

// Routes that need protection now that they are without the /dashboard prefix
const PROTECTED_ROUTES = [
  "/donations/new",
  "/expenses/new",
  "/select-action",
  "/dashboard",
];

export async function middleware(req) {
  const pathname = req.nextUrl.pathname;
  const token = req.cookies.get("token")?.value;

  // 1. Check if token exists
  if (!token) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2. Verify token payload
  const payload = await verifyToken(token);
  if (!payload) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 3. Enforce Admin-only restrictions
  if (
    ADMIN_ONLY.some((p) => pathname.startsWith(p)) &&
    payload.role !== "admin"
  ) {
    return NextResponse.redirect(new URL("/select-action", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/api/protected/:path*",
    "/donations/new",
    "/expenses/new",
    "/select-action"
  ],
};