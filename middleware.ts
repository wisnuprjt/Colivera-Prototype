// middleware.ts  (ROOT project, bukan di dalam src/)
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Middleware ini hanya akan jalan pada path yang ada di `matcher` di bawah
export default function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  url.pathname = "/";               // ganti tujuan sesuai mau kamu ("/" / "/auth/signin" / dll)
  return NextResponse.redirect(url);
}

// Batasi hanya untuk rute yang ingin kamu “matikan”
export const config = {
  matcher: [
    "/form-elements",
    "/basic-tables",
    "/ui-elements",
    "/charts",
    "/blank",
    "/error-404",
  ],
};
