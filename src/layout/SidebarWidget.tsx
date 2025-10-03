"use client";
import React from "react";
import { useAuth } from "@/context/AuthContext";

export default function SidebarWidget() {
  const { user, loading } = useAuth();

  return (
    <div className="mx-auto mb-10 w-full max-w-60 rounded-2xl bg-gray-50 px-4 py-5 text-center dark:bg-white/[0.03]">
      <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">Anda Login</h3>

      {loading ? (
        <p className="text-gray-400 text-sm">Memuat…</p>
      ) : user ? (
        <>
          <p className="mb-2 text-gray-500 text-theme-sm dark:text-gray-400">
            Menjadi{" "}
            <span className={`font-semibold ${user.role === "superadmin" ? "text-indigo-600" : "text-emerald-600"}`}>
              {user.role === "superadmin" ? "SuperAdmin" : "Admin"}
            </span>
          </p>
          {/* <p className="text-xs text-gray-400 dark:text-gray-500">{user.name}</p> */}
        </>
      ) : (
        <p className="text-gray-400 text-sm">(Session tidak ditemukan — silakan login)</p>
      )}
    </div>
  );
}
