"use client";
import React, { useState, useEffect } from "react";
import {
  WavesIcon,
  ThermometerIcon,
  DropletsIcon,
  BeakerIcon,
  BugIcon,
} from "lucide-react";

interface SensorData {
  timestamp: string;
  temp_c: number;
  do_mgl: number;
  ph: number;
  conductivity_uscm: number;
  totalcoliform_mv: number;
}

export const EcommerceMetrics = () => {
  const [sensorData, setSensorData] = useState<SensorData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    const fetchSensorData = async () => {
      // Set fetching state (untuk animasi pulse)
      if (!isLoading) {
        setIsFetching(true);
      }

      try {
        // Gunakan Next.js API route untuk menghindari CORS
        const response = await fetch("/api/sensor", {
          method: 'GET',
          cache: 'no-cache',
          credentials: 'include', // Kirim cookies
        });
        
        const result = await response.json();
        
        // Handle 401 Unauthorized
        if (response.status === 401) {
          setError("Silakan login terlebih dahulu untuk melihat data sensor.");
          return;
        }
        
        // Handle different response statuses
        if (response.status === 504) {
          // Gateway timeout - HuggingFace cold start
          console.warn("API timeout, will retry in 30s...");
          setError("Server sedang memuat (cold start). Menunggu...");
          return; // Keep last known data
        }
        
        if (response.status === 503) {
          // Service unavailable - Network error
          console.warn("Service unavailable, will retry in 30s...");
          setError("Tidak dapat terhubung ke server. Akan retry otomatis...");
          return; // Keep last known data
        }
        
        if (response.status === 500) {
          // Internal server error
          console.error("API error 500:", result.message);
          setError(result.message || "Server error. Mencoba lagi dalam 30 detik...");
          return; // Keep last known data, will auto-retry
        }
        
        if (!response.ok) {
          console.error("API error:", response.status, result);
          setError(`Error ${response.status}: ${result.message || "Tidak dapat mengambil data"}`);
          return;
        }
        
        if (result.status === "success" && result.data) {
          setSensorData(result.data);
          setError(null);
        } else if (result.status === "no_data") {
          // API belum memiliki data
          setError("Belum ada data sensor. Menunggu data dari IoT device...");
        } else if (result.status === "error") {
          setError(result.message || "Error dari API");
        } else {
          setError("Format data tidak valid");
        }
      } catch (err) {
        console.error("Error fetching sensor data:", err);
        
        // Handle specific errors
        if (err instanceof Error) {
          if (err.name === 'AbortError') {
            setError("Request timeout. API terlalu lama merespons.");
          } else if (err.message.includes('fetch') || err.message.includes('Failed to fetch')) {
            setError("Tidak bisa terhubung ke server. Cek koneksi internet Anda.");
          } else {
            setError(err.message);
          }
        } else {
          setError("Failed to fetch data");
        }
      } finally {
        setIsLoading(false);
        // Delay sebentar untuk animasi smooth
        setTimeout(() => setIsFetching(false), 500);
      }
    };

    fetchSensorData();
    
    // Auto-refresh setiap 30 detik
    const interval = setInterval(fetchSensorData, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // Helper functions untuk menentukan status parameter
  const getSuhuStatus = (temp: number) => {
    if (temp === -1) return { text: "Rusak", color: "error" };
    if ((temp >= 10 && temp <= 35) || temp >= 45) return { text: "Aman", color: "success" };
    if (temp >= 36 && temp <= 44) return { text: "Waspada", color: "warning" };
    return { text: "Bahaya", color: "danger" }; // Di bawah 10°C
  };

  const getDOStatus = (do_mgl: number) => {
    if (do_mgl === -1) return { text: "Rusak", color: "error" };
    if (do_mgl >= 6) return { text: "Aman", color: "success" };
    if (do_mgl >= 5 && do_mgl < 6) return { text: "Waspada", color: "warning" };
    return { text: "Bahaya", color: "danger" }; // < 5 (potensi kontaminasi)
  };

  const getPhStatus = (ph: number) => {
    if (ph === -1) return { text: "Rusak", color: "error" };
    if (ph >= 6.5 && ph <= 8.5) return { text: "Aman", color: "success" };
    return { text: "Waspada", color: "warning" }; // Di luar range optimal
  };

  const getKonduktivitasStatus = (conductivity: number) => {
    if (conductivity === -1) return { text: "Rusak", color: "error" };
    if (conductivity < 1000) return { text: "Aman", color: "success" };
    return { text: "Bahaya", color: "danger" }; // >= 1000 (tidak layak konsumsi)
  };

  const getTotalColiformStatus = (coliform: number) => {
    if (coliform === -1) return { text: "Rusak", color: "error" };
    if (coliform === 0) return { text: "Aman", color: "success" };
    return { text: "Bahaya", color: "danger" }; // > 0 (terkontaminasi)
  };

  const cards = [
    {
      title: "Konduktivitas",
      value: sensorData ? `${sensorData.conductivity_uscm.toFixed(1)} µS/cm` : "-- µS/cm",
      color: "bg-sky-100 text-sky-700 dark:bg-sky-800 dark:text-sky-200",
      icon: <WavesIcon className="size-6" />,
      badge: sensorData ? getKonduktivitasStatus(sensorData.conductivity_uscm) : { text: "--", color: "success" },
    },
    {
      title: "Suhu",
      value: sensorData ? `${sensorData.temp_c.toFixed(1)} °C` : "-- °C",
      color: "bg-orange-100 text-orange-700 dark:bg-orange-800 dark:text-orange-200",
      icon: <ThermometerIcon className="size-6" />,
      badge: sensorData ? getSuhuStatus(sensorData.temp_c) : { text: "--", color: "success" },
    },
    {
      title: "Dissolved Oxygen (DO)",
      value: sensorData ? `${sensorData.do_mgl.toFixed(1)} mg/L` : "-- mg/L",
      color: "bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-200",
      icon: <DropletsIcon className="size-6" />,
      badge: sensorData ? getDOStatus(sensorData.do_mgl) : { text: "--", color: "success" },
    },
    {
      title: "pH",
      value: sensorData ? sensorData.ph.toFixed(1) : "--",
      color: "bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-200",
      icon: <BeakerIcon className="size-6" />,
      badge: sensorData ? getPhStatus(sensorData.ph) : { text: "--", color: "success" },
    },
    {
      title: "Total Coliform (Sensor)",
      value: sensorData ? `${sensorData.totalcoliform_mv.toFixed(1)} MPN/100ml` : "-- MPN/100ml",
      color: "bg-purple-100 text-purple-700 dark:bg-purple-800 dark:text-purple-200",
      icon: <BugIcon className="size-6" />,
      badge: sensorData ? getTotalColiformStatus(sensorData.totalcoliform_mv) : { text: "--", color: "success" },
    },
  ];

  const Badge = ({ text, color }: { text: string; color: string }) => {
    const colorClasses = {
      success: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200",
      warning: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-200",
      danger: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200",
      error: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
    };

    return (
      <div
        className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${
          colorClasses[color as keyof typeof colorClasses] || colorClasses.success
        }`}
      >
        ● {text}
      </div>
    );
  };

  if (error && !sensorData) {
    const isAuthError = error.includes("login");
    
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className={`col-span-full rounded-xl border p-6 text-center ${
          isAuthError 
            ? "border-red-200 bg-red-50 dark:bg-red-900/20" 
            : "border-amber-200 bg-amber-50 dark:bg-amber-900/20"
        }`}>
          <div className="flex flex-col items-center gap-3">
            <div className={`size-12 rounded-full flex items-center justify-center ${
              isAuthError
                ? "bg-red-100 dark:bg-red-900/40"
                : "bg-amber-100 dark:bg-amber-900/40"
            }`}>
              {isAuthError ? (
                <svg className="size-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              ) : (
                <WavesIcon className="size-6 text-amber-600 dark:text-amber-400" />
              )}
            </div>
            <div>
              <p className={`font-semibold ${
                isAuthError
                  ? "text-red-900 dark:text-red-200"
                  : "text-amber-900 dark:text-amber-200"
              }`}>
                {isAuthError ? "Authentication Required" : "Menunggu Data Sensor"}
              </p>
              <p className={`text-sm mt-1 ${
                isAuthError
                  ? "text-red-700 dark:text-red-300"
                  : "text-amber-700 dark:text-amber-300"
              }`}>
                {error}
              </p>
              {!isAuthError && (
                <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">
                  Akan otomatis refresh setiap 30 detik...
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 animate-fade-in">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 dark:from-[#1a1a1a] dark:to-[#222] dark:border-gray-800 p-6 shadow-sm hover:shadow-md transition-all duration-300 ${
            isFetching ? "ring-2 ring-[#4F7C82] ring-opacity-50" : ""
          }`}
        >
          <div className="flex items-center justify-between">
            <div
              className={`flex items-center justify-center w-12 h-12 rounded-xl ${card.color} transition-all duration-300`}
            >
              {card.icon}
            </div>
            
            {isFetching && (
              <div className="flex items-center gap-2">
                <div className="size-2 rounded-full bg-[#4F7C82] animate-pulse"></div>
                <span className="text-xs text-[#4F7C82] font-medium">Updating...</span>
              </div>
            )}
          </div>

          <div className="flex items-end justify-between mt-5">
            <div className="flex-1">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {card.title}
              </span>
              <h4 className={`mt-2 font-extrabold text-gray-800 text-2xl dark:text-white/90 transition-all duration-500 ${
                isFetching ? "scale-105" : "scale-100"
              }`}>
                {isLoading ? (
                  <span className="inline-block w-20 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></span>
                ) : (
                  card.value
                )}
              </h4>
            </div>
            {!isLoading && <Badge text={card.badge.text} color={card.badge.color} />}
          </div>
        </div>
      ))}
    </div>
  );
};
