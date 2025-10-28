"use client";
import React, { useEffect, useState } from "react";

export default function TypewriterText() {
  const [mounted, setMounted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const messages = [
    "💧 Bakteri E. coli dapat hidup di air tercemar limbah.",
    "🧫 COLIVERA mendeteksi E. coli hanya dalam hitungan detik.",
    "🌊 Pantau kualitas air Anda secara real-time dan akurat.",
    "📊 Data sensor langsung dikirim ke dashboard web COLIVERA.",
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const timeout = setTimeout(() => {
      const fullText = messages[currentIndex];

      if (!isDeleting) {
        // Typing
        if (currentText.length < fullText.length) {
          setCurrentText(fullText.slice(0, currentText.length + 1));
        } else {
          // Pause before deleting
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        // Deleting
        if (currentText.length > 0) {
          setCurrentText(currentText.slice(0, -1));
        } else {
          setIsDeleting(false);
          setCurrentIndex((prev) => (prev + 1) % messages.length);
        }
      }
    }, isDeleting ? 30 : 60);

    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, currentIndex, mounted]);

  if (!mounted) {
    return <div className="h-6"></div>; // Placeholder to prevent layout shift
  }

  return (
    <div className="min-h-[1.5rem]">
      <span>{currentText}</span>
      <span className="animate-pulse">|</span>
    </div>
  );
}
