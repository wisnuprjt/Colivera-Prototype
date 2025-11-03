"use client";
import React from "react";
import { useAuth } from "@/context/AuthContext";

export default function SidebarWidget() {
  const { user, loading } = useAuth();

  return (
    <div className="group relative mx-auto mb-10 w-full max-w-60 overflow-hidden rounded-3xl text-center">
      {/* Liquid glass background with blur and gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/20 to-white/10 backdrop-blur-xl dark:from-white/10 dark:via-white/5 dark:to-white/[0.02]" />
      
      {/* Animated gradient overlay */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 opacity-0 transition-opacity duration-700 group-hover:opacity-100 dark:from-blue-400/10 dark:via-purple-400/10 dark:to-pink-400/10" />
      
      {/* Shimmer effect */}
      <div className="pointer-events-none absolute -inset-full top-0 block h-full w-1/2 -skew-x-12 transform bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:animate-[shimmer_1.5s_ease-in-out] dark:via-white/10" />
      
      {/* Border glow */}
      <div className="absolute inset-0 rounded-3xl border border-white/20 dark:border-white/10" />
      
      {/* Content */}
      <div className="relative px-4 py-5">
        <h3 className="mb-2 font-semibold text-gray-900 transition-transform duration-300 group-hover:scale-105 dark:text-white">
          Anda Login
        </h3>

        {loading ? (
          <p className="animate-pulse text-sm text-gray-400">Memuat…</p>
        ) : user ? (
          <div className="transition-transform duration-300 group-hover:scale-[1.02]">
            <p className="mb-2 text-theme-sm text-gray-500 dark:text-gray-400">
              Menjadi{" "}
              <span 
                className={`font-semibold transition-all duration-300 ${
                  user.role === "superadmin" 
                    ? "text-indigo-600 group-hover:text-indigo-500" 
                    : "text-emerald-600 group-hover:text-emerald-500"
                }`}
              >
                {user.role === "superadmin" ? "SuperAdmin" : "User"}
              </span>
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500">{user.name}</p>
          </div>
        ) : (
          <p className="text-sm text-gray-400">(Session tidak ditemukan — Tolong Refresh)</p>
        )}
      </div>
    </div>
  );
}
