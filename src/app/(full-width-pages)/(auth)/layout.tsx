"use client";
import ThemeTogglerTwo from "@/components/common/ThemeTogglerTwo";
import { ThemeProvider } from "@/context/ThemeContext";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef } from "react";

/** ====== Animasi Tsunami Waves (inline component) ====== */
function TsunamiWaves({
  ampFront = 140,
  ampBack = 90,
  speed = 0.12,
  className = "",
}: {
  ampFront?: number;
  ampBack?: number;
  speed?: number;
  className?: string;
}) {
  const wave1Ref = useRef<SVGPathElement | null>(null);
  const wave2Ref = useRef<SVGPathElement | null>(null);
  const tRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const animate = () => {
      tRef.current += speed;
      const t = tRef.current;
      const s = Math.sin;
      const c = Math.cos;

      const d1 = `M0,${160 + ampFront * s(t)}L60,${170 + ampFront * s(t + 0.2)}
        C120,${180 + ampFront * s(t + 0.4)},240,${200 + ampFront * s(t + 0.6)},
        360,${186.7 + ampFront * s(t + 0.8)}
        C480,${173 + ampFront * s(t + 1)},600,${127 + ampFront * s(t + 1.2)},
        720,${112 + ampFront * s(t + 1.4)}
        C840,${97 + ampFront * s(t + 1.6)},960,${111 + ampFront * s(t + 1.8)},
        1080,${117.3 + ampFront * s(t + 2)}
        C1200,${123 + ampFront * s(t + 2.2)},1320,${117 + ampFront * s(t + 2.4)},
        1380,${112 + ampFront * s(t + 2.6)}L1440,${107 + ampFront * s(t + 2.8)}L1440,320L0,320Z`;

      const d2 = `M0,${200 + ampBack * c(t)}L80,${210 + ampBack * c(t + 0.2)}
        C160,${220 + ampBack * c(t + 0.4)},320,${240 + ampBack * c(t + 0.6)},
        480,${226.7 + ampBack * c(t + 0.8)}
        C640,${213 + ampBack * c(t + 1)},800,${167 + ampBack * c(t + 1.2)},
        960,${160 + ampBack * c(t + 1.4)}
        C1120,${153 + ampBack * c(t + 1.6)},1280,${173 + ampBack * c(t + 1.8)},
        1360,${180 + ampBack * c(t + 2)},1440,${187 + ampBack * c(t + 2.2)}L1440,320L0,320Z`;

      wave1Ref.current?.setAttribute("d", d1);
      wave2Ref.current?.setAttribute("d", d2);
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [ampFront, ampBack, speed]);

  return (
    <svg
      className={`absolute bottom-0 left-0 w-full h-full ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1440 320"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        ref={wave1Ref}
        fill="#38bdf8"
        fillOpacity="0.6"
        d="M0,160L60,170C120,180,240,200,360,186.7C480,173,600,127,720,112C840,97,960,111,1080,117.3C1200,123,1320,117,1380,112L1440,107L1440,320L0,320Z"
      />
      <path
        ref={wave2Ref}
        fill="#0ea5e9"
        fillOpacity="0.4"
        d="M0,200L80,210C160,220,320,240,480,226.7C640,213,800,167,960,160C1120,153,1280,173,1360,180L1440,187L1440,320L0,320Z"
      />
    </svg>
  );
}

/** ================= AuthLayout ================= */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
      <ThemeProvider>
        <div className="relative flex lg:flex-row w-full h-screen justify-center flex-col dark:bg-gray-900 sm:p-0">
          {children}

          {/* Panel kanan dengan animasi ombak */}
          <div className="lg:w-1/2 w-full h-full bg-brand-950 relative overflow-hidden lg:grid items-center hidden dark:bg-white/5">
            {/* Animasi sebagai background */}
            <TsunamiWaves ampFront={140} ampBack={90} speed={0.12} />

            {/* Konten di atas animasi */}
            <div className="relative items-center justify-center flex z-10">
              <div className="flex flex-col items-center max-w-xs">
                <Link href="/" className="block mb-4">
                  <Image
                    width={231}
                    height={48}
                    src="/images/logo/LogoPama.svg"
                    alt="Logo"
                    priority
                  />
                </Link>
                <p className="text-center text-white/80 dark:text-white/70">
                  Use your access in the application and login to your dashboard account.
                </p>
              </div>
            </div>
          </div>

          <div className="fixed bottom-6 right-6 z-50 hidden sm:block">
            <ThemeTogglerTwo />
          </div>
        </div>
      </ThemeProvider>
    </div>
  );
}
