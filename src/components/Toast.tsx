"use client";

import { useEffect } from "react";

interface ToastProps {
  message: string;
  visible: boolean;
  onDismiss: () => void;
}

export default function Toast({ message, visible, onDismiss }: ToastProps) {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(onDismiss, 2000);
      return () => clearTimeout(timer);
    }
  }, [visible, onDismiss]);

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-toast-in">
      <div className="bg-foreground text-background px-4 py-2 rounded-lg text-sm font-[family-name:var(--font-jetbrains-mono)] shadow-lg">
        {message}
      </div>
    </div>
  );
}
