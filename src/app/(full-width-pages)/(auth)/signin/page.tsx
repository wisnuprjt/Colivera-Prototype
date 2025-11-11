"use client";

import { EyeCloseIcon, EyeIcon } from "@/icons";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import Head from "next/head";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function SignIn() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      await login(email, password);
      
      // Login berhasil - redirect berdasarkan role
      router.push("/dashboard");
      router.refresh();
    } catch (error: any) {
      console.error("Login error:", error);
      setErr(error?.message || "Login gagal. Periksa email dan password Anda.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Head>
        <title>Login - COLIVERA</title>
      </Head>
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="text-center mb-2">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
            Masuk ke Akun
          </h2>
          <p className="text-gray-500 text-sm">Gunakan kredensial yang telah terdaftar</p>
        </div>

        {err && <div className="text-sm text-red-600 dark:text-red-400 text-center">{err}</div>}

        <div>
          <Label>Email</Label>
          <Input
            type="email"
            placeholder="info@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="focus:ring-2 focus:ring-emerald-500 transition-all"
          />
        </div>

        <div>
          <Label>Password</Label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="focus:ring-2 focus:ring-emerald-500 transition-all"
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute cursor-pointer right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-600 transition"
            >
              {showPassword ? <EyeIcon /> : <EyeCloseIcon />}
            </span>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 rounded-xl shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? "Memproses..." : "Masuk"}
        </button>
      </form>
    </>
  );
}
