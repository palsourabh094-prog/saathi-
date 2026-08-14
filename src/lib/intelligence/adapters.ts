import type {
  AgriAdapter,
  EnvironmentState,
  FarmPlanItem,
  HealthAdapter,
  SymptomReport,
  WeatherAdapter,
} from "@/lib/types";
import { RAMESH_HOUSEHOLD_ID, seedFarmPlan } from "@/lib/data/seed";
import { DEFAULT_ENV, HEATWAVE_ENV } from "@/lib/store";

/**
 * INTEROPERABILITY ADAPTERS
 * ---------------------------------------------------------------
 * Clean seams for future FHIR / ABDM (health) and AgriStack (agri)
 * integration. Today they are honest MOCK adapters — labelled as such,
 * never pretending a live integration exists.
 */

const latency = (ms = 350) => new Promise((r) => setTimeout(r, ms));

export const weatherAdapter: WeatherAdapter = {
  name: "WeatherAdapter (mock)",
  status: "mock",
  async getConditions(_village: string): Promise<EnvironmentState> {
    await latency();
    return { ...DEFAULT_ENV };
  },
};

export const heatwaveWeatherAdapter: WeatherAdapter = {
  name: "WeatherAdapter (mock · heatwave scenario)",
  status: "mock",
  async getConditions(_village: string): Promise<EnvironmentState> {
    await latency();
    return { ...HEATWAVE_ENV };
  },
};

export const healthAdapter: HealthAdapter = {
  name: "HealthAdapter (FHIR/ABDM-shaped mock)",
  status: "mock",
  async getVulnerabilitySignals(householdId: string): Promise<string[]> {
    await latency(200);
    if (householdId === RAMESH_HOUSEHOLD_ID) return [];
    return [];
  },
  async submitSymptom(_report: SymptomReport) {
    await latency(300);
    return { accepted: true };
  },
};

export const agriAdapter: AgriAdapter = {
  name: "AgriAdapter (AgriStack-shaped mock)",
  status: "mock",
  async getFarmPlan(_householdId: string): Promise<FarmPlanItem[]> {
    await latency(250);
    return seedFarmPlan.map((i) => ({ ...i }));
  },
  async recordActivity(_householdId: string, _item: FarmPlanItem) {
    await latency(200);
    return { accepted: true };
  },
};

/** Documented in developer docs as sandbox/mock integration. */
export const ADAPTER_STATUS = {
  weather: "mock",
  health: "mock",
  agri: "mock",
} as const;
