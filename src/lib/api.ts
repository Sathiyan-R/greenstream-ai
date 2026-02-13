import { supabase } from "@/integrations/supabase/client";

export interface WeatherData {
  city: string;
  temperature: number;
  humidity: number;
  condition: string;
  description: string;
  wind_speed: number;
  clouds: number;
}

export interface AirQualityData {
  city: string;
  aqi: number;
  main_pollutant: string;
  temperature: number;
  humidity: number;
  wind_speed: number;
}

export interface EnergyReading {
  buildingId: string;
  energyUsage: number;
  solarProduction: number;
  trafficIndex: number;
  timestamp: number;
}

export interface CarbonData {
  totalEmissions: number;
  emissionsByBuilding: { buildingId: string; emissions: number }[];
}

const EMISSION_FACTOR = 0.42; // kgCO2 per kWh

export async function fetchWeather(city = "London"): Promise<WeatherData> {
  const { data, error } = await supabase.functions.invoke("weather", {
    body: { city },
  });
  if (error) throw error;
  return data as WeatherData;
}

export async function fetchAirQuality(
  city = "London",
  state = "England",
  country = "UK"
): Promise<AirQualityData> {
  const { data, error } = await supabase.functions.invoke("air-quality", {
    body: { city, state, country },
  });
  if (error) throw error;
  return data as AirQualityData;
}

export function generateEnergyReading(): EnergyReading[] {
  const buildings = ["Building A", "Building B", "Building C", "Building D"];
  return buildings.map((buildingId) => ({
    buildingId,
    energyUsage: 200 + Math.random() * 600,
    solarProduction: 50 + Math.random() * 200,
    trafficIndex: Math.random() * 100,
    timestamp: Date.now(),
  }));
}

export function calculateCarbon(readings: EnergyReading[]): CarbonData {
  const emissionsByBuilding = readings.map((r) => ({
    buildingId: r.buildingId,
    emissions: (r.energyUsage - r.solarProduction * 0.3) * EMISSION_FACTOR,
  }));
  return {
    totalEmissions: emissionsByBuilding.reduce((s, b) => s + b.emissions, 0),
    emissionsByBuilding,
  };
}

export function detectAnomalies(
  current: EnergyReading[],
  previous: EnergyReading[]
): { buildingId: string; spike: number }[] {
  const anomalies: { buildingId: string; spike: number }[] = [];
  current.forEach((c) => {
    const prev = previous.find((p) => p.buildingId === c.buildingId);
    if (prev) {
      const change = ((c.energyUsage - prev.energyUsage) / prev.energyUsage) * 100;
      if (change > 20) {
        anomalies.push({ buildingId: c.buildingId, spike: Math.round(change) });
      }
    }
  });
  return anomalies;
}

export type DashboardState = {
  weather: WeatherData | null;
  airQuality: AirQualityData | null;
  energyReadings: EnergyReading[];
  carbon: CarbonData | null;
  anomalies: { buildingId: string; spike: number }[];
  energyHistory: { time: string; usage: number; solar: number }[];
  sustainabilityScore: number;
};
