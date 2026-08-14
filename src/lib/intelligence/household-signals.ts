import type {
  ActivityType,
  EnvironmentState,
  Household,
  RiskLevel,
} from "@/lib/types";
import { evaluateRisk } from "@/lib/intelligence/individual-risk";
import { RAMESH_HOUSEHOLD_ID } from "@/lib/data/seed";

/**
 * Derives a household-level occupational-risk signal from its farm
 * context (crop → today's activity) + current environment.
 * This is the Level 1 → Level 2 bridge for the community engine.
 *
 * Modelling notes (documented, deterministic):
 *  - not every farm handles chemicals today — some irrigate instead
 *  - each activity is evaluated at its typical hour (irrigation 6 AM,
 *    fertiliser 10 AM, pesticide 13:00, field work / harvest 13:00)
 *  - Ramesh's household mirrors his farm plan exactly (87 HIGH in a heatwave)
 */

export const CROP_ACTIVITY: Record<string, ActivityType> = {
  Cotton: "pesticide",
  Mustard: "pesticide",
  Sugarcane: "harvest",
  Paddy: "field-work",
  Wheat: "fertilizer",
  Vegetables: "irrigation",
};

/** Deterministic per-household variation: some chemical farms irrigate today. */
function activityFor(h: Household, index: number): ActivityType {
  if (h.id === RAMESH_HOUSEHOLD_ID) return "pesticide";
  const base = CROP_ACTIVITY[h.farm.crop] ?? "field-work";
  if (base !== "pesticide") return base;
  const n = (index * 3 + hash(h.id)) % 10;
  return n < 3 ? "irrigation" : "pesticide";
}

function hash(s: string): number {
  let n = 0;
  for (let i = 0; i < s.length; i++) n = (n * 31 + s.charCodeAt(i)) >>> 0;
  return n;
}

/** Typical hour a given activity happens on a farm. */
export const ACTIVITY_HOUR: Record<ActivityType, number> = {
  irrigation: 6,
  fertilizer: 10,
  pesticide: 13,
  "field-work": 13,
  harvest: 13,
  sowing: 8,
  rest: 9,
};

export interface HouseholdRiskSignal {
  householdId: string;
  headName: string;
  clusterId: string;
  activity: ActivityType;
  riskScore: number;
  riskLevel: RiskLevel;
  reportedSymptom: boolean;
  crop: string;
}

export function householdSignals(
  households: Household[],
  env: EnvironmentState,
  symptomaticHouseholdIds: Set<string>,
): HouseholdRiskSignal[] {
  return households.map((h, index) => {
    const activity = activityFor(h, index);
    const hour = ACTIVITY_HOUR[activity];
    // Longer exposure on busier farms; Ramesh matches his farm plan (150 min).
    const durationMin =
      h.id === RAMESH_HOUSEHOLD_ID
        ? 150
        : 120 + Math.round(h.farm.workload * 0.6);
    const r = evaluateRisk({
      activity,
      hour,
      durationMin,
      temperature: env.hourlyTemp[hour] ?? env.temperature,
      humidity: env.hourlyHumidity[hour] ?? env.humidity,
    });
    return {
      householdId: h.id,
      headName: h.headName,
      clusterId: h.clusterId,
      activity,
      riskScore: r.riskScore,
      riskLevel: r.riskLevel,
      reportedSymptom: symptomaticHouseholdIds.has(h.id),
      crop: h.farm.crop,
    };
  });
}
