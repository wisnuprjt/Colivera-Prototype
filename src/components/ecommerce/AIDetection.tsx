"use client";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { MoreDotIcon } from "@/icons";
import { useState, useEffect } from "react";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { useRouter } from "next/navigation";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

interface AIDetectionData {
  mpn_value: number;
  status: "Aman" | "Waspada" | "Bahaya";
  severity: string;
  reasons: string[];
  recommendations: string[];
  alternative_use: string[];
}

interface AIDetectionProps {
  hideDropdown?: boolean;
}

export default function AIDetection({ hideDropdown = false }: AIDetectionProps) {
  const router = useRouter();
  const [mpnValue, setMpnValue] = useState<number>(0);
  const [status, setStatus] = useState<"Aman" | "Waspada" | "Bahaya">("Aman");
  const [reasons, setReasons] = useState<string[]>([]);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchAIDetection = async () => {
      setIsLoading(true);
      
      try {
        // Fetch AI Detection data dari backend (includes predictions & recommendations)
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
        const response = await fetch(`${apiUrl}/api/sensor/ai-detection`, {
          method: 'GET',
          cache: 'no-cache',
          credentials: 'include',
        });
        
        const result = await response.json();
        
        // Handle timeout
        if (response.status === 504) {
          console.warn("AI Detection API timeout, will retry in 30s...");
          setIsLoading(false);
          return;
        }
        
        // Handle service unavailable
        if (response.status === 503) {
          console.warn("Service unavailable, will retry in 30s...");
          setIsLoading(false);
          return;
        }
        
        // Handle server error
        if (response.status === 500) {
          console.error("AI Detection API error 500:", result.message);
          setIsLoading(false);
          return;
        }
        
        if (!response.ok) {
          console.error("Failed to fetch AI detection:", response.status);
          setIsLoading(false);
          return;
        }
        
        if (result.status === "no_data") {
          console.log("No sensor data available for AI detection yet");
          setIsLoading(false);
          return;
        }
        
        if (result.status === "error") {
          console.error("API Error:", result.message);
          setIsLoading(false);
          return;
        }
        
        if (result.status !== "success" || !result.data) {
          console.error("Invalid AI detection data format");
          setIsLoading(false);
          return;
        }
        
        const aiData: AIDetectionData = result.data;
        
        // Update state dengan data dari API
        setMpnValue(aiData.mpn_value);
        setStatus(aiData.status);
        setReasons(aiData.reasons || []);
        setRecommendations(aiData.recommendations || []);

        console.log("AI Detection updated:", aiData);

      } catch (err) {
        console.error("Error fetching AI Detection:", err);
        
        if (err instanceof Error) {
          if (err.name === 'AbortError') {
            console.error("Request timeout");
          } else if (err.message.includes('fetch')) {
            console.error("Network error");
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchAIDetection();
  }, []);

  const series = [100]; // Always full circle
  
  const getStatusColor = () => {
    if (status === "Aman") return "#10B981"; // Green
    if (status === "Waspada") return "#F59E0B"; // Amber/Yellow
    return "#EF4444"; // Red (Bahaya)
  };
  
  const chartColor = getStatusColor();
  
  const options: ApexOptions = {
    colors: [chartColor],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "radialBar",
      height: 330,
      sparkline: {
        enabled: true,
      },
    },
    plotOptions: {
      radialBar: {
        startAngle: -85,
        endAngle: 85,
        hollow: {
          size: "80%",
        },
        track: {
          background: "#E4E7EC",
          strokeWidth: "100%",
          margin: 5,
        },
        dataLabels: {
          name: {
            show: false,
          },
          value: {
            fontSize: "36px",
            fontWeight: "600",
            offsetY: -40,
            color: "#1D2939",
            formatter: function () {
              return ""; // Tidak tampilkan persentase
            },
          },
        },
      },
    },
    fill: {
      type: "solid",
      colors: [chartColor],
    },
    stroke: {
      lineCap: "round",
    },
    labels: ["Progress"],
  };

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  function handleViewMore() {
    closeDropdown();
    router.push("/dashboard/aidetectionview"); // Ganti dengan alur yang kita mau
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="px-5 pt-5 bg-white shadow-default rounded-2xl pb-11 dark:bg-gray-900 sm:px-6 sm:pt-6">
        <div className="flex justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              AI Detection
            </h3>
            <p className="mt-1 font-normal text-gray-500 text-theme-sm dark:text-gray-400">
              Status hasil analisis AI
            </p>
          </div>
          {!hideDropdown && (
            <div className="relative inline-block">
              <button onClick={toggleDropdown} className="dropdown-toggle">
                <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" />
              </button>
              <Dropdown
                isOpen={isOpen}
                onClose={closeDropdown}
                className="w-40 p-2"
              >
                <DropdownItem
                  tag="button"
                  onItemClick={handleViewMore}
                  className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                >
                  View More
                </DropdownItem>
              </Dropdown>
            </div>
          )}
        </div>
        
        <div className="relative">
          {isLoading ? (
            <div className="flex items-center justify-center" style={{ height: '330px' }}>
              <div className="flex flex-col items-center gap-4">
                <div className="size-12 border-4 border-[#4F7C82] border-t-transparent rounded-full animate-spin"></div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Menganalisis...</p>
              </div>
            </div>
          ) : (
            <>
              <div className="max-h-[330px]">
                <ReactApexChart
                  options={options}
                  series={series}
                  type="radialBar"
                  height={400}
                />
              </div>

              <span className={`absolute left-1/2 top-full -translate-x-1/2 -translate-y-[95%] rounded-full px-3 py-1 text-xs font-medium uppercase ${
                status === "Aman" 
                  ? "bg-green-50 text-green-600 dark:bg-green-500/15 dark:text-green-500"
                  : status === "Waspada"
                  ? "bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-amber-500"
                  : "bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-500"
              }`}>
                {status}
              </span>
            </>
          )}
        </div>
        
        {/* Alasan/Temuan */}
        {reasons.length > 0 && (
          <div className="mx-auto mt-6 w-full max-w-[380px]">
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Alasan/Temuan
            </h4>
            <ul className="list-none text-sm text-gray-600 dark:text-gray-400 space-y-2">
              {reasons.map((reason, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-amber-500 mt-0.5">•</span>
                  <span className="flex-1">{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Rekomendasi */}
        {recommendations.length > 0 && (
          <div className="mx-auto mt-4 w-full max-w-[380px]">
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Rekomendasi
            </h4>
            <ul className="list-none text-sm text-gray-600 dark:text-gray-400 space-y-2">
              {recommendations.map((rec, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">✓</span>
                  <span className="flex-1">{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="flex items-center justify-center px-6 py-4">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
          ©Colivera 2025
        </p>
      </div>
    </div>
  );
}
