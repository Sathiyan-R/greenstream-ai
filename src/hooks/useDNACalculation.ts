import { useMemo } from "react";
import { ZoneData } from "@/types/map";

export interface DNATraits {
  heatRisk: number;
  pollutionPersistence: number;
  energyInstability: number;
  carbonDensity: number;
}

export interface EnvironmentalDNA {
  traits: DNATraits;
  grade: "A+" | "A" | "B" | "C" | "D";
  aggregateScore: number;
  weakestTrait: keyof DNATraits;
  zoneArea: number;
}

