import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";

const publicRoutes = ["/auth", "/"];
const imageExtensions = [".svg", ".jpg", ".png", ".webp", ".ico"];

export default auth((req) => {
  const path = req.nextUrl.pathname;

  // Skip middleware for image files and public routes
  if (
    imageExtensions.some((ext) => path.endsWith(ext)) ||
    publicRoutes.includes(path)
  ) {
    return;
  }

  // Skip middleware for API routes
  if (path.startsWith("/api/")) {
    return;
  }

  if (!req.auth) {
    const newUrl = new URL("/auth", req.nextUrl.origin);
    return NextResponse.redirect(newUrl);
  }
});

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
