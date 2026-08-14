"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HomeHero } from "@/components/farmer/home-hero";
import { ResilienceCard } from "@/components/farmer/resilience-card";
import { RiskCard } from "@/components/farmer/risk-card";
import { SafeWindowCard } from "@/components/farmer/safe-window-card";
import { FarmPlanTimeline } from "@/components/farmer/farm-plan-timeline";
import { Button } from "@/components/ui/button";

export default function FarmerHome() {
  return (
    <div className="space-y-5">
      <HomeHero />

      <ResilienceCard />

      <div className="grid gap-5 lg:grid-cols-2">
        <RiskCard />
        <SafeWindowCard />
      </div>

      <FarmPlanTimeline compact />

      <div className="flex justify-center">
        <Link href="/farmer/farm-plan">
          <Button variant="secondary" size="lg">
            Open full farm plan <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
