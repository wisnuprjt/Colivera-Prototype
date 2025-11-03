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

interface SensorData {
  timestamp: string;
  temp_c: number;
  do_mgl: number;
  ph: number;
  conductivity_uscm: number;
  totalcoliform_mv: number;
}

interface AIDetectionProps {
  hideDropdown?: boolean;
}

export default function AIDetection({ hideDropdown = false }: AIDetectionProps) {
  const router = useRouter();
  const [prediction, setPrediction] = useState(100);
  const [status, setStatus] = useState<"AMAN" | "BAHAYA">("AMAN");
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchAndPredict = async () => {
      setIsLoading(true);
      
      try {
        // 1. Fetch latest sensor data menggunakan Next.js API route
        const sensorResponse = await fetch("/api/sensor", {
          method: 'GET',
          cache: 'no-cache',
        });
        
        if (!sensorResponse.ok) {
          throw new Error(`Failed to fetch sensor data: ${sensorResponse.status}`);
        }
        
        const sensorResult = await sensorResponse.json();
        
        if (sensorResult.status === "no_data") {
          console.log("No sensor data available yet, will retry in 30s...");
          setIsLoading(false);
          return;
        }
        
        if (sensorResult.status === "error") {
          console.error("API Error:", sensorResult.message);
          setIsLoading(false);
          return;
        }
        
        if (sensorResult.status !== "success" || !sensorResult.data) {
          throw new Error("Invalid sensor data format");
        }
        
        const sensorData: SensorData = sensorResult.data;
        
        // 2. Send to prediction API menggunakan Next.js API route
        const requestData = {
          temp_c: sensorData.temp_c,
          do_mgl: sensorData.do_mgl,
          ph: sensorData.ph,
          conductivity_uscm: sensorData.conductivity_uscm,
          totalcoliform_mpn_100ml: 0
        };

        console.log("Predicting with data:", requestData);

        const predictionResponse = await fetch("/api/predict", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        });

        if (!predictionResponse.ok) {
          throw new Error("Prediction API error");
        }

        const result = await predictionResponse.json();
        console.log("AI Response:", result);

        const potable = result.ai_detection?.potable ?? true;
        
        let newPrediction = 0;
        let newStatus: "AMAN" | "BAHAYA" = "BAHAYA";
        
        if (potable) {
          newPrediction = 100;
          newStatus = "AMAN";
        } else {
          newPrediction = 30;
          newStatus = "BAHAYA";
        }

        setPrediction(newPrediction);
        setStatus(newStatus);

      } catch (err) {
        console.error("Error in AI Detection:", err);
        
        // Handle specific error types
        if (err instanceof Error) {
          if (err.name === 'AbortError') {
            console.error("Request timeout - API took too long to respond");
          } else if (err.message.includes('fetch')) {
            console.error("Network error - check your internet connection or CORS settings");
          }
        }
        
        // Keep showing last known status or default to AMAN during errors
        // Don't reset to prevent flickering
      } finally {
        setIsLoading(false);
      }
    };

    fetchAndPredict();
    
    // Auto-refresh setiap 30 detik
    const interval = setInterval(fetchAndPredict, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const series = [prediction];
  
  const getStatusColor = () => {
    if (status === "AMAN") return "success";
    return "danger";
  };
  
  const statusColor = getStatusColor();
  
  const options: ApexOptions = {
    colors: [statusColor === "success" ? "#10B981" : "#EF4444"],
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
      colors: [statusColor === "success" ? "#10B981" : "#EF4444"],
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

              <span className={`absolute left-1/2 top-full -translate-x-1/2 -translate-y-[95%] rounded-full px-3 py-1 text-xs font-medium ${
                statusColor === "success" 
                  ? "bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-500"
                  : "bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-500"
              }`}>
                {status}
              </span>
            </>
          )}
        </div>
        
        <p className="mx-auto mt-10 w-full max-w-[380px] text-center text-sm text-gray-500 sm:text-base">
          Status hasil analisis AI terhadap sampel air. AI memprediksi apakah kadar E.coli berada pada batas aman atau melebihi ambang batas yang membahayakan.
        </p>
      </div>

      <div className="flex items-center justify-center px-6 py-4">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
          ©Colivera 2025
        </p>
      </div>
    </div>
  );
}
