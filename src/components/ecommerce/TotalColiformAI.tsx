"use client";
import React, { useState, useEffect, useMemo } from "react";
import {
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { MoreDotIcon } from "@/icons";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axios";

// DataPoint untuk AI Prediction dengan CI bands
interface DataPoint {
  t: string;         // time
  pred: number;      // prediction
  low: number;       // CI 90% low
  high: number;      // CI 90% high
}

interface TotalColiformAIProps {
  hideDropdown?: boolean;
}

export default function TotalColiformAI({ hideDropdown = false }: TotalColiformAIProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<DataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const toggleDropdown = () => setIsOpen(!isOpen);
  const closeDropdown = () => setIsOpen(false);

  // ==========================
  // Fetch Data History dari Database (via Backend)
  // Filter: source=ai_prediction untuk data AI prediction saja
  // ==========================
  useEffect(() => {
    async function fetchData() {
      try {
        console.log("🔄 Fetching AI prediction history from backend...");
        
        // ✨ Fetch history dari backend dengan filter source=ai_prediction
        const res = await axiosInstance.get('/api/sensor/coliform/history', {
          params: { source: 'ai_prediction', limit: 20 }
        });
        
        console.log("📡 Response status:", res.status);
        
        const json: any = res.data;
        console.log("📊 Backend response:", json);

        if (json.status === "success" && json.chartData) {
          console.log("✅ Data received:", json.chartData.length, "records");
          
          // Backend sudah return data dalam urutan lama → baru di chartData
          // Mapping untuk chart dengan CI bands (set ke 0 karena data history tidak punya CI)
          const mappedData: DataPoint[] = json.chartData.map((item: any) => ({
            t: new Date(item.timestamp).toLocaleTimeString("id-ID", {
              hour: "2-digit",
              minute: "2-digit",
            }),
            pred: item.mpn_value,
            low: 0,  // CI bands tidak tersedia di history
            high: 0
          }));

          console.log("🎨 Mapped data for chart:", mappedData);
          setData(mappedData);
          console.log("✅ AI Prediction (History) data loaded:", mappedData.length, "points");
        } else {
          console.warn("⚠️ No data in response or status not success");
        }
      } catch (error) {
        console.error("❌ Error fetching Total Coliform (AI Prediction) History:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();

    // Auto-refresh setiap 1 menit (sesuai dengan cron job interval)
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  // ==========================
  // Data untuk chart
  // ==========================
  const latest = data.length > 0 ? data[data.length - 1] : null;

  // Format number helper
  const fmt = new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 });

  // ==========================
  // Render UI
  // ==========================
  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex flex-col gap-4 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Total Coliform (AI Prediction)
          </h3>
          <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
            (MPN/100ml)
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-sm text-gray-500">Data Terbaru</div>
            <div className="text-xl font-bold text-gray-800 dark:text-white/90">
              {latest ? `${fmt.format(latest.pred)} MPN` : loading ? "Loading..." : "-"}
            </div>
            <div className="text-xs text-gray-400">
              {latest ? latest.t : "No data"}
            </div>
          </div>

          {!hideDropdown && (
            <div className="relative inline-block">
              <button onClick={toggleDropdown} className="dropdown-toggle">
                <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" />
              </button>
              <Dropdown isOpen={isOpen} onClose={closeDropdown} className="w-40 p-2">
                <DropdownItem
                  onItemClick={() => {
                    closeDropdown();
                    router.push("/dashboard/aidetectionview");
                  }}
                  className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                >
                  View More
                </DropdownItem>
              </Dropdown>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="min-w-[1000px] xl:min-w-full">
          {loading ? (
            <div className="text-gray-400 text-center py-10">Loading...</div>
          ) : data.length === 0 ? (
            <div className="text-gray-400 text-center py-10">No data available</div>
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 20, bottom: 0, left: 0 }}>
                  <defs>
                    <linearGradient id="aiPredGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="t" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip 
                    formatter={(value: any) => `${fmt.format(value)} MPN/100ml`}
                    labelStyle={{ color: '#374151' }}
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px',
                      padding: '8px'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="pred" 
                    stroke="#10B981" 
                    fill="url(#aiPredGradient)" 
                    strokeWidth={2} 
                  />
                  {/* CI bands as dashed lines */}
                  <Line 
                    type="monotone" 
                    dataKey="low" 
                    stroke="#9ca3af" 
                    dot={false} 
                    strokeDasharray="4 4" 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="high" 
                    stroke="#9ca3af" 
                    dot={false} 
                    strokeDasharray="4 4" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
