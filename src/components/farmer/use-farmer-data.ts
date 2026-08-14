"use client";

import { useMemo } from "react";
import { useSaathi } from "@/lib/store";
import { adaptFarmPlan } from "@/lib/intelligence/adaptive-plan";
import { evaluateRisk, hourlyRiskCurve } from "@/lib/intelligence/individual-risk";
import {
  computeResilience,
  healthPressureFromSymptoms,
} from "@/lib/intelligence/household-resilience";

/**
 * Central derived-data hook for the farmer experience.
 * Every screen reads the same tuned inputs, so the numbers stay
 * consistent across Home, Farm Plan, Health and Ask SAATHI.
 */
export function useFarmerData() {
  const env = useSaathi((s) => s.env);
  const heatwaveActive = useSaathi((s) => s.heatwaveActive);
  const farmPlan = useSaathi((s) => s.farmPlan);
  const symptoms = useSaathi((s) => s.symptoms);

  const reportedSymptoms = useMemo(
    () => symptoms.filter((s) => s.symptom !== "none"),
    [symptoms],
  );

  const adaptedPlan = useMemo(
    () => adaptFarmPlan(farmPlan, env, []),
    [farmPlan, env],
  );

  const pesticide = useMemo(
    () => farmPlan.find((p) => p.activity === "pesticide") ?? farmPlan[0],
    [farmPlan],
  );

  const currentRisk = useMemo(
    () =>
      evaluateRisk({
        activity: pesticide.activity,
        hour: pesticide.hour,
        durationMin: pesticide.durationMin,
        temperature: env.hourlyTemp[pesticide.hour] ?? env.temperature,
        humidity: env.hourlyHumidity[pesticide.hour] ?? env.humidity,
        hourlyTemp: env.hourlyTemp,
        hourlyHumidity: env.hourlyHumidity,
      }),
    [pesticide, env],
  );

  const hasHighRiskSignal = useMemo(
    () =>
      reportedSymptoms.some((s) =>
        ["dizziness", "breathing", "weakness"].includes(s.symptom),
      ),
    [reportedSymptoms],
  );

  const resilience = useMemo(
    () =>
      computeResilience({
        env,
        healthPressure: healthPressureFromSymptoms(
          reportedSymptoms.length,
          hasHighRiskSignal,
        ),
        // Seasonal pressure for the Ramesh demo household (2-acre cotton, harvest season).
        workloadPressure: 75,
        workforceBuffer: 60,
        previousScore: heatwaveActive ? 78 : undefined,
        seasonalActivity: farmPlan.map((p) => p.activity),
      }),
    [env, reportedSymptoms.length, hasHighRiskSignal, heatwaveActive, farmPlan],
  );

  const curve = useMemo(
    () => hourlyRiskCurve("pesticide", env, pesticide.durationMin),
    [env, pesticide],
  );

  return {
    env,
    heatwaveActive,
    farmPlan,
    adaptedPlan,
    currentRisk,
    resilience,
    curve,
    reportedSymptoms,
    symptoms,
  };
}
