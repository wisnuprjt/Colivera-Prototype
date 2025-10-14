"use client";

import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { MoreDotIcon } from "@/icons";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { useState } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { useRouter } from "next/navigation";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export default function EColiChart() {
  const router = useRouter();
  
  // Data dummy mengikuti pola pada screenshot (jam 15:46—16:00)
  // Format datetime: gunakan .getTime() (epoch ms) agar xaxis: "datetime" bekerja mulus
  const points: { x: number; y: number }[] = [
    ["2024-10-26T15:46:00"],
    ["2024-10-26T15:47:00"],
    ["2024-10-26T15:48:00"],
    ["2024-10-26T15:49:00"],
    ["2024-10-26T15:50:00"],
    ["2024-10-26T15:51:00"],
  ]
    .map(([t]) => ({ x: new Date(t).getTime(), y: 0 }))
    .concat([
      { x: new Date("2024-10-26T15:52:00").getTime(), y: 17 },
      { x: new Date("2024-10-26T15:53:00").getTime(), y: 15 },
      { x: new Date("2024-10-26T15:54:00").getTime(), y: 13 },
      { x: new Date("2024-10-26T15:55:00").getTime(), y: 13 },
      { x: new Date("2024-10-26T15:56:00").getTime(), y: 13 },
      { x: new Date("2024-10-26T15:57:00").getTime(), y: 5 },
      { x: new Date("2024-10-26T15:58:00").getTime(), y: 3 },
      { x: new Date("2024-10-26T15:59:00").getTime(), y: 0 },
      { x: new Date("2024-10-26T16:00:00").getTime(), y: 0 },
    ]);

  const options: ApexOptions = {
    colors: ["#465fff"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "line",
      height: 220,
      toolbar: { show: false },
      animations: { enabled: true },
    },
    stroke: { width: 3, curve: "smooth" },
    dataLabels: { enabled: false },
    markers: { size: 3 },
    grid: {
      yaxis: { lines: { show: true } },
      xaxis: { lines: { show: false } },
    },
    xaxis: {
      type: "datetime",
      labels: { datetimeUTC: false, format: "HH:mm" },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      min: 0,
      // sesuaikan dengan rentang data kamu; 18 supaya mirip screenshot
      max: 18,
      tickAmount: 6,
      title: { text: "CFU" },
    },
    tooltip: {
      x: { format: "HH:mm" },
      y: { formatter: (val: number) => `${val} CFU` },
    },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
      fontFamily: "Outfit",
    },
  };

  const series = [
    {
      name: "E.Coli",
      data: points,
    },
  ];

  const [isOpen, setIsOpen] = useState(false);
  const toggleDropdown = () => setIsOpen(!isOpen);
  const closeDropdown = () => setIsOpen(false);

  const handleViewMore = () => {
    closeDropdown();
    router.push("/dashboard/ecoliview"); // Ganti dengan alur yang kita mau
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          E.Coli History (CFU)
        </h3>

        <div className="relative inline-block">
          <button onClick={toggleDropdown} className="dropdown-toggle">
            <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" />
          </button>
          <Dropdown isOpen={isOpen} onClose={closeDropdown} className="w-40 p-2">
            <DropdownItem
              onItemClick={handleViewMore}
              className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              View More
            </DropdownItem>
          </Dropdown>
        </div>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="-ml-5 min-w-[650px] xl:min-w-full pl-2">
          <ReactApexChart options={options} series={series} type="line" height={220} />
        </div>
      </div>
    </div>
  );
}
