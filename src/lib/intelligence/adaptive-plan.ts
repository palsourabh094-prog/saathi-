import type {
  ActivityType,
  EnvironmentState,
  FarmPlanItem,
  RiskLevel,
} from "@/lib/types";
import { evaluateRisk } from "@/lib/intelligence/individual-risk";

/**
 * ADAPTIVE FARM PLAN ENGINE
 * ---------------------------------------------------------------
 * SAATHI does not just warn — it redesigns the day's work around the
 * farmer's wellbeing. Chemical-handling activities scheduled in a
 * high-risk window are moved to the safest available window, and the
 * original slot is flagged with an honest "why".
 */

export interface AdaptivePlanItem extends FarmPlanItem {
  status: "ok" | "flagged" | "moved" | "added";
  risk: number;
  riskLevel: RiskLevel;
  why?: string;
  movedToHour?: number;
}

const CHEMICAL: ActivityType[] = ["pesticide", "fertilizer"];

export function adaptFarmPlan(
  plan: FarmPlanItem[],
  env: EnvironmentState,
  vulnerabilitySignals: string[] = [],
  nowHour = 9,
): AdaptivePlanItem[] {
  const out: AdaptivePlanItem[] = [];
  const moved = new Map<string, AdaptivePlanItem>();

  for (const item of plan) {
    const risk = evaluateRisk({
      activity: item.activity,
      hour: item.hour,
      durationMin: item.durationMin,
      temperature: env.hourlyTemp[item.hour] ?? env.temperature,
      humidity: env.hourlyHumidity[item.hour] ?? env.humidity,
      vulnerabilitySignals,
      hourlyTemp: env.hourlyTemp,
      hourlyHumidity: env.hourlyHumidity,
    });

    const isChemical = CHEMICAL.includes(item.activity);
    const tooRisky = risk.riskLevel === "HIGH" || risk.riskLevel === "SEVERE";

    if (isChemical && tooRisky && item.hour > nowHour) {
      // Flag the original slot.
      out.push({
        ...item,
        status: "flagged",
        risk: risk.riskScore,
        riskLevel: risk.riskLevel,
        why: "Elevated exposure risk at this time — heat, humidity and chemical handling combine here.",
      });

      // Add a safer alternative in the recommended window (dedupe per activity).
      if (!moved.has(item.activity)) {
        const window = risk.recommendedWindow;
        const newHour = Math.round(window.startHour);
        const movedRisk = evaluateRisk({
          activity: item.activity,
          hour: newHour,
          durationMin: item.durationMin,
          temperature: env.hourlyTemp[newHour] ?? env.temperature,
          humidity: env.hourlyHumidity[newHour] ?? env.humidity,
          vulnerabilitySignals,
          hourlyTemp: env.hourlyTemp,
          hourlyHumidity: env.hourlyHumidity,
        });
        const movedItem: AdaptivePlanItem = {
          ...item,
          id: `${item.id}-adapted`,
          hour: newHour,
          adapted: true,
          originalHour: item.hour,
          status: "moved",
          risk: movedRisk.riskScore,
          riskLevel: movedRisk.riskLevel,
          why: `Shifted from ${formatHour(item.hour)} to the safer work window (${window.label}) based on today's conditions.`,
          movedToHour: newHour,
        };
        moved.set(item.activity, movedItem);
        out.push(movedItem);
      }
    } else {
      out.push({
        ...item,
        status: "ok",
        risk: risk.riskScore,
        riskLevel: risk.riskLevel,
      });
    }
  }

  return out.sort((a, b) => a.hour - b.hour);
}

export function formatHour(hour: number): string {
  const h = Math.floor(hour);
  const suffix = h >= 12 ? "PM" : "AM";
  const display = h % 12 === 0 ? 12 : h % 12;
  return `${display}:00 ${suffix}`;
}
