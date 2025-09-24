import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // VALIDASI SEDERHANA
    if (!email || !password || password.length < 8) {
      return NextResponse.json(
        { ok: false, message: "Invalid credentials" },
        { status: 400 }
      );
    }

    // Role demo: email mengandung 'superadmin' => superadmin
    const role = String(email).includes("superadmin") ? "superadmin" : "admin";

    // Token mock
    const token = "mock-" + Math.random().toString(36).slice(2);

    // Set cookie
    cookies().set("token", token, { httpOnly: true, path: "/", maxAge: 60 * 60 * 24, sameSite: "lax" });
    cookies().set("role", role, { httpOnly: true, path: "/", maxAge: 60 * 60 * 24, sameSite: "lax" });

    return NextResponse.json({ ok: true, role });
  } catch {
    return NextResponse.json({ ok: false, message: "Server error" }, { status: 500 });
  }
}
