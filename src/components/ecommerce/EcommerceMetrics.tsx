"use client";
import React from "react";
import {
  WavesIcon,
  ThermometerIcon,
  DropletsIcon,
  BeakerIcon,
} from "lucide-react";

export const EcommerceMetrics = () => {
  const cards = [
    {
      title: "Konduktivitas",
      value: "620 µS/cm",
      color: "bg-sky-100 text-sky-700 dark:bg-sky-800 dark:text-sky-200",
      icon: <WavesIcon className="size-6" />,
      badge: { text: "Normal", color: "success" },
    },
    {
      title: "Suhu",
      value: "27.8 °C",
      color: "bg-orange-100 text-orange-700 dark:bg-orange-800 dark:text-orange-200",
      icon: <ThermometerIcon className="size-6" />,
      badge: { text: "Stabil", color: "success" },
    },
    {
      title: "Dissolved Oxygen (DO)",
      value: "6.2 mg/L",
      color: "bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-200",
      icon: <DropletsIcon className="size-6" />,
      badge: { text: "Aman", color: "success" },
    },
    {
      title: "pH",
      value: "7.2",
      color: "bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-200",
      icon: <BeakerIcon className="size-6" />,
      badge: { text: "Optimal", color: "success" },
    },
  ];

  const Badge = ({ text, color }: { text: string; color: string }) => (
    <div
      className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${
        color === "success"
          ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200"
          : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200"
      }`}
    >
      ● {text}
    </div>
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
      {cards.map((card, index) => (
        <div
          key={index}
          className="rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 dark:from-[#1a1a1a] dark:to-[#222] dark:border-gray-800 p-6 shadow-sm hover:shadow-md transition-all duration-200"
        >
          <div
            className={`flex items-center justify-center w-12 h-12 rounded-xl ${card.color}`}
          >
            {card.icon}
          </div>

          <div className="flex items-end justify-between mt-5">
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {card.title}
              </span>
              <h4 className="mt-2 font-extrabold text-gray-800 text-2xl dark:text-white/90 transition-all">
                {card.value}
              </h4>
            </div>
            <Badge text={card.badge.text} color={card.badge.color} />
          </div>
        </div>
      ))}
    </div>
  );
};
