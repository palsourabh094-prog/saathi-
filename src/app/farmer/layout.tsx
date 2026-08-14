"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, HeartPulse, Home, Mic, UserRound } from "lucide-react";
import { Shell } from "@/components/layout/shell";
import { DemoController } from "@/components/demo/demo-controller";
import { useSaathi } from "@/lib/store";

const NAV = [
  { href: "/farmer", label: "Home", icon: Home },
  { href: "/farmer/farm-plan", label: "Farm Plan", icon: CalendarDays },
  { href: "/farmer/health", label: "Health", icon: HeartPulse },
  { href: "/farmer/ask", label: "Ask SAATHI", icon: Mic },
  { href: "/farmer/profile", label: "Profile", icon: UserRound },
];

export default function FarmerLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const role = useSaathi((s) => s.role);
  const demoMode = useSaathi((s) => s.demoMode);

  useEffect(() => {
    if (!role) router.replace("/");
    else if (role !== "farmer") router.replace("/" + role);
  }, [role, router]);

  if (!role || role !== "farmer") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper">
        <p className="text-sm text-charcoal-400">Loading…</p>
      </div>
    );
  }

  return (
    <Shell nav={NAV} roleLabel="Farmer" userName="Ramesh Kumar">
      {children}
      {demoMode && <DemoController />}
    </Shell>
  );
}
