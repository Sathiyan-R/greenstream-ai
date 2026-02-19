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

/**
 * Calculate Environmental DNA Profile for a zone
 * Zone area is estimated in km² (smaller areas weighted higher)
 */
export const useDNACalculation = (zone: ZoneData | null): EnvironmentalDNA | null => {
  return useMemo(() => {
    if (!zone) return null;

    // 🌡️ Heat Vulnerability Index
    // Higher humidity + high temperature = more heat stress
    const humidity = zone.humidity || 65; // Default to 65% if not provided
    const heatIndex = zone.temperature * (1 + humidity / 100);
    // Normalize to 0-100 scale (critical at 50+)
    const heatRisk = Math.min(100, (heatIndex / 50) * 100);

    // 🌫️ Pollution Persistence Index
    // Higher AQI + lower wind speed = pollution lingers longer
    const windSpeed = zone.wind_speed || 8; // Default to 8 km/h
    const pollutionIndex = zone.aqi / (windSpeed + 1);
    // Normalize to 0-100 scale (critical at 20+)
    const pollutionPersistence = Math.min(100, (pollutionIndex / 20) * 100);

    // ⚡ Energy Instability Index
    // Variance in energy consumption or high absolute consumption
    const baseEnergy = zone.energy_consumption || 500;
    const energyVariance = zone.energy_variance || baseEnergy * 0.15; // 15% default variance
    // Calculate instability as coefficient of variation
    const energyInstability = Math.min(100, (energyVariance / (baseEnergy || 1)) * 100);

    // 🔋 Carbon Density Index
    // Carbon emissions normalized by zone area
    // Estimate zone area: small, medium, large zones
    const zoneArea = zone.zone_area || 50; // Default zone area in km²
    const carbonEmission = zone.carbon_emission || 400;
    const carbonDensity = Math.min(100, (carbonEmission / (zoneArea * 5)) * 100);

    // Normalize all traits to 0-100
    const traits: DNATraits = {
      heatRisk: Math.max(0, Math.min(100, heatRisk)),
      pollutionPersistence: Math.max(0, Math.min(100, pollutionPersistence)),
      energyInstability: Math.max(0, Math.min(100, energyInstability)),
      carbonDensity: Math.max(0, Math.min(100, carbonDensity)),
    };

    // Calculate aggregate score (average of all traits)
    const aggregateScore = Math.round(
      (traits.heatRisk + traits.pollutionPersistence + traits.energyInstability + traits.carbonDensity) / 4
    );

    // Assign grade based on aggregate score
    let grade: "A+" | "A" | "B" | "C" | "D";
    if (aggregateScore >= 90) {
      grade = "A+";
    } else if (aggregateScore >= 75) {
      grade = "A";
    } else if (aggregateScore >= 60) {
      grade = "B";
    } else if (aggregateScore >= 45) {
      grade = "C";
    } else {
      grade = "D";
    }

    // Find weakest trait
    const traitEntries = Object.entries(traits) as [keyof DNATraits, number][];
    const weakestTrait = traitEntries.reduce((prev, curr) =>
      curr[1] > prev[1] ? curr : prev
    )[0];

    return {
      traits,
      grade,
      aggregateScore,
      weakestTrait,
      zoneArea,
    };
  }, [zone]);
};

/**
 * Get risk level color for a trait value
 */
export const getRiskColor = (value: number): string => {
  if (value >= 75) return "text-red-500"; // Critical
  if (value >= 50) return "text-orange-500"; // High
  if (value >= 25) return "text-yellow-500"; // Moderate
  return "text-green-500"; // Low
};

/**
 * Get risk level background for a trait value
 */
export const getRiskBgColor = (value: number): string => {
  if (value >= 75) return "bg-red-500/20 border-red-500/50"; // Critical
  if (value >= 50) return "bg-orange-500/20 border-orange-500/50"; // High
  if (value >= 25) return "bg-yellow-500/20 border-yellow-500/50"; // Moderate
  return "bg-green-500/20 border-green-500/50"; // Low
};

/**
 * Get severity level based on trait value
 */
export const getSeverityLevel = (value: number): "critical" | "high" | "moderate" | "low" => {
  if (value >= 75) return "critical";
  if (value >= 50) return "high";
  if (value >= 25) return "moderate";
  return "low";
};

/**
 * Trait label and description
 */
export const traitMetadata = {
  heatRisk: {
    label: "Heat Risk",
    description: "Temperature × Humidity Index",
    icon: "🌡️",
  },
  pollutionPersistence: {
    label: "Pollution Persistence",
    description: "AQI ÷ Wind Speed",
    icon: "🌫️",
  },
  energyInstability: {
    label: "Energy Instability",
    description: "Energy Consumption Variance",
    icon: "⚡",
  },
  carbonDensity: {
    label: "Carbon Density",
    description: "Emissions per km²",
    icon: "🔋",
  },
};
