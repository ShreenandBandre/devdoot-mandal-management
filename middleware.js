import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

const ADMIN_ONLY = [
  "/dashboard/volunteers",
  "/dashboard/settings",
  "/dashboard/treasurer",
];

export async function middleware(req) {
  const pathname = req.nextUrl.pathname;

  const token = req.cookies.get("token")?.value;

  if (!token) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const payload = await verifyToken(token);

  if (!payload) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (
    ADMIN_ONLY.some((p) => pathname.startsWith(p)) &&
    payload.role !== "admin"
  ) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/protected/:path*"],
};









// import { NextResponse } from "next/server";

// export function middleware(req) {
//   console.log("Cookies:", req.cookies.getAll());

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/dashboard/:path*", "/api/protected/:path*"],
// };






// import { NextResponse } from "next/server";
// import { verifyToken } from "@/lib/auth";

// const ADMIN_ONLY = [
//   "/dashboard/volunteers",
//   "/dashboard/settings",
//   "/dashboard/treasurer",
// ];

// export function middleware(req) {
//   const pathname = req.nextUrl.pathname;

//   console.log("========== MIDDLEWARE ==========");
//   console.log("PATH:", pathname);

//   const token = req.cookies.get("token")?.value;

//   console.log("TOKEN:", token);

//   if (!token) {
//     console.log("NO TOKEN FOUND");

//     const loginUrl = new URL("/login", req.url);
//     loginUrl.searchParams.set("next", pathname);

//     return NextResponse.redirect(loginUrl);
//   }

//   const payload = verifyToken(token);

//   console.log("PAYLOAD:", payload);

//   if (!payload) {
//     console.log("INVALID TOKEN");

//     const loginUrl = new URL("/login", req.url);
//     loginUrl.searchParams.set("next", pathname);

//     return NextResponse.redirect(loginUrl);
//   }

//   if (
//     ADMIN_ONLY.some((p) => pathname.startsWith(p)) &&
//     payload.role !== "admin"
//   ) {
//     return NextResponse.redirect(new URL("/dashboard", req.url));
//   }

//   console.log("AUTH SUCCESS");

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/dashboard/:path*", "/api/protected/:path*"],
// };