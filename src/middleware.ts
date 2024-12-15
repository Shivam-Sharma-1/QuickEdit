import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

const publicRoutes = ["/auth", "/"];
const imageExtensions = [".svg", ".jpg", ".png", ".webp", ".ico"];

export default auth((req) => {
  const path = req.nextUrl.pathname;

  // Skip middleware for image files
  if (imageExtensions.some((ext) => path.endsWith(ext))) {
    return;
  }

  const isPublicRoute = publicRoutes.includes(path);

  if (!req.auth && !isPublicRoute) {
    const newUrl = new URL("/auth", req.nextUrl.origin);
    return NextResponse.redirect(newUrl);
  }
});

export const config = {
  matcher: ["/((?!_next).*)"],
};
