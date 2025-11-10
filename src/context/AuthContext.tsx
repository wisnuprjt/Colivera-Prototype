"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

type Role = "admin" | "superadmin";

interface User {
  id: string | number;
  name: string;
  email: string;
  role: Role;
  created_at?: string;   // ✅ tambahkan
  updated_at?: string;   // ✅ opsional, bisa berguna nanti
  token?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  setUserDirectly: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ✅ CRITICAL: Add fallback to prevent undefined
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://colivera-be-production.up.railway.app/api';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // ========================
  // Fetch User Session
  // ========================
  const fetchUser = useCallback(async (silent = false) => {
    try {
      if (!silent) {
        console.log("🔄 Fetching user session from:", API_BASE);
      }

      const res = await fetch(`${API_BASE}/auth/me`, {
        method: 'GET',
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      });

      if (!silent) {
        console.log("📡 Response status:", res.status);
      }

      if (!res.ok) {
        if (!silent) {
          console.log("🔴 No active session - Status:", res.status);
        }
        setUser(null);
        return;
      }

      const data = await res.json();
      
      if (!silent) {
        console.log("📦 Raw response:", data);
      }
      
      // ✅ Handle both response formats
      const userData = (data.user || data) as User;
      
      // ✅ Validate before setting
      if (!userData || !userData.email || !userData.role) {
        console.error("⚠️ Invalid user data:", userData);
        setUser(null);
        return;
      }
      
      if (!silent) {
        console.log("✅ Session loaded:", {
          name: userData.name,
          email: userData.email,
          role: userData.role
        });
      }
      
      setUser(userData);
      
    } catch (e: any) {
      console.error("❌ Fetch user error:", e.message);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // ========================
  // Initial Load & Periodic Sync
  // ========================
  useEffect(() => {
    console.log("🚀 AuthContext initializing...");
    
    // Load user immediately
    fetchUser(false);

    // ✅ Reduced frequency: check every 30 seconds
    const interval = setInterval(() => {
      fetchUser(true);
    }, 30000);

    // Cross-tab sync
    const syncHandler = (e: StorageEvent) => {
      if (e.key === "colivera_session_change") {
        console.log("🪄 Cross-tab sync triggered");
        fetchUser(false);
      }
    };
    window.addEventListener("storage", syncHandler);

    // Tab visibility
    const visibilityHandler = () => {
      if (document.visibilityState === "visible") {
        fetchUser(true);
      }
    };
    document.addEventListener("visibilitychange", visibilityHandler);

    return () => {
      clearInterval(interval);
      window.removeEventListener("storage", syncHandler);
      document.removeEventListener("visibilitychange", visibilityHandler);
    };
  }, [fetchUser]);

  // ========================
  // LOGIN
  // ========================
  const login = async (email: string, password: string) => {
    console.log("🔐 Attempting login to:", API_BASE);
    
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      console.error("❌ Login failed:", err.message);
      throw new Error(err.message || "Login failed");
    }

    const data = await res.json();
    console.log("📦 Login response:", data);
    
    // ✅ Handle response format
    const userData = (data.user || data) as User;
    
    console.log("✅ Login success:", {
      name: userData.name,
      email: userData.email,
      role: userData.role
    });
    
    setUser(userData);
    localStorage.setItem("colivera_session_change", Date.now().toString());
    
    // Immediate validation with delay
    setTimeout(() => fetchUser(false), 500);
  };

  // ========================
  // LOGOUT
  // ========================
  const logout = async () => {
    try {
      console.log("🚪 Logging out...");
      await fetch(`${API_BASE}/auth/logout`, {
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
  // Manual Refresh
  // ========================
  const refreshUser = async () => {
    await fetchUser(false);
  };

  // ========================
  // Direct User Update (for realtime sync)
  // ========================
  const setUserDirectly = useCallback((newUser: User | null) => {
    setUser(newUser);
  }, []);

  return (
    <AuthContext.Provider 
      value={{ user, loading, login, logout, refreshUser, setUserDirectly }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}