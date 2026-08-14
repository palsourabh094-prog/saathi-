"use client";

import { useMemo } from "react";
import { useSaathi } from "@/lib/store";
import { seedHouseholds, CLUSTERS } from "@/lib/data/seed";
import { evaluateRisk } from "@/lib/intelligence/individual-risk";
import type { ActivityType, RiskLevel } from "@/lib/types";

export interface UpcomingActivity {
  activity: ActivityType;
  label: string;
  when: string;
  riskScore: number;
  riskLevel: RiskLevel;
  note: string;
}

export function useAgriData() {
  const env = useSaathi((s) => s.env);
  const heatwaveActive = useSaathi((s) => s.heatwaveActive);

  const byCrop = useMemo(() => {
    const map = new Map<string, number>();
    seedHouseholds.forEach((h) => {
      map.set(h.farm.crop, (map.get(h.farm.crop) ?? 0) + 1);
    });
    return [...map.entries()].sort((a, b) => b[1] - a[1]);
  }, []);

  const upcoming = useMemo<UpcomingActivity[]>(() => {
    const risk = (activity: ActivityType, hour: number, minutes: number) =>
      evaluateRisk({
        activity,
        hour,
        durationMin: minutes,
        temperature: env.hourlyTemp[hour] ?? env.temperature,
        humidity: env.hourlyHumidity[hour] ?? env.humidity,
      });
    return [
      {
        activity: "irrigation",
        label: "Irrigation",
        when: "Today · 6:00 AM",
        ...pick(risk("irrigation", 6, 60)),
        note: "Best done before the heat builds.",
      },
      {
        activity: "fertilizer",
        label: "Fertiliser application",
        when: "Today · 10:00 AM",
        ...pick(risk("fertilizer", 10, 45)),
        note: heatwaveActive ? "Consider a morning or evening pass." : "Recommended window works.",
      },
      {
        activity: "pesticide",
        label: "Pesticide application",
        when: "Today · 1:00 PM",
        ...pick(risk("pesticide", 13, 150)),
        note: heatwaveActive
          ? "High risk at 1 PM — shift to the 5:00 PM – 7:30 PM window."
          : "Follow product-label safety instructions.",
      },
      {
        activity: "harvest",
        label: "Harvest",
        when: "Next 3 days",
        ...pick(risk("harvest", 13, 180)),
        note: heatwaveActive ? "Plan harvest crews for early morning or late evening." : "Normal conditions.",
      },
    ];
  }, [env, heatwaveActive]);

  const recommendation = useMemo(() => {
    if (heatwaveActive) {
      return {
        tone: "high" as const,
        title: "Elevated risk for pesticide application today",
        body:
          "Current conditions create elevated occupational risk for pesticide application across cotton and mustard farms. Share the recommended work window (5:00 PM – 7:30 PM) with member farmers and consider advising crews to hydrate and rest.",
      };
    }
    return {
      tone: "ok" as const,
      title: "Conditions support a normal work plan",
      body:
        "No elevated occupational risk for planned activities. Standard safety guidance continues to apply for chemical handling.",
    };
  }, [heatwaveActive]);

  return { env, heatwaveActive, byCrop, upcoming, recommendation, clusters: CLUSTERS };
}

function pick(r: ReturnType<typeof evaluateRisk>) {
  return { riskScore: r.riskScore, riskLevel: r.riskLevel };
}
