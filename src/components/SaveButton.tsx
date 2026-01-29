"use client";

import { useState, useEffect } from "react";
import { isSaved, toggleSave } from "@/lib/storage";

interface SaveButtonProps {
  ptilId: string;
  size?: "sm" | "md";
}

export default function SaveButton({ ptilId, size = "md" }: SaveButtonProps) {
  const [saved, setSaved] = useState(false);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    setSaved(isSaved(ptilId));
  }, [ptilId]);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const nowSaved = toggleSave(ptilId);
    setSaved(nowSaved);
    if (nowSaved) {
      setAnimating(true);
      setTimeout(() => setAnimating(false), 200);
    }
  };

  const sizeClasses = size === "sm" ? "w-8 h-8" : "w-10 h-10";

  return (
    <button
      onClick={handleToggle}
      className={`${sizeClasses} flex items-center justify-center rounded-lg hover:bg-primary/10 transition-colors duration-200 ${animating ? "animate-pulse-heart" : ""}`}
      aria-label={saved ? "Unsave this prompt" : "Save this prompt"}
    >
      <svg
        width={size === "sm" ? 18 : 22}
        height={size === "sm" ? 18 : 22}
        viewBox="0 0 24 24"
        fill={saved ? "#F38A21" : "none"}
        stroke={saved ? "#F38A21" : "#8A8690"}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    </button>
  );
}
