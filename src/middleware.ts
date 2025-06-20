
import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

// Optional: protect specific routes
export const config = {
  matcher: [
    "/((?!.*\\..*|_next).*)", // protect all routes
    "/", // protect home
    "/dashboard(.*)", // protect /dashboard and all under it
    "/api/(.*)", // protect API routes if needed
  ],
};
