"use client";
import React, { useState, useEffect } from "react";
import {
  WavesIcon,
  ThermometerIcon,
  DropletsIcon,
  BeakerIcon,
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
        });
        
        const result = await response.json();
        
        // Handle different response statuses
        if (response.status === 504) {
          // Gateway timeout - HuggingFace cold start
          console.warn("API timeout, will retry in 30s...");
          setError("Server sedang memuat (cold start). Menunggu...");
          return; // Keep last known data
        }
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
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
          throw new Error("Invalid data format");
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

  const cards = [
    {
      title: "Konduktivitas",
      value: sensorData ? `${sensorData.conductivity_uscm.toFixed(1)} µS/cm` : "-- µS/cm",
      color: "bg-sky-100 text-sky-700 dark:bg-sky-800 dark:text-sky-200",
      icon: <WavesIcon className="size-6" />,
      badge: { 
        text: sensorData && sensorData.conductivity_uscm <= 1500 ? "Normal" : "Tinggi", 
        color: sensorData && sensorData.conductivity_uscm <= 1500 ? "success" : "danger" 
      },
    },
    {
      title: "Suhu",
      value: sensorData ? `${sensorData.temp_c.toFixed(1)} °C` : "-- °C",
      color: "bg-orange-100 text-orange-700 dark:bg-orange-800 dark:text-orange-200",
      icon: <ThermometerIcon className="size-6" />,
      badge: { text: "Stabil", color: "success" },
    },
    {
      title: "Dissolved Oxygen (DO)",
      value: sensorData ? `${sensorData.do_mgl.toFixed(1)} mg/L` : "-- mg/L",
      color: "bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-200",
      icon: <DropletsIcon className="size-6" />,
      badge: { 
        text: sensorData && sensorData.do_mgl >= 5 ? "Aman" : "Rendah", 
        color: sensorData && sensorData.do_mgl >= 5 ? "success" : "danger" 
      },
    },
    {
      title: "pH",
      value: sensorData ? sensorData.ph.toFixed(1) : "--",
      color: "bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-200",
      icon: <BeakerIcon className="size-6" />,
      badge: { 
        text: sensorData && sensorData.ph >= 6.5 && sensorData.ph <= 8.5 ? "Optimal" : "Warning", 
        color: sensorData && sensorData.ph >= 6.5 && sensorData.ph <= 8.5 ? "success" : "danger" 
      },
    },
  ];

  const Badge = ({ text, color }: { text: string; color: string }) => (
    <div
      className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${
        color === "success"
          ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200"
          : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200"
      }`}
    >
      ● {text}
    </div>
  );

  if (error && !sensorData) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="col-span-full rounded-xl border border-amber-200 bg-amber-50 dark:bg-amber-900/20 p-6 text-center">
          <div className="flex flex-col items-center gap-3">
            <div className="size-12 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center">
              <WavesIcon className="size-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="font-semibold text-amber-900 dark:text-amber-200">Menunggu Data Sensor</p>
              <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">{error}</p>
              <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">Akan otomatis refresh setiap 30 detik...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
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
