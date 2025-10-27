"use client";

import { useEffect } from "react";
import { useSocket } from "@/context/SocketContext";
import { useAuth } from "@/context/AuthContext";

/**
 * Custom hook untuk sync realtime antara Socket.IO dan Auth
 * Gunakan ini di layout atau component root
 */
export function useRealtimeSync() {
  const { socket, isConnected } = useSocket();
  const { user, refreshUser, setUserDirectly } = useAuth();

  useEffect(() => {
    if (!socket || !isConnected) {
      console.log("⏳ Waiting for socket connection...");
      return;
    }

    console.log("⚡ Setting up realtime sync listeners");

    // ========================
    // Role Changed Event
    // ========================
    const handleRoleChanged = (data: { userId: string | number; newRole: string }) => {
      console.log("⚡ roleChanged event:", data);
      
      if (user && String(user.id) === String(data.userId)) {
        console.log(`🔄 Your role changed: ${user.role} → ${data.newRole}`);
        
        // Update user immediately
        setUserDirectly({
          ...user,
          role: data.newRole as "admin" | "superadmin",
        });
        
        // Validate with server after 500ms
        setTimeout(() => {
          refreshUser();
        }, 500);
      }
    };

    // ========================
    // User Created Event
    // ========================
    const handleUserCreated = (data: any) => {
      console.log("👤 User created:", data);
      
      // Emit custom event untuk components lain
      window.dispatchEvent(new CustomEvent("userListChanged", { detail: data }));
    };

    // ========================
    // User Deleted Event
    // ========================
    const handleUserDeleted = (data: { userId: string | number }) => {
      console.log("❌ User deleted:", data);
      
      // Check if current user was deleted
      if (user && String(user.id) === String(data.userId)) {
        console.log("🚨 Your account was deleted, logging out...");
        
        // Force logout
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`, {
          method: "POST",
          credentials: "include",
        }).catch(() => {});
        
        setUserDirectly(null);
        
        // Redirect to login
        window.location.href = "/login";
      }
      
      // Emit custom event untuk components lain
      window.dispatchEvent(new CustomEvent("userListChanged", { detail: data }));
    };

    // Register event listeners
    socket.on("roleChanged", handleRoleChanged);
    socket.on("userCreated", handleUserCreated);
    socket.on("userDeleted", handleUserDeleted);

    // Cleanup
    return () => {
      console.log("🧹 Cleaning up realtime sync listeners");
      socket.off("roleChanged", handleRoleChanged);
      socket.off("userCreated", handleUserCreated);
      socket.off("userDeleted", handleUserDeleted);
    };
  }, [socket, isConnected, user, refreshUser, setUserDirectly]);

  return { isConnected };
}