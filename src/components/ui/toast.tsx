"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Info, WifiOff } from "lucide-react";

type ToastKind = "success" | "info" | "offline" | "error";
interface Toast {
  id: number;
  kind: ToastKind;
  message: string;
}

let pushToast: ((kind: ToastKind, message: string) => void) | null = null;

export function toast(kind: ToastKind, message: string) {
  pushToast?.(kind, message);
}

export function Toaster() {
  const [items, setItems] = useState<Toast[]>([]);

  useEffect(() => {
    pushToast = (kind, message) => {
      const id = Date.now() + Math.random();
      setItems((prev) => [...prev.slice(-2), { id, kind, message }]);
      setTimeout(() => setItems((prev) => prev.filter((t) => t.id !== id)), 3800);
    };
    return () => {
      pushToast = null;
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-[90] flex flex-col items-center gap-2 px-4">
      {items.map((t) => (
        <div
          key={t.id}
          className="pointer-events-auto flex items-center gap-2.5 rounded-xl border bg-white/95 px-4 py-2.5 text-sm font-medium shadow-lift animate-fade-up"
        >
          {t.kind === "success" && <CheckCircle2 className="h-4.5 w-4.5 text-agri-600" />}
          {t.kind === "offline" && <WifiOff className="h-4.5 w-4.5 text-amber-600" />}
          {t.kind === "error" && <Info className="h-4.5 w-4.5 text-red-600" />}
          {(t.kind === "info" || t.kind === "success") && (
            <Info className="h-4.5 w-4.5 text-charcoal-400" />
          )}
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
}
