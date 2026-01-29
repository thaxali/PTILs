"use client";

import { useState } from "react";

interface ExpandableSectionProps {
  title: string;
  children: React.ReactNode;
}

export default function ExpandableSection({ title, children }: ExpandableSectionProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div>
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 text-xs font-[family-name:var(--font-jetbrains-mono)] uppercase tracking-wider text-muted hover:text-foreground transition-colors duration-200"
      >
        <span>{title}</span>
        <svg
          width={14}
          height={14}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      <div
        className={`overflow-hidden transition-all duration-200 ease-out ${expanded ? "max-h-[2000px] opacity-100 mt-4" : "max-h-0 opacity-0"}`}
      >
        <div className="bg-black rounded-2xl p-5 border border-foreground/5 font-[family-name:var(--font-jetbrains-mono)] text-sm text-accent leading-relaxed whitespace-pre-wrap">
          {children}
        </div>
      </div>
    </div>
  );
}
