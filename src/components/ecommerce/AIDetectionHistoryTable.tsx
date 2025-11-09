"use client";

import { useEffect, useState } from "react";

interface AIPredictionRecord {
  id: number;
  timestamp: string;
  mpn_value: number;
  status: "Aman" | "Waspada" | "Bahaya";
}

export default function AIDetectionHistoryTable() {
  const [data, setData] = useState<AIPredictionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setError(null);
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const res = await fetch(`${apiUrl}/coliform/ai-prediction/history?limit=20`, {
          method: 'GET',
          cache: 'no-cache',
          credentials: 'include',
        });
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const json = await res.json();
        
        if (json.status === "success") {
          setData(json.data);
          console.log("✅ AI Prediction history loaded:", json.count, "records");
        } else {
          throw new Error(json.message || "Failed to fetch data");
        }
      } catch (error: any) {
        console.error("❌ Error fetching AI prediction history:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();

    // Auto-refresh setiap 1 menit (60000ms)
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  // Helper function untuk styling status badge
  const getStatusBadge = (status: string) => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1";
    
    if (status === "Aman") {
      return (
        <span className={`${baseClasses} bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400`}>
          <span className="size-2 rounded-full bg-green-500"></span>
          Aman
        </span>
      );
    } else if (status === "Waspada") {
      return (
        <span className={`${baseClasses} bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400`}>
          <span className="size-2 rounded-full bg-yellow-500"></span>
          Waspada
        </span>
      );
    } else {
      return (
        <span className={`${baseClasses} bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400`}>
          <span className="size-2 rounded-full bg-red-500"></span>
          Bahaya
        </span>
      );
    }
  };

  // Format timestamp
  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mt-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
          📋 Keterangan & Log Prediksi
        </h3>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <span className="ml-3 text-gray-600 dark:text-gray-400">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mt-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
          📋 Keterangan & Log Prediksi
        </h3>
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-800 dark:text-red-400">❌ Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mt-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          📋 Keterangan & Log Prediksi
        </h3>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          Auto-refresh setiap 1 menit
        </span>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Timestamp
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                MPN Value (MPN/100ml)
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {data.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-3xl">📭</span>
                    <span>Belum ada data AI prediction</span>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {formatTimestamp(record.timestamp)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono font-semibold text-gray-900 dark:text-gray-100">
                    {record.mpn_value.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {getStatusBadge(record.status)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      <div className="mt-4 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <span>Menampilkan {data.length} data terakhir</span>
        <span className="flex items-center gap-1">
          <span className="inline-block size-2 rounded-full bg-green-500 animate-pulse"></span>
          Live
        </span>
      </div>
    </div>
  );
}
