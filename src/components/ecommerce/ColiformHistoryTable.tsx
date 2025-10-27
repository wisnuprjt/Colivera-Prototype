"use client";
import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { DownloadIcon } from "lucide-react"; // ✅ pastikan lucide-react sudah terinstall

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000/api";

interface ColiformData {
  id: number;
  sensor_id: string;
  mpn_value: number;
  raw_voltage: number;
  timestamp: string;
  status: string;
}

export default function ColiformHistoryTable() {
  const [data, setData] = useState<ColiformData[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  // ===============================
  // Fetch data dari backend
  // ===============================
  useEffect(() => {
    async function fetchHistory() {
      try {
        const res = await fetch(`${API_BASE}/coliform/latest`);
        const json = await res.json();
        setData(json.data || []);
      } catch (err) {
        console.error("Error fetching coliform history:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchHistory();
  }, []);

  // ===============================
  // Fungsi Export ke Excel
  // ===============================
  const exportToExcel = () => {
    if (data.length === 0) {
      alert("Tidak ada data untuk diexport!");
      return;
    }

    setDownloading(true);

    // Map data agar rapi di Excel
    const exportData = data.map((item) => ({
      Timestamp: new Date(item.timestamp).toLocaleString("id-ID"),
      "Sensor ID": item.sensor_id,
      "Tegangan (V)": item.raw_voltage,
      "Total Coliform (MPN)": item.mpn_value,
      Status: item.status,
    }));

    // Buat workbook & worksheet
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Total Coliform");

    // Buat file Excel dan simpan
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const fileName = `TotalColiform_${new Date()
      .toLocaleString("id-ID")
      .replace(/[/:]/g, "-")}.xlsx`;

    saveAs(blob, fileName);

    // Delay kecil biar animasi "Downloading..." keliatan
    setTimeout(() => setDownloading(false), 800);
  };

  return (
    <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] shadow-sm">
      {/* Header + Tombol Export */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Riwayat Pembacaan Terakhir
        </h2>

        <button
          onClick={exportToExcel}
          disabled={downloading}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg text-white transition-all duration-200 
            ${
              downloading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-sm hover:shadow-md"
            }`}
        >
          <DownloadIcon className="w-4 h-4" />
          {downloading ? "Mengunduh..." : "Export Excel"}
        </button>
      </div>

      {/* Isi Tabel */}
      {loading ? (
        <p className="text-gray-400 text-sm">Loading...</p>
      ) : data.length === 0 ? (
        <p className="text-gray-400 text-sm">Belum ada data pembacaan.</p>
      ) : (
        <div className="overflow-x-auto custom-scrollbar">
          <table className="min-w-full text-sm text-gray-600 dark:text-gray-300">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-white/[0.05]">
                <th className="py-2 px-3 text-left">Timestamp</th>
                <th className="py-2 px-3 text-left">Sensor ID</th>
                <th className="py-2 px-3 text-left">Tegangan (V)</th>
                <th className="py-2 px-3 text-left">MPN</th>
                <th className="py-2 px-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50/50 dark:hover:bg-white/[0.02]"
                >
                  <td className="py-2 px-3">
                    {new Date(item.timestamp).toLocaleString("id-ID", {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  </td>
                  <td className="py-2 px-3">{item.sensor_id}</td>
                  <td className="py-2 px-3">{item.raw_voltage ?? "-"} V</td>
                  <td className="py-2 px-3 font-medium">{item.mpn_value}</td>
                  <td
                    className={`py-2 px-3 ${
                      item.status === "Critical"
                        ? "text-red-500"
                        : item.status === "Warning"
                        ? "text-yellow-500"
                        : "text-green-600"
                    } font-medium`}
                  >
                    {item.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
