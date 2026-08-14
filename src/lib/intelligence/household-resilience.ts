import type { EnvironmentState, ResilienceResult, RiskDriver, Trend } from "@/lib/types";
import { humidityPoints, heatPoints } from "@/lib/intelligence/individual-risk";

/**
 * HOUSEHOLD RESILIENCE ENGINE
 * ---------------------------------------------------------------
 * Transparent prototype calculation — not a black-box AI.
 *
 *   Resilience (0–100) = 100
 *     − healthPressure        × 0.28
 *     − environmentalPressure × 0.27
 *     − agriculturalWorkload  × 0.30
 *     + workforceBuffer       × 0.15
 *
 * Each component is normalised 0–100. Higher = more resilient.
 * Weights are documented here so they are easy to tune later.
 * The canonical demo scenario (Ramesh, 2-acre cotton):
 *   normal day  → 78/100 · heatwave  → 64/100 · after symptom → ~59/100
 */
export const RESILIENCE_WEIGHTS = {
  health: 0.28,
  environmental: 0.27,
  workload: 0.3,
  workforce: 0.15,
} as const;

export interface ResilienceInput {
  env: EnvironmentState;
  /** 0–100 health pressure from symptoms / signals */
  healthPressure: number;
  /** 0–100 workload pressure from farm activity */
  workloadPressure: number;
  /** 0–100 available-workforce buffer (100 = fully staffed) */
  workforceBuffer: number;
  /** previous score for trend comparison */
  previousScore?: number;
  /** today's planned activities — used to name exposure drivers */
  seasonalActivity?: string[];
}

export function environmentalPressure(env: EnvironmentState): number {
  const heat = heatPoints(env.temperature); // 0–45
  const humidity = humidityPoints(env.humidity); // 0–30
  return Math.min(100, Math.round((heat + humidity) * 1.8));
}

export function healthPressureFromSymptoms(
  symptomCount: number,
  hasHighRiskSignal: boolean,
): number {
  let p = symptomCount * 18;
  if (hasHighRiskSignal) p += 22;
  return Math.min(100, p);
}

export function computeResilience(input: ResilienceInput): ResilienceResult {
  const env = environmentalPressure(input.env);
  const health = Math.max(0, Math.min(100, Math.round(input.healthPressure)));
  const workload = Math.max(0, Math.min(100, Math.round(input.workloadPressure)));
  const workforce = Math.max(0, Math.min(100, Math.round(input.workforceBuffer)));

  const raw =
    100 -
    health * RESILIENCE_WEIGHTS.health -
    env * RESILIENCE_WEIGHTS.environmental -
    workload * RESILIENCE_WEIGHTS.workload +
    workforce * RESILIENCE_WEIGHTS.workforce;

  const score = Math.max(0, Math.min(100, Math.round(raw)));

  const drivers: RiskDriver[] = [];

  if (env >= 55)
    drivers.push({
      key: "heat",
      label: "High heat",
      points: env,
      detail: `${input.env.temperature}°C · ${input.env.humidity}% humidity`,
    });
  else if (env >= 30)
    drivers.push({
      key: "heat",
      label: "Warm conditions",
      points: env,
      detail: `${input.env.temperature}°C · ${input.env.humidity}% humidity`,
    });

  if (health >= 40)
    drivers.push({
      key: "health",
      label: "Reported symptoms",
      points: health,
      detail: "Health signals recorded for the household",
    });

  if (workload >= 50)
    drivers.push({
      key: "workload",
      label: "High farm workload",
      points: workload,
      detail: "Pesticide / fertiliser season demand",
    });

  if (
    workload >= 40 &&
    input.seasonalActivity?.includes("pesticide") &&
    !drivers.some((d) => d.key === "workload")
  )
    drivers.push({
      key: "pesticide",
      label: "Pesticide activity",
      points: 18,
      detail: "Chemical handling planned today",
    });

  if (workload >= 30 && drivers.length < 3)
    drivers.push({
      key: "workload-mid",
      label: "Farm workload",
      points: workload,
      detail: "Seasonal agricultural activity",
    });

  const trend: Trend = (() => {
    if (input.previousScore === undefined) return "stable";
    const delta = score - input.previousScore;
    if (delta <= -3) return "declining";
    if (delta >= 3) return "improving";
    return "stable";
  })();

  return {
    score,
    level: trend,
    drivers: drivers.slice(0, 3),
    components: { health, environmental: env, workload, workforce },
  };
}
