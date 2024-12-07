import { auth } from "@/lib/auth";

const publicRoutes = ["/auth", "/landing"];

export default auth((req) => {
  const path = req.nextUrl.pathname;
  const isPublicRoute = publicRoutes.includes(path);

  if (!req.auth && !isPublicRoute) {
    const newUrl = new URL("/auth", req.nextUrl.origin);
    return Response.redirect(newUrl);
  }
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
