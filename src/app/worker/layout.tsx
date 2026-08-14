"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ClipboardList, LayoutDashboard, MapPinned, Siren } from "lucide-react";
import { Shell } from "@/components/layout/shell";
import { DemoController } from "@/components/demo/demo-controller";
import { useSaathi } from "@/lib/store";

const NAV = [
  { href: "/worker", label: "Overview", icon: LayoutDashboard },
  { href: "/worker/priority", label: "Priority", icon: Siren },
  { href: "/worker/community", label: "Community", icon: MapPinned },
  { href: "/worker/follow-ups", label: "Follow-ups", icon: ClipboardList },
];

export default function WorkerLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const role = useSaathi((s) => s.role);
  const demoMode = useSaathi((s) => s.demoMode);

  useEffect(() => {
    if (!role) router.replace("/");
    else if (role !== "worker") router.replace("/" + role);
  }, [role, router]);

  if (!role || role !== "worker") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper">
        <p className="text-sm text-charcoal-400">Loading…</p>
      </div>
    );
  }

  return (
    <Shell nav={NAV} roleLabel="Health Worker" userName="Anjali Devi · ASHA">
      {children}
      {demoMode && <DemoController />}
    </Shell>
  );
}
