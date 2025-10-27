"use client";
import Typewriter from "typewriter-effect";
import React, { useEffect, useState } from "react";

export default function TypewriterText() {
  const [mounted, setMounted] = useState(false);

  // pastikan hanya render di client
  useEffect(() => setMounted(true), []);

  if (!mounted) return null; // hindari error hydration SSR

  return (
    <Typewriter
      options={{
        loop: true,
        delay: 40,
        deleteSpeed: 25,
        strings: [
          "💧 Bakteri E. coli dapat hidup di air tercemar limbah.",
          "🧫 COLIVERA mendeteksi E. coli hanya dalam hitungan detik.",
          "🌊 Pantau kualitas air Anda secara real-time dan akurat.",
          "📊 Data sensor langsung dikirim ke dashboard web COLIVERA.",
        ],
      }}
    />
  );
}
