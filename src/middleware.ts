import { NextResponse } from "next/server";

// Middleware is intentionally minimal.
// Auth protection is handled client-side in DashboardLayout
// because Supabase JS client stores session in localStorage,
// which is not accessible in middleware (server-side).
export function middleware() {
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
