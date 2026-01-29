"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Tag from "@/components/Tag";
import { getSavedIds, toggleSave } from "@/lib/storage";
import Link from "next/link";
import type { PTIL } from "@/lib/ptils";

export default function SavedClient({ ptils }: { ptils: PTIL[] }) {
  const [savedIds, setSavedIds] = useState<string[]>([]);

  useEffect(() => {
    setSavedIds(getSavedIds());
  }, []);

  const savedPtils = ptils.filter((p) => savedIds.includes(p.id));

  const handleUnsave = (id: string) => {
    toggleSave(id);
    setSavedIds(getSavedIds());
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 w-full max-w-3xl mx-auto px-6 py-12">
        <h1 className="font-[family-name:var(--font-instrument-serif)] text-3xl mb-4">
          Your Saved Prompts
        </h1>

        {/* Persistence warning banner */}
        <div className="bg-secondary/10 border border-secondary/20 rounded-xl px-4 py-3 mb-8">
          <p className="text-xs font-[family-name:var(--font-jetbrains-mono)] text-foreground/70">
            Your saved prompts are stored in your browser. They&apos;ll disappear if you clear your browsing history or visit PTILs on a different device.
          </p>
        </div>

        {savedPtils.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-[family-name:var(--font-instrument-serif)] text-lg text-muted">
              No saved prompts yet. Start exploring!
            </p>
            <Link
              href="/"
              className="inline-block mt-4 px-5 py-2.5 rounded-lg bg-primary text-white text-sm font-[family-name:var(--font-jetbrains-mono)] hover:bg-primary/90 transition-colors duration-200"
            >
              Discover prompts
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {savedPtils.map((ptil) => (
              <div key={ptil.id} className="relative group">
                <Link href={`/til/${ptil.id}`} className="block">
                  <div className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                    <p className="font-[family-name:var(--font-jetbrains-mono)] text-xs text-muted mb-2">
                      #{String(ptil.number).padStart(3, "0")}
                    </p>
                    <h3 className="font-[family-name:var(--font-instrument-serif)] text-base leading-snug mb-3">
                      {ptil.title}
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                      {ptil.tags.map((tag) => (
                        <Tag key={tag} label={tag} />
                      ))}
                    </div>
                  </div>
                </Link>
                <button
                  onClick={() => handleUnsave(ptil.id)}
                  className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-lg bg-white/80 hover:bg-white text-muted hover:text-foreground transition-all duration-200 opacity-0 group-hover:opacity-100"
                  aria-label="Remove from saved"
                >
                  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
