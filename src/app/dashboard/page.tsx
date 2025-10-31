import type { Metadata } from "next";
import { EcommerceMetrics } from "@/components/ecommerce/EcommerceMetrics";
import React from "react";
import AIDetection from "@/components/ecommerce/AIDetection";
import EColiHistory from "@/components/ecommerce/TotalColiformMPN";
// import TotalColiform from "@/components/ecommerce/TotalColiform";
import RecentOrders from "@/components/ecommerce/RecentOrders";
import Lokasi from "@/components/ecommerce/Lokasi";

export const metadata: Metadata = {
  title:
    "Colivera E.coli",
  description: "Monitoring Escherichia coli levels in water sources.",
};

export default function Ecommerce() {
  return (
    <div className="space-y-6">
      {/* Metrics Cards - Full Width */}
      <div className="w-full">
        <EcommerceMetrics />
      </div>

      {/* Main Content - 2 Columns */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Left Column */}
        <div className="space-y-6">
          <EColiHistory />
          <RecentOrders />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <AIDetection />
          <Lokasi />
        </div>
      </div>
    </div>
  );
}
