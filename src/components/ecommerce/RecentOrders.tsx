"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import Image from "next/image";

// struktur dummy
interface SensorLog {
  id: number;
  parameter: string;
  value: string;
  unit: string;
  status: "Normal" | "Stable" | "Safe" | "Optimal";
  icon: string;
  timestamp: string;
}

export default function RecentSensorActivity() {
  const sensorData: SensorLog[] = [
    {
      id: 1,
      parameter: "Konduktivitas",
      value: "620",
      unit: "µS/cm",
      status: "Normal",
      icon: "⚡",
      timestamp: "2025-10-26 18:30",
    },
    {
      id: 2,
      parameter: "Suhu",
      value: "27.8",
      unit: "°C",
      status: "Stable",
      icon: "🌡️",
      timestamp: "2025-10-26 18:30",
    },
    {
      id: 3,
      parameter: "Dissolved Oxygen (DO)",
      value: "6.2",
      unit: "mg/L",
      status: "Safe",
      icon: "💨",
      timestamp: "2025-10-26 18:30",
    },
    {
      id: 4,
      parameter: "pH",
      value: "7.2",
      unit: "",
      status: "Optimal",
      icon: "🧪",
      timestamp: "2025-10-26 18:30",
    },
  ];

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
            {sensorData.map((sensor) => (
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
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
