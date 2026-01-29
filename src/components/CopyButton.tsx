"use client";

import { useState, useCallback } from "react";
import Toast from "./Toast";

interface CopyButtonProps {
  text: string;
}

export default function CopyButton({ text }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setShowToast(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const dismissToast = useCallback(() => setShowToast(false), []);

  return (
    <>
      <button
        onClick={handleCopy}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-[family-name:var(--font-jetbrains-mono)] text-muted hover:text-foreground hover:bg-primary/10 transition-all duration-200"
        aria-label="Copy prompt to clipboard"
      >
        {copied ? (
          <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        ) : (
          <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
        )}
        {copied ? "Copied!" : "Copy"}
      </button>
      <Toast message="Copied to clipboard" visible={showToast} onDismiss={dismissToast} />
    </>
  );
}
