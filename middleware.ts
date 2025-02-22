import NextAuth from "next-auth";
import authConfig from "@/auth.config";
import { API_AUTH_PREFIX, AUTH_ROUTES, DEFAULT_REDIRECT, PUBLIC_ROUTES, ROOT } from "./lib/routes";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isAuthenticated = !!req.auth;
  console.log("ROUTE: ", nextUrl.pathname, ", isLoggedIn: ", isAuthenticated);

  const isApiAuthRoute = nextUrl.pathname.startsWith(API_AUTH_PREFIX);

  const isPublicRoute = PUBLIC_ROUTES.includes(nextUrl.pathname);
  const isAuthRoute = AUTH_ROUTES.includes(nextUrl.pathname);

  if (isApiAuthRoute) return;

  if (isAuthRoute) {
    if (isAuthenticated) {
      return Response.redirect(new URL(DEFAULT_REDIRECT, nextUrl));
    }
    return;
  }

  if (!isAuthenticated && !isPublicRoute) {
    let callbackURL = nextUrl.pathname;
    if (nextUrl.search) callbackURL += nextUrl.search;
    const encodedCallbackUrl = encodeURIComponent(callbackURL);
    console.log("ecodedURL: ", encodedCallbackUrl);

    return Response.redirect(new URL(`/?callbackUrl=${encodedCallbackUrl}`, nextUrl));
  }

  return;
});

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
