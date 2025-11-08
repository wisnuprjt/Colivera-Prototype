import Link from "next/link";
import AIDetection from "@/components/ecommerce/AIDetection";
import TotalColiformAI from "@/components/ecommerce/TotalColiformAI";
import { ArrowLeftIcon } from "lucide-react";

export const metadata = { title: "AI Detection View • Colivera" };

export default function AIDetectionViewPage() {
  return (
    <div className="space-y-6">
      {/* Back Button */}
      <div className="px-4 sm:px-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-[#4F7C82] dark:text-gray-400 dark:hover:text-[#4F7C82] transition-colors"
        >
          <ArrowLeftIcon className="size-4" />
          Back to Dashboard
        </Link>
      </div>

      {/* Main Content */}
      <div className="px-4 sm:px-6">
        {/* Hero Section - AI Detection Status */}
        <div className="mb-8">
          <div className="mb-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              AI Water Quality Detection
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Real-time AI analysis of water quality based on sensor parameters
            </p>
          </div>
          
          {/* AI Detection - Full Width untuk lebih prominent */}
          <AIDetection hideDropdown={true} />
        </div>

        {/* Grid Layout - Prediction Chart & Info */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Total Coliform AI Chart & Table - Takes 2 columns */}
          <div className="xl:col-span-2 space-y-6">
            <TotalColiformAI hideDropdown={true} />
            
            {/* Keterangan & Log Prediksi Table */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <span className="text-xl">📋</span>
                Keterangan & Log Prediksi
              </h2>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-gray-200 dark:border-gray-700">
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {/* Table rows will be populated from backend/database */}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Keterangan & Info Panel - Takes 1 column */}
          <div className="space-y-6">
            {/* Threshold Info */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <span className="text-xl">📊</span>
                Threshold Information
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Safe (Aman)</span>
                  <span className="font-semibold text-green-600 dark:text-green-400">≤ 0.70 MPN</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Warning (Waspada)</span>
                  <span className="font-semibold text-amber-600 dark:text-amber-400">0.71 - 0.99 MPN</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Danger (Bahaya)</span>
                  <span className="font-semibold text-red-600 dark:text-red-400">≥ 1.0 MPN</span>
                </div>
              </div>
            </div>

            {/* Model Info */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <span className="text-xl">🤖</span>
                About AI Model
              </h3>
              <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                <p>
                  Model AI menganalisis 4 parameter fisiko-kimia air untuk memprediksi tingkat Total Coliform.
                </p>
                <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
                  <p className="font-medium text-gray-700 dark:text-gray-300 mb-2">Parameters:</p>
                  <ul className="space-y-1 ml-4 list-disc">
                    <li>Temperature (°C)</li>
                    <li>Dissolved Oxygen (mg/L)</li>
                    <li>pH Level</li>
                    <li>Conductivity (µS/cm)</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 dark:border-amber-800/50 dark:bg-amber-900/10">
              <h3 className="text-sm font-semibold text-amber-800 dark:text-amber-400 mb-2 flex items-center gap-2">
                <span>⚠️</span>
                Important Note
              </h3>
              <p className="text-xs text-amber-700 dark:text-amber-500">
                Prediksi AI adalah estimasi berdasarkan parameter fisiko-kimia, bukan hasil uji laboratorium. 
                Untuk keputusan kritis, selalu lakukan pengujian laboratorium resmi.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


