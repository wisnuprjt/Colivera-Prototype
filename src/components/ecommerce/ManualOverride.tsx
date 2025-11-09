"use client";
import { useState } from "react";
import { Power, Loader2, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";

interface OverrideResponse {
  success: boolean;
  message: string;
}

export default function ManualOverride() {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleOverride = async () => {
    // Konfirmasi sebelum execute
    const confirmed = window.confirm(
      "⚠️ Apakah Anda yakin ingin mengaktifkan Manual Override?\n\nIni akan mengirim perintah ke perangkat IoT."
    );

    if (!confirmed) return;

    setIsLoading(true);
    setStatus("idle");
    setMessage("");

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      console.log("Sending override request to:", `${apiUrl}/override`);
      
      const response = await fetch(`${apiUrl}/override`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Kirim cookie JWT
      });

      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers.get("content-type"));

      // Check if response is JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        console.error("Invalid content-type:", contentType);
        throw new Error("Server error: Invalid response format. Please check if backend is running.");
      }

      const data: OverrideResponse = await response.json();
      console.log("Response data:", data);

      // Handle different status codes
      if (response.status === 401) {
        throw new Error("⚠️ Unauthorized: Silakan login terlebih dahulu");
      }

      if (!response.ok) {
        throw new Error(data.message || `Server error: ${response.status}`);
      }

      if (data.success) {
        setStatus("success");
        setMessage(data.message || "Override command sent successfully!");
        
        // Reset status setelah 5 detik
        setTimeout(() => {
          setStatus("idle");
          setMessage("");
        }, 5000);
      } else {
        throw new Error(data.message || "Failed to send override command");
      }
    } catch (error) {
      console.error("Override error:", error);
      setStatus("error");
      setMessage(
        error instanceof Error ? error.message : "Failed to connect to server"
      );
      
      // Reset status setelah 5 detik
      setTimeout(() => {
        setStatus("idle");
        setMessage("");
      }, 5000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Manual Override
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Kontrol manual untuk sistem IoT
          </p>
        </div>
        
        {/* Status Indicator */}
        {status === "success" && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 dark:bg-green-900/20">
            <CheckCircle2 className="size-4 text-green-600 dark:text-green-400" />
            <span className="text-xs font-medium text-green-700 dark:text-green-300">
              Sent
            </span>
          </div>
        )}
        
        {status === "error" && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50 dark:bg-red-900/20">
            <XCircle className="size-4 text-red-600 dark:text-red-400" />
            <span className="text-xs font-medium text-red-700 dark:text-red-300">
              Failed
            </span>
          </div>
        )}
      </div>

      {/* Warning Alert */}
      <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 dark:border-amber-800/50 dark:bg-amber-900/20 p-4">
        <div className="flex gap-3">
          <AlertTriangle className="size-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-amber-900 dark:text-amber-200">
              Peringatan
            </h4>
            <p className="mt-1 text-xs text-amber-700 dark:text-amber-300">
              Manual override akan mengirim perintah langsung ke perangkat IoT. 
              Pastikan Anda memahami dampaknya sebelum mengaktifkan.
            </p>
          </div>
        </div>
      </div>

      {/* Override Button */}
      <button
        onClick={handleOverride}
        disabled={isLoading}
        className={`
          w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl
          font-semibold text-white transition-all duration-200
          ${
            isLoading
              ? "bg-gray-400 cursor-not-allowed"
              : status === "success"
              ? "bg-green-600 hover:bg-green-700"
              : status === "error"
              ? "bg-red-600 hover:bg-red-700"
              : "bg-gradient-to-r from-[#4F7C82] to-[#0B2E33] hover:shadow-lg hover:scale-[1.02]"
          }
        `}
      >
        {isLoading ? (
          <>
            <Loader2 className="size-5 animate-spin" />
            <span>Mengirim Perintah...</span>
          </>
        ) : (
          <>
            <Power className="size-5" />
            <span>Aktifkan Manual Override</span>
          </>
        )}
      </button>

      {/* Status Message */}
      {message && (
        <div className="mt-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-3">
          <p className={`text-sm ${
            status === "success" 
              ? "text-green-700 dark:text-green-300" 
              : "text-red-700 dark:text-red-300"
          }`}>
            {message}
          </p>
        </div>
      )}

      {/* Info */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <p className="text-gray-500 dark:text-gray-400">MQTT Broker</p>
            <p className="mt-1 font-medium text-gray-800 dark:text-white/90">
              HiveMQ Cloud
            </p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400">Topic</p>
            <p className="mt-1 font-mono text-[10px] font-medium text-gray-800 dark:text-white/90">
              colivera/command/override
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
