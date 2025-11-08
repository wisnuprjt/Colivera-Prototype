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
  // Fetch Data dari HuggingFace via Next.js API
  // ==========================
  useEffect(() => {
    async function fetchPrediction() {
      try {
        console.log("TotalColiformAI: Fetching sensor data...");
        
        // 1. Get sensor data
        const sensorRes = await fetch("/api/sensor", {
          method: 'GET',
          cache: 'no-cache',
          credentials: 'include',
        });
        
        const sensorJson = await sensorRes.json();
        console.log("TotalColiformAI: Sensor response:", sensorJson);

        if (sensorJson.status === "success" && sensorJson.data) {
          // 2. Send to prediction API
          const requestData = {
            temp_c: sensorJson.data.temp_c,
            do_mgl: sensorJson.data.do_mgl,
            ph: sensorJson.data.ph,
            conductivity_uscm: sensorJson.data.conductivity_uscm,
            totalcoliform_mpn_100ml: 0
          };
          
          console.log("TotalColiformAI: Sending to prediction API:", requestData);
          
          const predictionRes = await fetch("/api/predict", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: 'include',
            body: JSON.stringify(requestData),
          });

          const predictionJson = await predictionRes.json();
          console.log("TotalColiformAI: Prediction response:", predictionJson);

          // Response format: { prediction: { total_coliform_mpn_100ml: number } }
          if (predictionJson.prediction && predictionJson.prediction.total_coliform_mpn_100ml !== undefined) {
            // Simpan data terbaru ke dalam array dengan CI bands
            const newPoint: DataPoint = {
              t: new Date().toLocaleTimeString("id-ID", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              }),
              pred: predictionJson.prediction.total_coliform_mpn_100ml,
              low: predictionJson.prediction.ci90_low || 0,
              high: predictionJson.prediction.ci90_high || 0,
            };

            console.log("TotalColiformAI: Adding new data point:", newPoint);

            setData((prev) => {
              // Simpan maksimal 20 data point
              const updated = [...prev, newPoint];
              return updated.slice(-20);
            });
          } else {
            console.warn("TotalColiformAI: Invalid prediction response format", predictionJson);
          }
        } else {
          console.warn("TotalColiformAI: Invalid sensor data format");
        }
      } catch (error) {
        console.error("TotalColiformAI: Error fetching AI Prediction:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchPrediction();

    // Auto-refresh setiap 30 detik (sesuai dengan interval sensor)
    const interval = setInterval(fetchPrediction, 30000);
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
            <div className="text-sm text-gray-500">Latest</div>
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
