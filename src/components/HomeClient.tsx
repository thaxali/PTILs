"use client";

import { useState, useCallback, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import type { PTIL } from "@/lib/ptils";

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function HomeClient({ ptils }: { ptils: PTIL[] }) {
  const [order, setOrder] = useState<number[] | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fadeKey, setFadeKey] = useState(0);

  useEffect(() => {
    setOrder(shuffleArray(ptils.map((_, i) => i)));
  }, [ptils]);

  const currentPtil = order ? ptils[order[currentIndex]] : ptils[0];

  const handleShuffle = useCallback(() => {
    if (!order) return;
    setCurrentIndex((prev) => (prev + 1) % order.length);
    setFadeKey((k) => k + 1);
  }, [order]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" && e.target === document.body) {
        e.preventDefault();
        handleShuffle();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleShuffle]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-4">
        <p className="font-[family-name:var(--font-instrument-serif)] text-3xl text-foreground mb-6 text-center">
          Discover New AI Prompts
        </p>

        <div
          key={fadeKey}
          className="relative w-full max-w-md animate-fade-in-up"
        >
          {/* Stacked cards behind */}
          <div className="absolute inset-0 translate-y-8 scale-[0.88] -skew-x-[3deg] rounded-[40px] bg-white border border-foreground/10 shadow-lg aspect-[3/4] z-0" aria-hidden="true" />
          <div className="absolute inset-0 translate-y-6 scale-[0.91] -skew-x-[2deg] rounded-[40px] bg-white border border-foreground/10 shadow-lg aspect-[3/4] z-10" aria-hidden="true" />
          <div className="absolute inset-0 translate-y-4 scale-[0.94] -skew-x-[1deg] rounded-[40px] bg-white border border-foreground/10 shadow-lg aspect-[3/4] z-20" aria-hidden="true" />
          <div className="absolute inset-0 translate-y-2 scale-[0.97] -skew-x-[0.5deg] rounded-[40px] bg-white border border-foreground/10 shadow-lg aspect-[3/4] z-30" aria-hidden="true" />

          {/* Main card */}
          <Link href={`/til/${currentPtil.id}`} className="relative block group z-40">
            <div className="relative rounded-[40px] overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 aspect-[3/4]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={currentPtil.imageUrl}
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
                loading="eager"
              />
              {/* Gradient overlay for text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

              {/* Number pill — top right */}
              <div className="absolute top-4 right-4">
                <span className="inline-block px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-xs font-[family-name:var(--font-jetbrains-mono)] text-foreground/80">
                  #{String(currentPtil.number).padStart(3, "0")}
                </span>
              </div>

              {/* Content — bottom */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h2 className="font-[family-name:var(--font-instrument-serif)] text-3xl leading-snug mb-3 text-white">
                  {currentPtil.title}
                </h2>
                <div className="flex flex-wrap gap-1.5">
                  {currentPtil.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-block px-3 py-1 rounded-lg bg-white/20 backdrop-blur-sm text-white/90 text-xs font-[family-name:var(--font-jetbrains-mono)]"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Link>
        </div>

        <button
          onClick={handleShuffle}
          className="mt-5 flex items-center gap-2 px-6 py-3 rounded-full bg-white/40 backdrop-blur-md border border-white/60 text-foreground font-[family-name:var(--font-jetbrains-mono)] text-sm hover:bg-white/60 transition-all duration-200 shadow-sm hover:shadow-md"
        >
          <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <polyline points="16 3 21 3 21 8" />
            <line x1="4" y1="20" x2="21" y2="3" />
            <polyline points="21 16 21 21 16 21" />
            <line x1="15" y1="15" x2="21" y2="21" />
            <line x1="4" y1="4" x2="9" y2="9" />
          </svg>
          Shuffle
        </button>

        <p className="mt-2 text-xs text-muted/60 font-[family-name:var(--font-jetbrains-mono)] hidden sm:block">
          press <kbd className="px-1.5 py-0.5 rounded bg-foreground/5 border border-foreground/10 text-muted">space</kbd> to shuffle
        </p>
      </main>

      <Footer />
    </div>
  );
}
