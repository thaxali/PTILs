"use client";

import { useState, useCallback } from "react";
import Toast from "./Toast";
import { generateShareImage } from "@/lib/generateShareImage";
import type { PTIL } from "@/lib/ptils";

interface ShareButtonProps {
  ptil: PTIL;
  variant?: "pill" | "icon";
}

export default function ShareButton({ ptil, variant = "icon" }: ShareButtonProps) {
  const [generating, setGenerating] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const dismissToast = useCallback(() => setShowToast(false), []);

  const handleShare = async () => {
    if (generating) return;
    setGenerating(true);

    try {
      const blob = await generateShareImage(ptil);
      const file = new File([blob], `ptils-${ptil.number}.png`, {
        type: "image/png",
      });

      const promptUrl = `https://ptils.me/til/${ptil.id}`;

      // Try Web Share API with file support (mobile)
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: ptil.title,
          url: promptUrl,
        });
        setToastMessage("Shared!");
      } else if (navigator.share) {
        // Desktop share (URL only, no file support)
        // Download the image separately
        const dlUrl = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = dlUrl;
        a.download = `ptils-${ptil.number}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(dlUrl);

        await navigator.share({
          title: ptil.title,
          url: promptUrl,
        });
        setToastMessage("Shared! Image also downloaded.");
      } else {
        // No share API at all — download image + copy URL
        const dlUrl = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = dlUrl;
        a.download = `ptils-${ptil.number}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(dlUrl);

        await navigator.clipboard.writeText(promptUrl);
        setToastMessage("Image downloaded & URL copied!");
      }

      setShowToast(true);
    } catch {
      // User cancelled share or error occurred — do nothing
    } finally {
      setGenerating(false);
    }
  };

  const shareIcon = (
    <svg
      width={16}
      height={16}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={generating ? "animate-pulse" : ""}
    >
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
      <polyline points="16 6 12 2 8 6" />
      <line x1="12" y1="2" x2="12" y2="15" />
    </svg>
  );

  if (variant === "pill") {
    return (
      <>
        <button
          onClick={handleShare}
          disabled={generating}
          className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/40 backdrop-blur-md border border-white/60 text-foreground font-[family-name:var(--font-jetbrains-mono)] text-sm hover:bg-white/60 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-60"
        >
          {shareIcon}
          {generating ? "Creating…" : "Share"}
        </button>
        <Toast message={toastMessage} visible={showToast} onDismiss={dismissToast} />
      </>
    );
  }

  return (
    <>
      <button
        onClick={handleShare}
        disabled={generating}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-[family-name:var(--font-jetbrains-mono)] text-muted hover:text-foreground hover:bg-primary/10 transition-all duration-200 disabled:opacity-60"
        aria-label="Share prompt as image"
      >
        {shareIcon}
        {generating ? "Creating…" : "Share"}
      </button>
      <Toast message={toastMessage} visible={showToast} onDismiss={dismissToast} />
    </>
  );
}
