import { describe, expect, it } from "vitest";
import {
  evaluateRisk,
  heatPoints,
  humidityPoints,
  recommendedWindowFor,
  riskLevelFor,
  durationPoints,
  timeOfDayPoints,
} from "@/lib/intelligence/individual-risk";

describe("heatPoints", () => {
  it("is 0 below 28°C", () => {
    expect(heatPoints(27)).toBe(0);
    expect(heatPoints(28)).toBe(0);
  });
  it("scales with temperature above 28°C", () => {
    expect(heatPoints(39)).toBe(30);
    expect(heatPoints(41)).toBeGreaterThan(heatPoints(39));
  });
  it("caps at 45", () => {
    expect(heatPoints(60)).toBeLessThanOrEqual(45);
  });
});

describe("humidityPoints", () => {
  it("is 0 at or below 55%", () => {
    expect(humidityPoints(55)).toBe(0);
  });
  it("scales above 55% and caps at 30", () => {
    expect(humidityPoints(74)).toBe(16);
    expect(humidityPoints(95)).toBeLessThanOrEqual(30);
  });
});

describe("durationPoints / timeOfDayPoints", () => {
  it("ignores short work and adds fatigue beyond 90 minutes", () => {
    expect(durationPoints(60)).toBe(0);
    expect(durationPoints(150)).toBe(12);
  });
  it("adds points only during 12:00–16:00", () => {
    expect(timeOfDayPoints(13)).toBe(5);
    expect(timeOfDayPoints(9)).toBe(0);
  });
});

describe("riskLevelFor", () => {
  it("maps score bands to levels", () => {
    expect(riskLevelFor(20)).toBe("LOW");
    expect(riskLevelFor(40)).toBe("MODERATE");
    expect(riskLevelFor(65)).toBe("HIGH");
    expect(riskLevelFor(87)).toBe("HIGH");
    expect(riskLevelFor(90)).toBe("SEVERE");
  });
});

describe("evaluateRisk — canonical Ramesh scenario", () => {
  it("computes 87 HIGH for pesticide at 1 PM during the heatwave", () => {
    const r = evaluateRisk({
      activity: "pesticide",
      hour: 13,
      durationMin: 150,
      temperature: 39,
      humidity: 74,
    });
    expect(r.riskScore).toBe(87);
    expect(r.riskLevel).toBe("HIGH");
    // Transparent drivers: heat + humidity + exposure + duration + afternoon
    expect(r.drivers.map((d) => d.key)).toEqual(
      expect.arrayContaining(["heat", "humidity", "exposure", "duration", "time-of-day"]),
    );
  });

  it("is far lower in the evening", () => {
    const r = evaluateRisk({
      activity: "pesticide",
      hour: 17,
      durationMin: 150,
      temperature: 34,
      humidity: 66,
    });
    expect(r.riskScore).toBeLessThan(65);
    expect(r.riskLevel).not.toBe("HIGH");
  });

  it("recommends the 5 PM – 7:30 PM window in heatwave conditions", () => {
    const w = recommendedWindowFor({
      activity: "pesticide",
      hour: 9,
      durationMin: 150,
      temperature: 39,
      humidity: 74,
      hourlyTemp: { 6: 28, 8: 31.5, 10: 34, 12: 37, 13: 39, 15: 39, 17: 34, 19: 31 },
      hourlyHumidity: { 6: 88, 8: 80, 10: 74, 12: 70, 13: 74, 15: 72, 17: 66, 19: 68 },
    });
    expect(w.label).toBe("5:00 PM – 7:30 PM");
  });

  it("includes an honest disclaimer", () => {
    const r = evaluateRisk({
      activity: "pesticide",
      hour: 13,
      durationMin: 150,
      temperature: 39,
      humidity: 74,
    });
    expect(r.disclaimer).toContain("Not a medical diagnosis");
  });

  it("adds vulnerability points for known signals", () => {
    const r = evaluateRisk({
      activity: "field-work",
      hour: 9,
      durationMin: 60,
      temperature: 30,
      humidity: 60,
      vulnerabilitySignals: ["hypertension", "age-over-55"],
    });
    expect(r.riskScore).toBeGreaterThan(0);
  });
});
