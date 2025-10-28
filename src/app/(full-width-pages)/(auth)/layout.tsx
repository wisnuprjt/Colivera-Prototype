"use client";
import { ThemeProvider } from "@/context/ThemeContext";
import Image from "next/image";
import React, { useEffect, useRef } from "react";
import TypewriterText from "@/components/common/TypewriterText";

/* ===== Komponen: Realistic Wave Background ===== */
function AnimatedWaves() {
  const waveRef1 = useRef<SVGPathElement | null>(null);
  const waveRef2 = useRef<SVGPathElement | null>(null);
  const tRef = useRef(0);

  useEffect(() => {
    let animationFrameId: number;
    const animate = () => {
      tRef.current += 0.015;
      const t = tRef.current;
      const s = Math.sin;

      const d1 = `
        M0,240
        Q120,${230 + 15 * s(t + 0.5)}
        240,${240 + 15 * s(t + 1)}
        T480,${235 + 15 * s(t + 2)}
        T720,${240 + 15 * s(t + 3)}
        T960,${230 + 15 * s(t + 4)}
        T1200,${235 + 15 * s(t + 5)}
        T1440,${240 + 15 * s(t + 6)}
        V320H0Z
      `;

      const d2 = `
        M0,250
        Q120,${255 + 10 * s(t + 1)}
        240,${250 + 10 * s(t + 2)}
        T480,${255 + 10 * s(t + 3)}
        T720,${250 + 10 * s(t + 4)}
        T960,${255 + 10 * s(t + 5)}
        T1200,${250 + 10 * s(t + 6)}
        T1440,${255 + 10 * s(t + 7)}
        V320H0Z
      `;

      if (waveRef1.current) waveRef1.current.setAttribute("d", d1);
      if (waveRef2.current) waveRef2.current.setAttribute("d", d2);
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1440 320"
      preserveAspectRatio="none"
      className="absolute bottom-0 left-0 w-full h-40 opacity-70"
    >
      <path ref={waveRef2} fill="#5eead4" fillOpacity="0.25" />
      <path ref={waveRef1} fill="#2dd4bf" fillOpacity="0.4" />
    </svg>
  );
}

/* ===== Layout Halaman Login ===== */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <div className="relative min-h-screen flex flex-col lg:flex-row items-center justify-center bg-gradient-to-br from-sky-50 via-teal-50 to-cyan-100 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 overflow-hidden transition-all">
        <AnimatedWaves />

        {/* HERO KIRI */}
        <div className="relative flex flex-col justify-center items-start flex-1 w-full max-w-lg text-left lg:pl-10 z-10">
          <Image
            src="/images/logo/LogoPama.svg"
            width={190}
            height={45}
            alt="COLIVERA Logo"
            priority
            className="mb-10"
          />
          <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight">
            Pantau Kualitas Air Anda <br />
            dengan{" "}
            <span className="text-emerald-600 dark:text-emerald-400">
              COLIVERA
            </span>
          </h1>

          <p className="mt-4 text-gray-600 dark:text-gray-300 text-lg max-w-md">
            Deteksi cepat bakteri <span className="font-semibold">E. coli</span>{" "}
            dan parameter air lain menggunakan teknologi IoT & AI.
          </p>

          {/* Typewriter muncul di sini */}
          <div className="mt-6 text-emerald-600 dark:text-emerald-400 font-medium text-base min-h-[1.5rem]">
            <TypewriterText />
          </div>
        </div>

        {/* FORM LOGIN KANAN */}
        <div className="relative w-full max-w-md flex justify-center mt-10 lg:mt-0 lg:ml-20 z-10">
          <div className="w-full p-8 bg-white/30 dark:bg-gray-900/30 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/30">
            {children}
          </div>
        </div>

        {/* Copyright Footer */}
        <div className="absolute bottom-6 left-0 right-0 flex justify-center z-20">
          <div className="group relative">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm transition-all duration-300 hover:text-emerald-600 dark:hover:text-emerald-400">
              <span className="inline-block group-hover:translate-y-[-8px] transition-transform duration-300">©</span>
              <span className="inline-block group-hover:translate-y-[-8px] transition-transform duration-300" style={{ transitionDelay: '50ms' }}>2025</span>
              <span className="font-semibold inline-block group-hover:translate-y-[-8px] transition-transform duration-300" style={{ transitionDelay: '100ms' }}>Lulus</span>
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}
