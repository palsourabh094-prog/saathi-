import { describe, expect, it } from "vitest";
import {
  computeResilience,
  environmentalPressure,
} from "@/lib/intelligence/household-resilience";
import { DEFAULT_ENV, HEATWAVE_ENV } from "@/lib/store";

const workloadPressure = 75;
const workforceBuffer = 60;

describe("environmentalPressure", () => {
  it("is moderate on a normal day and high in a heatwave", () => {
    expect(environmentalPressure(DEFAULT_ENV)).toBeLessThan(40);
    expect(environmentalPressure(HEATWAVE_ENV)).toBeGreaterThanOrEqual(70);
  });
});

describe("computeResilience — canonical Ramesh scenario", () => {
  it("starts at 78/100 on a normal day", () => {
    const r = computeResilience({
      env: DEFAULT_ENV,
      healthPressure: 0,
      workloadPressure,
      workforceBuffer,
    });
    expect(r.score).toBe(78);
    expect(r.level).toBe("stable");
  });

  it("drops to 64/100 and trends declining in a heatwave", () => {
    const r = computeResilience({
      env: HEATWAVE_ENV,
      healthPressure: 0,
      workloadPressure,
      workforceBuffer,
      previousScore: 78,
    });
    expect(r.score).toBe(64);
    expect(r.level).toBe("declining");
  });

  it("exposes primary drivers, not the whole formula", () => {
    const r = computeResilience({
      env: HEATWAVE_ENV,
      healthPressure: 0,
      workloadPressure,
      workforceBuffer,
    });
    expect(r.drivers.length).toBeGreaterThan(0);
    expect(r.drivers.map((d) => d.label)).toEqual(
      expect.arrayContaining(["High heat", "High farm workload"]),
    );
  });

  it("drops further when a symptom is reported", () => {
    const withSymptom = computeResilience({
      env: HEATWAVE_ENV,
      healthPressure: 40,
      workloadPressure,
      workforceBuffer,
      previousScore: 78,
    });
    expect(withSymptom.score).toBeLessThan(64);
    expect(withSymptom.level).toBe("declining");
  });
});
