"use client";

import { useMemo } from "react";
import { useSaathi } from "@/lib/store";
import { seedHouseholds, CLUSTERS } from "@/lib/data/seed";
import { householdSignals } from "@/lib/intelligence/household-signals";
import { analyzeCluster } from "@/lib/intelligence/community";
import { riskLevelFor } from "@/lib/intelligence/individual-risk";
import type { RiskLevel } from "@/lib/types";

export function useWorkerData() {
  const env = useSaathi((s) => s.env);
  const symptoms = useSaathi((s) => s.symptoms);
  const heatwaveActive = useSaathi((s) => s.heatwaveActive);

  const symptomaticIds = useMemo(
    () => new Set(symptoms.map((s) => s.householdId)),
    [symptoms],
  );

  const signals = useMemo(
    () => householdSignals(seedHouseholds, env, symptomaticIds),
    [env, symptomaticIds],
  );

  const clusters = useMemo(
    () =>
      CLUSTERS.map((c) => ({
        def: c,
        result: analyzeCluster(
          c,
          signals.filter((s) => s.clusterId === c.id),
        ),
      })),
    [signals],
  );

  const stats = useMemo(() => {
    const count: Record<RiskLevel, number> = {
      LOW: 0,
      MODERATE: 0,
      HIGH: 0,
      SEVERE: 0,
    };
    signals.forEach((s) => {
      count[s.riskLevel] += 1;
    });
    return { ...count, total: signals.length };
  }, [signals]);

  /** Priority cases: elevated signals first, then symptomatic. */
  const priorityCases = useMemo(() => {
    return signals
      .filter((s) => s.riskLevel !== "LOW")
      .sort((a, b) => {
        const score = (s: (typeof signals)[number]) =>
          (s.riskLevel === "SEVERE" || s.riskLevel === "HIGH" ? 100 : 40) + s.riskScore;
        return score(b) - score(a);
      })
      .slice(0, 8);
  }, [signals]);

  const rameshSignal = useMemo(
    () => signals.find((s) => s.householdId === "hh-ramesh"),
    [signals],
  );

  const rameshLevel: RiskLevel = useMemo(() => {
    if (!rameshSignal) return "LOW";
    const hasSymptom = symptomaticIds.has("hh-ramesh");
    if (hasSymptom && rameshSignal.riskScore >= 40) return "HIGH";
    return rameshSignal.riskLevel;
  }, [rameshSignal, symptomaticIds]);

  return {
    env,
    heatwaveActive,
    signals,
    clusters,
    stats,
    priorityCases,
    rameshSignal,
    rameshLevel,
    symptoms,
  };
}

export { riskLevelFor };
