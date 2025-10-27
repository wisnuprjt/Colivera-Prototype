"use client";
import React, { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { MoreDotIcon } from "@/icons";
import { useRouter } from "next/navigation";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

// DataPoint = hasil mapping dari DB backend
interface DataPoint {
  time: string;
  cfu: number;
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000/api";

export default function TotalColiformMPN() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<DataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const toggleDropdown = () => setIsOpen(!isOpen);
  const closeDropdown = () => setIsOpen(false);

  // ==========================
  // Fetch Data dari Backend
  // ==========================
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`${API_BASE}/coliform/latest`);
        const json = await res.json();

        // mapping data dari backend ke chart format
        const mapped: DataPoint[] = json.data.map((d: any) => ({
          time: new Date(d.timestamp).toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }),
          cfu: d.mpn_value,
        }));

        setData(mapped.reverse()); // agar urut dari lama → terbaru
      } catch (error) {
        console.error("Error fetching Total Coliform:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();

    // optional auto-refresh tiap 10 detik
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  // ==========================
  // Data untuk chart
  // ==========================
  const categories = useMemo(() => data.map((d) => d.time), [data]);
  const series = useMemo(
    () => [
      {
        name: "MPN",
        data: data.map((d) => d.cfu),
      },
    ],
    [data]
  );

  const latest = data.length > 0 ? data[data.length - 1] : null;

  // ==========================
  // Konfigurasi Chart Apex
  // ==========================
  const options: ApexOptions = {
    colors: ["#465FFF"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      height: 250,
      type: "line",
      toolbar: { show: false },
      animations: { enabled: true },
    },
    stroke: { curve: "smooth", width: 3 },
    markers: {
      size: 3,
      strokeColors: "#fff",
      strokeWidth: 2,
      hover: { size: 6 },
    },
    grid: { xaxis: { lines: { show: false } }, yaxis: { lines: { show: true } } },
    dataLabels: { enabled: false },
    tooltip: {
      enabled: true,
      x: { show: true },
      y: { formatter: (v: number) => `${v} MPN` },
    },
    xaxis: {
      type: "category",
      categories,
      labels: { style: { fontSize: "12px", colors: ["#6B7280"] } },
    },
    yaxis: {
      min: 0,
      labels: { style: { fontSize: "12px", colors: ["#6B7280"] } },
      tickAmount: 6,
    },
    legend: { show: false },
  };

  // ==========================
  // Render UI
  // ==========================
  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex flex-col gap-4 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Total Coliform
          </h3>
          <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">(MPN)</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-sm text-gray-500">Latest</div>
            <div className="text-xl font-bold text-gray-800 dark:text-white/90">
              {latest ? `${latest.cfu} MPN` : loading ? "Loading..." : "-"}
            </div>
            <div className="text-xs text-gray-400">
              {latest ? latest.time : "No data"}
            </div>
          </div>

          <div className="relative inline-block">
            <button onClick={toggleDropdown} className="dropdown-toggle">
              <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" />
            </button>
            <Dropdown isOpen={isOpen} onClose={closeDropdown} className="w-40 p-2">
              <DropdownItem
                onItemClick={() => {
                  closeDropdown();
                  router.push("/dashboard/ecoliview");
                }}
                className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
              >
                View More
              </DropdownItem>
            </Dropdown>
          </div>
        </div>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="min-w-[1000px] xl:min-w-full">
          {loading ? (
            <div className="text-gray-400 text-center py-10">Loading...</div>
          ) : data.length === 0 ? (
            <div className="text-gray-400 text-center py-10">No data available</div>
          ) : (
            <ReactApexChart
              options={options}
              series={series}
              type="line"
              height={250}
            />
          )}
        </div>
      </div>
    </div>
  );
}
