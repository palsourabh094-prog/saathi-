import { describe, expect, it } from "vitest";
import { adaptFarmPlan } from "@/lib/intelligence/adaptive-plan";
import { HEATWAVE_ENV, DEFAULT_ENV } from "@/lib/store";
import { seedFarmPlan } from "@/lib/data/seed";

describe("adaptFarmPlan", () => {
  it("keeps the plan untouched on a normal day", () => {
    const plan = adaptFarmPlan(seedFarmPlan, DEFAULT_ENV);
    expect(plan.every((i) => i.status === "ok")).toBe(true);
    expect(plan.some((i) => i.activity === "pesticide" && i.hour === 13)).toBe(true);
  });

  it("flags the 1 PM pesticide slot and adds a safer 5 PM window during a heatwave", () => {
    const plan = adaptFarmPlan(seedFarmPlan, HEATWAVE_ENV);
    const flagged = plan.find((i) => i.status === "flagged");
    const moved = plan.find((i) => i.status === "moved");

    expect(flagged?.activity).toBe("pesticide");
    expect(flagged?.hour).toBe(13);
    expect(flagged?.riskLevel).toBe("HIGH");
    expect(flagged?.why).toBeTruthy();

    expect(moved?.activity).toBe("pesticide");
    expect(moved?.hour).toBe(17);
    expect(moved?.originalHour).toBe(13);
    expect(moved?.adapted).toBe(true);
  });

  it("explains the move in the Why disclosure", () => {
    const plan = adaptFarmPlan(seedFarmPlan, HEATWAVE_ENV);
    const moved = plan.find((i) => i.status === "moved");
    expect(moved?.why).toContain("5:00 PM – 7:30 PM");
    expect(moved?.why).toContain("safer work window");
  });

  it("sorts the day chronologically", () => {
    const plan = adaptFarmPlan(seedFarmPlan, HEATWAVE_ENV);
    const hours = plan.map((i) => i.hour);
    expect(hours).toEqual([...hours].sort((a, b) => a - b));
  });
});
