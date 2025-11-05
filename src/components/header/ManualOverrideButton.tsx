"use client";
import { useState } from "react";
import { Power, Loader2, CheckCircle2, XCircle } from "lucide-react";
import axiosInstance from "@/lib/axios";

interface OverrideResponse {
  success: boolean;
  message: string;
}

export default function ManualOverrideButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleOverride = async () => {
    setIsLoading(true);
    setStatus("idle");

    try {
      const response = await axiosInstance.post<OverrideResponse>("/api/override");

      if (response.data.success) {
        setStatus("success");
        
        // Reset status setelah 3 detik
        setTimeout(() => {
          setStatus("idle");
        }, 3000);
      } else {
        throw new Error(response.data.message || "Failed to send override command");
      }
    } catch (error) {
      console.error("Override error:", error);
      setStatus("error");
      
      // Reset status setelah 3 detik
      setTimeout(() => {
        setStatus("idle");
      }, 3000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleOverride}
      disabled={isLoading}
      className={`
        flex items-center gap-2 px-3 py-2 rounded-lg
        font-medium text-sm transition-all duration-200
        ${
          isLoading
            ? "bg-gray-400 text-white cursor-not-allowed"
            : status === "success"
            ? "bg-green-600 text-white hover:bg-green-700"
            : status === "error"
            ? "bg-red-600 text-white hover:bg-red-700"
            : "bg-gradient-to-r from-[#4F7C82] to-[#0B2E33] text-white hover:shadow-lg"
        }
      `}
      title="Manual Override - Kirim perintah ke IoT"
    >
      {isLoading ? (
        <>
          <Loader2 className="size-4 animate-spin" />
          <span className="hidden sm:inline">Mengirim...</span>
        </>
      ) : status === "success" ? (
        <>
          <CheckCircle2 className="size-4" />
          <span className="hidden sm:inline">Terkirim</span>
        </>
      ) : status === "error" ? (
        <>
          <XCircle className="size-4" />
          <span className="hidden sm:inline">Gagal</span>
        </>
      ) : (
        <>
          <Power className="size-4" />
          <span className="hidden sm:inline">Manual Override</span>
        </>
      )}
    </button>
  );
}
