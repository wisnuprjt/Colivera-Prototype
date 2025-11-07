"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";

// Interface untuk data sensor dari API
interface SensorData {
  timestamp: string;
  temp_c: number;
  do_mgl: number;
  ph: number;
  conductivity_uscm: number;
  totalcoliform_mv: number;
}

// struktur untuk tampilan tabel
interface SensorLog {
  id: number;
  parameter: string;
  value: string;
  unit: string;
  status: "Normal" | "Stable" | "Safe" | "Optimal" | "Warning" | "High" | "Low";
  icon: string;
  timestamp: string;
}

export default function RecentSensorActivity() {
  const [sensorData, setSensorData] = useState<SensorData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSensorData = async () => {
      try {
        const response = await fetch("/api/sensor", {
          method: 'GET',
          cache: 'no-cache',
          credentials: 'include', // Kirim cookies
        });
        
        const result = await response.json();
        
        // Handle timeout gracefully
        if (response.status === 504) {
          console.warn("Sensor API timeout in RecentOrders, will retry in 30s...");
          return; // Keep last known data
        }
        
        // Handle service unavailable (network error)
        if (response.status === 503) {
          console.warn("Sensor API unavailable in RecentOrders, will retry in 30s...");
          return; // Keep last known data
        }
        
        // Handle server error gracefully
        if (response.status === 500) {
          console.error("Sensor API error 500:", result.message);
          return; // Keep last known data, will auto-retry
        }
        
        if (!response.ok) {
          console.error("Sensor API error:", response.status);
          return; // Keep last known data
        }
        
        if (result.status === "success" && result.data) {
          setSensorData(result.data);
        }
      } catch (err) {
        console.error("Error fetching sensor data:", err);
        // Don't throw, just log and retry in 30s
      } finally {
        setIsLoading(false);
      }
    };

    fetchSensorData();
    
    // Auto-refresh setiap 30 detik
    const interval = setInterval(fetchSensorData, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // Helper function untuk format timestamp
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('id-ID', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).replace(',', '');
  };

  // Helper function untuk determine status
  const getStatus = (param: string, value: number): SensorLog['status'] => {
    switch(param) {
      case "Konduktivitas":
        return value <= 1500 ? "Normal" : "High";
      case "Suhu":
        return "Stable";
      case "Dissolved Oxygen (DO)":
        return value >= 5 ? "Safe" : "Low";
      case "pH":
        return (value >= 6.5 && value <= 8.5) ? "Optimal" : "Warning";
      default:
        return "Normal";
    }
  };

  // Map data dari API ke format tabel
  const tableData: SensorLog[] = sensorData ? [
    {
      id: 1,
      parameter: "Konduktivitas",
      value: sensorData.conductivity_uscm.toFixed(1),
      unit: "µS/cm",
      status: getStatus("Konduktivitas", sensorData.conductivity_uscm),
      icon: "⚡",
      timestamp: formatTimestamp(sensorData.timestamp),
    },
    {
      id: 2,
      parameter: "Suhu",
      value: sensorData.temp_c.toFixed(1),
      unit: "°C",
      status: getStatus("Suhu", sensorData.temp_c),
      icon: "🌡️",
      timestamp: formatTimestamp(sensorData.timestamp),
    },
    {
      id: 3,
      parameter: "Dissolved Oxygen (DO)",
      value: sensorData.do_mgl.toFixed(1),
      unit: "mg/L",
      status: getStatus("Dissolved Oxygen (DO)", sensorData.do_mgl),
      icon: "💨",
      timestamp: formatTimestamp(sensorData.timestamp),
    },
    {
      id: 4,
      parameter: "pH",
      value: sensorData.ph.toFixed(1),
      unit: "",
      status: getStatus("pH", sensorData.ph),
      icon: "🧪",
      timestamp: formatTimestamp(sensorData.timestamp),
    },
  ] : [];

  return (
    //min-h to untuk ngatur tinggi minimal tabel biar ga terlalu kecil
    <div className="w-full min-h-[460px] overflow-hidden rounded-2xl border border-gray-200 bg-white px-6 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Recent Sensor Activity
          </h3>
          <p className="text-gray-500 text-theme-xs">
            Latest parameter readings from water monitoring device
          </p>
        </div>
      </div>

      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
            <TableRow>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Parameter
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Value
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Status
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Timestamp
              </TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {isLoading ? (
              // Loading skeleton
              Array.from({ length: 4 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell className="py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-[40px] w-[40px] rounded-md bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                      <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    </div>
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="h-4 w-28 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  </TableCell>
                </TableRow>
              ))
            ) : tableData.length > 0 ? (
              tableData.map((sensor) => (
                <TableRow key={sensor.id}>
                  <TableCell className="py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-[40px] w-[40px] overflow-hidden rounded-md bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-xl">
                        {sensor.icon}
                      </div>
                      <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {sensor.parameter}
                      </p>
                    </div>
                  </TableCell>

                  <TableCell className="py-3 text-gray-700 dark:text-gray-300">
                    {sensor.value} {sensor.unit}
                  </TableCell>

                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    <Badge
                      size="sm"
                      color={
                        sensor.status === "Normal" ||
                        sensor.status === "Stable" ||
                        sensor.status === "Safe" ||
                        sensor.status === "Optimal"
                          ? "success"
                          : "warning"
                      }
                    >
                      {sensor.status}
                    </Badge>
                  </TableCell>

                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {sensor.timestamp}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell className="py-8 text-center text-gray-500">
                  <div className="col-span-4">Belum ada data sensor</div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
