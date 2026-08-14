import { describe, expect, it } from "vitest";
import { analyzeCluster, clusterScore } from "@/lib/intelligence/community";
import type { HouseholdSignal } from "@/lib/intelligence/community";

const cluster = { id: "north-field", name: "North Field Cluster", x: 68, y: 26 };

const signal = (over: Partial<HouseholdSignal>): HouseholdSignal => ({
  householdId: "hh-x",
  clusterId: "north-field",
  riskScore: 30,
  reportedSymptom: false,
  activity: "pesticide",
  ...over,
});

describe("analyzeCluster", () => {
  it("flags a HIGH cluster when the majority is elevated", () => {
    const signals = [
      signal({ householdId: "a", riskScore: 87, activity: "pesticide" }),
      signal({ householdId: "b", riskScore: 82, activity: "pesticide" }),
      signal({ householdId: "c", riskScore: 78, activity: "pesticide" }),
      signal({ householdId: "d", riskScore: 30, activity: "irrigation" }),
    ];
    const result = analyzeCluster(cluster, signals);
    expect(result.riskLevel).toBe("HIGH");
    expect(result.householdCount).toBe(4);
    expect(result.dominantSignals.map((s) => s.label)).toEqual(
      expect.arrayContaining(["High heat exposure", "Pesticide activity"]),
    );
    expect(result.recommendedAction).toContain("outreach");
  });

  it("raises a cluster when symptoms appear even at moderate risk", () => {
    const signals = [
      signal({ householdId: "a", riskScore: 45, reportedSymptom: true, activity: "pesticide" }),
      signal({ householdId: "b", riskScore: 40, reportedSymptom: true, activity: "pesticide" }),
      signal({ householdId: "c", riskScore: 30, activity: "irrigation" }),
    ];
    const result = analyzeCluster(cluster, signals);
    expect(result.elevatedCount).toBeGreaterThanOrEqual(2);
    expect(result.dominantSignals.some((s) => s.key === "symptoms")).toBe(true);
  });

  it("returns LOW for a quiet cluster", () => {
    const signals = [
      signal({ householdId: "a", riskScore: 22, activity: "irrigation" }),
      signal({ householdId: "b", riskScore: 25, activity: "irrigation" }),
    ];
    const result = analyzeCluster(cluster, signals);
    expect(result.riskLevel).toBe("LOW");
  });
});

describe("clusterScore", () => {
  it("scales with the elevated share", () => {
    expect(clusterScore(0, 0, 8)).toBe(0);
    expect(clusterScore(8, 0, 8)).toBe(100);
  });
  it("adds weight for a sizeable elevated group", () => {
    expect(clusterScore(4, 0, 8)).toBeGreaterThan(clusterScore(1, 0, 8));
  });
  it("adds weight for reported symptoms", () => {
    expect(clusterScore(2, 3, 8)).toBeGreaterThan(clusterScore(2, 0, 8));
  });
});
