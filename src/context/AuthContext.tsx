"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Role = "admin" | "superadmin";

interface User {
  id: string | number;
  name: string;
  email: string;
  role: Role;
  token?: string; // ✨ Tambahan penting — simpan JWT token
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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // ========================
  // Fetch profil user login
  // ========================
  const fetchUser = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/me`, { credentials: "include" });
      if (!res.ok) {
        setUser(null);
      } else {
        const data = await res.json();
        // Bisa terima format { id, name, ... } atau { user: {...} }
        setUser((data && (data.user ?? data)) as User);
      }
    } catch (e) {
      console.error("Error fetching user:", e);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // ========================
  // LOGIN
  // ========================
  const login = async (email: string, password: string) => {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // biar cookie token ke-set juga
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Login failed");
    }

    const data = await res.json();

    // ✨ Simpan user + token JWT dari response backend
    const userWithToken = {
      ...(data.user ?? data),
      token: data.token, // token dikirim backend di response JSON
    };

    setUser(userWithToken as User);
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
    }
  };

  // ========================
  // REFRESH USER
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
// Hook custom useAuth
// ========================
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
