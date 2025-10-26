"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

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

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const socketRef = useRef<Socket | null>(null);

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
  // INIT SOCKET.IO (HANYA SEKALI)
  // ========================
  useEffect(() => {
    // Init socket
    socketRef.current = io(API_BASE, {
      withCredentials: true,
      transports: ["websocket"],
    });

    const socket = socketRef.current;

    socket.on("connect", () => {
      console.log("🟢 Connected to Socket.IO:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("🔴 Disconnected from Socket.IO");
    });

    // Cleanup saat unmount
    return () => {
      socket.disconnect();
      console.log("🧹 Socket cleaned up");
    };
  }, []); // ✅ Empty dependency - hanya run sekali

  // ========================
  // SOCKET LISTENERS (dengan user sebagai dependency)
  // ========================
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    // Handler untuk role changed
    const handleRoleChanged = (data: any) => {
      if (user && data.userId === user.id) {
        console.log("⚡ Role changed:", data.newRole);
        setUser((prev) =>
          prev ? { ...prev, role: data.newRole as Role } : prev
        );
      }
    };

    // Handler untuk user created (optional - bisa trigger refresh list)
    const handleUserCreated = (data: any) => {
      console.log("👤 User created:", data);
      // Opsional: trigger refresh di user management page
    };

    // Handler untuk user deleted
    const handleUserDeleted = (data: any) => {
      console.log("❌ User deleted:", data);
      // Opsional: trigger refresh di user management page
    };

    // Register listeners
    socket.on("roleChanged", handleRoleChanged);
    socket.on("userCreated", handleUserCreated);
    socket.on("userDeleted", handleUserDeleted);

    // Cleanup listeners
    return () => {
      socket.off("roleChanged", handleRoleChanged);
      socket.off("userCreated", handleUserCreated);
      socket.off("userDeleted", handleUserDeleted);
    };
  }, [user]); // ✅ Ini aman karena hanya listener yang di-update, bukan socket connection

  // ========================
  // AUTO SYNC SESSION
  // ========================
  useEffect(() => {
    // Fetch user pertama kali
    fetchUser();

    // 🔄 AUTO REFRESH SESSION tiap 30 detik (fallback)
    const interval = setInterval(fetchUser, 30000);

    // 🪄 SYNC ANTAR TAB (login/logout sinkron)
    const syncHandler = (e: StorageEvent) => {
      if (e.key === "colivera_session_change") fetchUser();
    };
    window.addEventListener("storage", syncHandler);

    // Cleanup
    return () => {
      clearInterval(interval);
      window.removeEventListener("storage", syncHandler);
    };
  }, []); // ✅ Empty dependency - setup sekali saja

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