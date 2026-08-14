"use client";

import { useEffect } from "react";
import { useSaathi } from "@/lib/store";
import { Toaster } from "@/components/ui/toast";

export function AppProviders({ children }: { children: React.ReactNode }) {
  const setRealOnline = useSaathi((s) => s.setRealOnline);

  useEffect(() => {
    // Real network status — drives the offline indicator and sync.
    const update = () => setRealOnline(navigator.onLine);
    update();
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, [setRealOnline]);

  useEffect(() => {
    // Register the service worker (production builds) so the app shell
    // is cached and the prototype genuinely works offline.
    if (process.env.NODE_ENV !== "production") return;
    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  }, []);

  return (
    <>
      {children}
      <Toaster />
    </>
  );
}
