import type {
  CommunityClusterResult,
  ClusterSignal,
  RiskLevel,
} from "@/lib/types";
import { riskLevelFor } from "@/lib/intelligence/individual-risk";

/**
 * COMMUNITY INTELLIGENCE ENGINE
 * ---------------------------------------------------------------
 * Aggregates anonymised household risk signals into village-level
 * clusters so health workers can spot emerging patterns early.
 *
 * Cluster risk is driven by:
 *  - how many households are individually elevated
 *  - whether symptoms are reported within the cluster
 *  - shared exposure context (heat, pesticide season, same crop)
 */

export interface HouseholdSignal {
  householdId: string;
  clusterId: string;
  /** 0–100 individual risk score */
  riskScore: number;
  reportedSymptom: boolean;
  activity: string;
}

export interface ClusterDefinition {
  id: string;
  name: string;
  /** x/y for the village map visualisation (0–100) */
  x: number;
  y: number;
}

export function analyzeCluster(
  cluster: ClusterDefinition,
  signals: HouseholdSignal[],
): CommunityClusterResult {
  const elevated = signals.filter(
    (s) => s.riskScore >= 65 || (s.reportedSymptom && s.riskScore >= 40),
  );
  const symptomatic = signals.filter((s) => s.reportedSymptom);

  const pesticideCount = signals.filter((s) => s.activity === "pesticide").length;
  const fieldWorkCount = signals.filter((s) => s.activity === "field-work" || s.activity === "harvest").length;

  const dominantSignals: ClusterSignal[] = [];
  if (elevated.length >= 2)
    dominantSignals.push({
      key: "heat",
      label: "High heat exposure",
      households: elevated.length,
    });
  if (pesticideCount >= 3)
    dominantSignals.push({
      key: "pesticide",
      label: "Pesticide activity",
      households: pesticideCount,
    });
  if (fieldWorkCount >= 3)
    dominantSignals.push({
      key: "field-work",
      label: "Heavy field workload",
      households: fieldWorkCount,
    });
  if (symptomatic.length >= 2)
    dominantSignals.push({
      key: "symptoms",
      label: "Similar reported symptoms",
      households: symptomatic.length,
    });

  const score = clusterScore(elevated.length, symptomatic.length, signals.length);
  const riskLevel: RiskLevel = riskLevelFor(score);


  const recommendedAction =
    riskLevel === "HIGH" || riskLevel === "SEVERE"
      ? "Health-worker outreach recommended for this cluster — follow up with elevated households."
      : riskLevel === "MODERATE"
        ? "Monitor this cluster — share heat-safety advisories with member households."
        : "No action required. Cluster is operating normally.";

  return {
    clusterId: cluster.id,
    clusterName: cluster.name,
    riskLevel,
    householdCount: signals.length,
    dominantSignals,
    recommendedAction,
    elevatedCount: elevated.length,
  };
}

/**
 * Rough 0–100 cluster score:
 *   share of elevated households (0–70)
 *   + size of the elevated group (×4, 0–~40)
 *   + symptom presence bonus (0–10)
 */
export function clusterScore(
  elevatedCount: number,
  symptomaticCount: number,
  total: number,
): number {
  const share = total > 0 ? elevatedCount / total : 0;
  let score = Math.round(share * 70) + elevatedCount * 4;
  if (symptomaticCount >= 1) score += 10;
  return Math.min(100, score);
}
