import type { FarmPlanItem, Household } from "@/lib/types";

/**
 * SEEDED DEMO DATA — all synthetic, fictional village.
 * No real people's private data is used anywhere in this prototype.
 */

export const VILLAGE = "Dharampura";
export const DISTRICT = "Fictional District";
export const RAMESH_HOUSEHOLD_ID = "hh-ramesh";

export const RAMESH_ID = "ramesh";

export interface ClusterDef {
  id: string;
  name: string;
  x: number;
  y: number;
}

export const CLUSTERS: ClusterDef[] = [
  { id: "north-field", name: "North Field Cluster", x: 68, y: 26 },
  { id: "east-well", name: "East Well Cluster", x: 82, y: 58 },
  { id: "riverside", name: "Riverside Cluster", x: 30, y: 70 },
  { id: "market-road", name: "Market Road Cluster", x: 46, y: 34 },
];

export const seedFarmPlan: FarmPlanItem[] = [
  {
    id: "fp-1",
    activity: "irrigation",
    hour: 6,
    durationMin: 60,
    adapted: false,
  },
  {
    id: "fp-2",
    activity: "fertilizer",
    hour: 10,
    durationMin: 45,
    adapted: false,
  },
  {
    id: "fp-3",
    activity: "pesticide",
    hour: 13,
    durationMin: 150,
    adapted: false,
  },
  {
    id: "fp-4",
    activity: "field-work",
    hour: 15,
    durationMin: 120,
    adapted: false,
  },
];

const member = (
  id: string,
  name: string,
  age: number,
  relation: string,
  workingInFarm: boolean,
  vulnerabilities: string[] = [],
) => ({ id, name, age, relation, workingInFarm, vulnerabilities });

function makeHousehold(
  id: string,
  headName: string,
  clusterId: string,
  crop: string,
  acres: number,
  workload: number,
  opts: Partial<Household["consent"]> = {},
): Household {
  return {
    id,
    headName,
    clusterId,
    village: VILLAGE,
    members: [
      member(`${id}-m1`, headName, 42, "Head", true),
      member(`${id}-m2`, "Spouse", 38, "Spouse", false),
    ],
    farm: { crop, acres, workload },
    consent: {
      healthSharing: true,
      agriSharing: true,
      communityAnalytics: true,
      lastUpdated: "2026-08-01",
      ...opts,
    },
  };
}

export const seedHouseholds: Household[] = [
  {
    id: RAMESH_HOUSEHOLD_ID,
    headName: "Ramesh Kumar",
    clusterId: "north-field",
    village: VILLAGE,
    members: [
      member(RAMESH_ID, "Ramesh Kumar", 42, "Head", true),
      member("hh-ramesh-m2", "Sunita Devi", 39, "Spouse", false),
      member("hh-ramesh-m3", "Arjun", 16, "Son", true),
    ],
    farm: { crop: "Cotton", acres: 2, workload: 55 },
    consent: {
      healthSharing: true,
      agriSharing: true,
      communityAnalytics: true,
      lastUpdated: "2026-08-01",
    },
  },
  makeHousehold("hh-02", "Sita Devi", "north-field", "Cotton", 1.5, 50),
  makeHousehold("hh-03", "Mahesh Patel", "north-field", "Cotton", 3, 60),
  makeHousehold("hh-04", "Gopal Yadav", "north-field", "Cotton", 2, 55),
  makeHousehold("hh-05", "Lakshmi Bai", "north-field", "Cotton", 1, 45),
  makeHousehold("hh-06", "Ravi Shankar", "market-road", "Cotton", 2.5, 58),
  makeHousehold("hh-07", "Kamla Wati", "market-road", "Cotton", 1.5, 48),
  makeHousehold("hh-08", "Suresh Meena", "market-road", "Cotton", 2, 52),
  makeHousehold("hh-09", "Dinesh Verma", "east-well", "Sugarcane", 4, 62),
  makeHousehold("hh-10", "Radha Sharma", "east-well", "Sugarcane", 3, 55),
  makeHousehold("hh-11", "Om Prakash", "east-well", "Sugarcane", 2.5, 50),
  makeHousehold("hh-12", "Pooja Kumari", "east-well", "Vegetables", 1, 40),
  makeHousehold("hh-13", "Harish Jat", "east-well", "Sugarcane", 5, 65),
  makeHousehold("hh-14", "Meera Ben", "east-well", "Vegetables", 1.5, 42),
  makeHousehold("hh-15", "Vijay Singh", "east-well", "Sugarcane", 3.5, 58),
  makeHousehold("hh-16", "Anita Devi", "east-well", "Vegetables", 0.75, 35),
  makeHousehold("hh-17", "Sanjay Gupta", "riverside", "Paddy", 2, 48),
  makeHousehold("hh-18", "Usha Rani", "riverside", "Paddy", 1.5, 44),
  makeHousehold("hh-19", "Kishan Lal", "riverside", "Paddy", 3, 52),
  makeHousehold("hh-20", "Mamta Devi", "riverside", "Paddy", 1, 40),
  makeHousehold("hh-21", "Rakesh Kumar", "riverside", "Paddy", 2.5, 50),
  makeHousehold("hh-22", "Geeta Sharma", "riverside", "Vegetables", 1, 38),
  makeHousehold("hh-23", "Ashok Mishra", "riverside", "Paddy", 4, 55),
  makeHousehold("hh-24", "Pinki Devi", "riverside", "Vegetables", 0.5, 32),
  makeHousehold("hh-25", "Ramu Bhai", "market-road", "Wheat", 2, 46),
  makeHousehold("hh-26", "Shanti Devi", "market-road", "Wheat", 1.5, 42),
  makeHousehold("hh-27", "Mohan Lal", "market-road", "Mustard", 2, 44),
  makeHousehold("hh-28", "Kavita Ben", "market-road", "Wheat", 1, 38),
  makeHousehold("hh-29", "Prakash Chandra", "market-road", "Mustard", 3, 50),
  makeHousehold("hh-30", "Rekha Devi", "market-road", "Wheat", 1.5, 40),
  makeHousehold("hh-31", "Sohan Singh", "market-road", "Wheat", 2.5, 48),
  makeHousehold("hh-32", "Nirmala Devi", "market-road", "Vegetables", 1, 36),
  makeHousehold("hh-33", "Balram Das", "north-field", "Cotton", 2, 54),
  makeHousehold("hh-34", "Savitri Bai", "north-field", "Cotton", 1, 42),
  makeHousehold("hh-35", "Jitendra Kumar", "east-well", "Sugarcane", 3, 56),
  makeHousehold("hh-36", "Pushpa Devi", "riverside", "Paddy", 2, 46),
  makeHousehold("hh-37", "Naresh Patel", "market-road", "Mustard", 2.5, 47),
  makeHousehold("hh-38", "Sunita Sharma", "north-field", "Cotton", 1.5, 45),
  makeHousehold("hh-39", "Devraj Meena", "east-well", "Sugarcane", 2, 48),
  makeHousehold("hh-40", "Rukmini Devi", "riverside", "Paddy", 1.5, 41),
];

export const WORKER_PROFILE = {
  id: "worker-asha-1",
  name: "Anjali Devi",
  designation: "ASHA Worker",
  village: VILLAGE,
};

export const AGRI_PROFILE = {
  id: "agri-1",
  name: "Vikram Singh",
  designation: "Krishi Extension Officer",
  village: VILLAGE,
};

export const RAMESH_PROFILE = {
  id: RAMESH_ID,
  name: "Ramesh Kumar",
  village: VILLAGE,
};
