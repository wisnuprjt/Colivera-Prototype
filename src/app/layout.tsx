"use client";

import { Outfit } from 'next/font/google';
import './globals.css';

import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/context/AuthContext';
import { SocketProvider } from '@/context/SocketContext';
import { useRealtimeSync } from '@/hooks/useRealtimeSync';

const outfit = Outfit({
  subsets: ["latin"],
});

// Component wrapper untuk initialize realtime sync
function RealtimeSyncInitializer({ children }: { children: React.ReactNode }) {
  const { isConnected } = useRealtimeSync();
  
  return (
    <>
      {/* Optional: Connection status indicator */}
      {!isConnected && (
        <div className="fixed top-4 right-4 px-3 py-1 bg-yellow-500 text-white text-xs rounded-full shadow-lg z-50 animate-pulse">
          🔄 Menghubungkan...
        </div>
      )}
      {children}
    </>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.className} dark:bg-gray-900`}>
        {/* 1️⃣ Socket Provider - paling luar */}
        <SocketProvider>
          {/* 2️⃣ Auth Provider */}
          <AuthProvider>
            {/* 3️⃣ Theme & Sidebar Providers (existing) */}
            <ThemeProvider>
              <SidebarProvider>
                {/* 4️⃣ Realtime Sync - bridge antara Socket & Auth */}
                <RealtimeSyncInitializer>
                  {children}
                </RealtimeSyncInitializer>
              </SidebarProvider>
            </ThemeProvider>
          </AuthProvider>
        </SocketProvider>
      </body>
    </html>
  );
}