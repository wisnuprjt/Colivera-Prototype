import type { Metadata } from "next";
import { EcommerceMetrics } from "@/components/ecommerce/EcommerceMetrics";
import React from "react";
import AIDetection from "@/components/ecommerce/AIDetection";
import EColiHistory from "@/components/ecommerce/EColiHistory";
import TotalColiform from "@/components/ecommerce/TotalColiform";
import RecentOrders from "@/components/ecommerce/RecentOrders";
import Lokasi from "@/components/ecommerce/Lokasi";

export const metadata: Metadata = {
  title:
    "Colivera E.coli",
  description: "Monitoring Escherichia coli levels in water sources.",
};

export default function Ecommerce() {
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12 space-y-6 xl:col-span-7">
        <EcommerceMetrics />

        <EColiHistory />
      </div>

      <div className="col-span-12 xl:col-span-5">
        <AIDetection />
      </div>

      <div className="col-span-12">
        <TotalColiform />
      </div>

      <div className="col-span-12 xl:col-span-5">
        <Lokasi />
      </div>

      <div className="col-span-12 xl:col-span-7">
        <RecentOrders />
      </div>
    </div>
  );
}
