// middleware.ts (ROOT project, bukan di dalam src/)
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Rute yang mau dimatikan → redirect ke "/"
const disabledPaths = [
  "/form-elements",
  "/basic-tables",
  "/ui-elements",
  "/charts",
  "/blank",
  "/error-404",
];

export default function middleware(req: NextRequest) {
  const { nextUrl, cookies } = req;
  const url = nextUrl.clone();
  const pathname = nextUrl.pathname;
  const token = cookies.get("token")?.value;

  // 1) Khusus /signup → rewrite ke /error-404
  if (pathname === "/signup") {
    url.pathname = "/error-404";
    return NextResponse.rewrite(url);
  }

  // 2) Proteksi dashboard
  if (pathname.startsWith("/dashboard") && !token) {
    url.pathname = "/signin";
    return NextResponse.redirect(url);
  }

  // 3) Kalau sudah login tapi ke /signin → lempar ke /dashboard
  if (pathname === "/signin" && token) {
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  // 4) Matikan rute-rute tertentu → redirect ke "/"
  if (disabledPaths.some((p) => pathname.startsWith(p))) {
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  // Default: lanjut
  return NextResponse.next();
}

// Matcher: hanya jalankan middleware di rute-rute ini
export const config = {
  matcher: [
    "/signin",
    "/signup",
    "/dashboard/:path*",
    "/form-elements/:path*",
    "/basic-tables/:path*",
    "/ui-elements/:path*",
    "/charts/:path*",
    "/blank/:path*",
    "/error-404",
  ],
};
