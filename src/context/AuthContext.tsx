"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { io } from "socket.io-client";

type Role = "admin" | "superadmin";

interface User {
  id: string | number;
  name: string;
  email: string;
  role: Role;
  token?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000";

// ========================
// 🔌 Socket.IO Client
// ========================
const socket = io(API_BASE, {
  withCredentials: true,
  transports: ["websocket"],
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // ========================
  // Fetch profil user aktif
  // ========================
  const fetchUser = async () => {
    try {
      if (!API_BASE) {
        console.warn("API_BASE is not configured");
        setUser(null);
        return;
      }

      const res = await fetch(`${API_BASE}/api/auth/me`, {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        setUser(null);
      } else {
        const data = await res.json();
        setUser((data && (data.user ?? data)) as User);
      }
    } catch (e) {
      console.warn("Could not fetch user data. Server may not be running:", e);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // ========================
  // INIT & AUTO SYNC SESSION
  // ========================
  useEffect(() => {
    fetchUser(); // pertama kali load

    // 🔁 AUTO REFRESH SESSION tiap 30 detik (fallback)
    const interval = setInterval(fetchUser, 30000);

    // 🪄 SYNC ANTAR TAB (login/logout sinkron)
    const syncHandler = (e: StorageEvent) => {
      if (e.key === "colivera_session_change") fetchUser();
    };
    window.addEventListener("storage", syncHandler);

    // ========================
    // ⚡ SOCKET.IO REALTIME LISTENER
    // ========================
    socket.on("connect", () => {
      console.log("🟢 Connected to Socket.IO:", socket.id);
    });

    // Kalau role user berubah di DB → langsung update state
    socket.on("roleChanged", (data: any) => {
      if (user && data.userId === user.id) {
        console.log("⚡ Role changed:", data.newRole);
        // Langsung ubah state tanpa fetch ulang (lebih cepat)
        setUser((prev) =>
          prev ? { ...prev, role: data.newRole as Role } : prev
        );
      }
    });

    // Optional — user dibuat
    socket.on("userCreated", (data: any) => {
      console.log("👤 User created:", data);
    });

    // Optional — user dihapus
    socket.on("userDeleted", (data: any) => {
      console.log("❌ User deleted:", data);
    });

    // Bersihkan listener saat komponen unmount
    return () => {
      clearInterval(interval);
      window.removeEventListener("storage", syncHandler);
      socket.off("roleChanged");
      socket.off("userCreated");
      socket.off("userDeleted");
    };
  }, [user]);

  // ========================
  // LOGIN
  // ========================
  const login = async (email: string, password: string) => {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Login failed");
    }

    const data = await res.json();
    const userWithToken = {
      ...(data.user ?? data),
      token: data.token,
    };

    setUser(userWithToken as User);

    // 🪄 trigger sync antar tab
    localStorage.setItem("colivera_session_change", Date.now().toString());
  };

  // ========================
  // LOGOUT
  // ========================
  const logout = async () => {
    try {
      await fetch(`${API_BASE}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (e) {
      console.error("Logout error:", e);
    } finally {
      setUser(null);
      localStorage.setItem("colivera_session_change", Date.now().toString());
    }
  };

  // ========================
  // REFRESH USER MANUAL
  // ========================
  const refreshUser = async () => {
    await fetchUser();
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

// ========================
// Hook custom useAuth()
// ========================
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
