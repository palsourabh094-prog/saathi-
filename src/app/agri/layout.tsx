"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CalendarClock, LayoutGrid, Leaf, ShieldAlert } from "lucide-react";
import { Shell } from "@/components/layout/shell";
import { DemoController } from "@/components/demo/demo-controller";
import { useSaathi } from "@/lib/store";

const NAV = [
  { href: "/agri", label: "Farms", icon: LayoutGrid },
  { href: "/agri/activities", label: "Activities", icon: CalendarClock },
  { href: "/agri/risk", label: "Risk", icon: ShieldAlert },
  { href: "/agri/planning", label: "Planning", icon: Leaf },
];

export default function AgriLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const role = useSaathi((s) => s.role);
  const demoMode = useSaathi((s) => s.demoMode);

  useEffect(() => {
    if (!role) router.replace("/");
    else if (role !== "agri") router.replace("/" + role);
  }, [role, router]);

  if (!role || role !== "agri") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper">
        <p className="text-sm text-charcoal-400">Loading…</p>
      </div>
    );
  }

  return (
    <Shell nav={NAV} roleLabel="Agricultural Worker" userName="Vikram Singh · Extension">
      {children}
      {demoMode && <DemoController />}
    </Shell>
  );
}
