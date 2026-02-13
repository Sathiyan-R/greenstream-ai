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

export interface ForecastData {
  city: string;
  avgTemp: number;
  maxTemp: number;
  humidity: number;
  windSpeed: number;
  clouds: number;
  condition: string;
  simulated: boolean;
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

export interface PredictionData {
  predictedEnergy: number;
  predictedCarbon: number;
  riskLevel: "Low" | "Medium" | "High";
  factors: string[];
}

const EMISSION_FACTOR = 0.82; // kgCO2 per kWh

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

export async function fetchForecast(city = "London"): Promise<ForecastData> {
  const { data, error } = await supabase.functions.invoke("weather-forecast", {
    body: { city },
  });
  if (error) throw error;
  return data as ForecastData;
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

export interface AnomalyAlert {
  buildingId: string;
  type: "energy_spike" | "aqi_high" | "solar_drop";
  value: number;
  message: string;
}

export function detectAnomalies(
  current: EnergyReading[],
  previous: EnergyReading[],
  rollingAvgUsage: number,
  aqi: number
): AnomalyAlert[] {
  const anomalies: AnomalyAlert[] = [];

  // Energy spike > 20% above rolling average
  current.forEach((c) => {
    const prev = previous.find((p) => p.buildingId === c.buildingId);
    if (rollingAvgUsage > 0) {
      const avgPerBuilding = rollingAvgUsage / 4;
      const spikePercent = ((c.energyUsage - avgPerBuilding) / avgPerBuilding) * 100;
      if (spikePercent > 20) {
        anomalies.push({
          buildingId: c.buildingId,
          type: "energy_spike",
          value: Math.round(spikePercent),
          message: `Energy spike +${Math.round(spikePercent)}% above rolling avg`,
        });
      }
    } else if (prev) {
      const change = ((c.energyUsage - prev.energyUsage) / prev.energyUsage) * 100;
      if (change > 20) {
        anomalies.push({
          buildingId: c.buildingId,
          type: "energy_spike",
          value: Math.round(change),
          message: `Energy spike +${Math.round(change)}% vs previous`,
        });
      }
    }

    // Solar drop > 30%
    if (prev && prev.solarProduction > 0) {
      const solarDrop = ((prev.solarProduction - c.solarProduction) / prev.solarProduction) * 100;
      if (solarDrop > 30) {
        anomalies.push({
          buildingId: c.buildingId,
          type: "solar_drop",
          value: Math.round(solarDrop),
          message: `Solar output dropped ${Math.round(solarDrop)}%`,
        });
      }
    }
  });

  // AQI > 4 (on the 1-5 IQAir scale, or >150 US AQI)
  if (aqi > 150) {
    anomalies.push({
      buildingId: "Environment",
      type: "aqi_high",
      value: aqi,
      message: `AQI dangerously high at ${aqi}`,
    });
  }

  return anomalies;
}

export function generatePrediction(
  forecast: ForecastData | null,
  currentAvgUsage: number,
  aqi: number
): PredictionData {
  let predictedEnergy = currentAvgUsage || 1800;
  const factors: string[] = [];
  let riskScore = 0;

  if (forecast) {
    // Temperature impact
    if (forecast.maxTemp > 32) {
      predictedEnergy *= 1.15;
      factors.push(`High temp (${forecast.maxTemp}°C) → +15% HVAC load`);
      riskScore += 2;
    } else if (forecast.maxTemp > 28) {
      predictedEnergy *= 1.08;
      factors.push(`Warm temp (${forecast.maxTemp}°C) → +8% cooling`);
      riskScore += 1;
    }

    // Cloud cover → solar impact
    if (forecast.clouds > 70) {
      factors.push(`High cloud cover (${forecast.clouds}%) → reduced solar`);
      riskScore += 1;
    }

    // Wind impact on renewable
    if (forecast.windSpeed > 6) {
      factors.push(`Strong wind (${forecast.windSpeed}m/s) → good for wind energy`);
      riskScore -= 1;
    }
  }

  // AQI impact
  if (aqi > 100) {
    factors.push(`Elevated AQI (${aqi}) → environmental risk`);
    riskScore += 2;
  }

  const predictedCarbon = predictedEnergy * EMISSION_FACTOR;
  const riskLevel: PredictionData["riskLevel"] =
    riskScore >= 3 ? "High" : riskScore >= 1 ? "Medium" : "Low";

  if (factors.length === 0) {
    factors.push("Conditions normal — no significant risk factors");
  }

  return {
    predictedEnergy: Math.round(predictedEnergy),
    predictedCarbon: Math.round(predictedCarbon),
    riskLevel,
    factors,
  };
}

export type DashboardState = {
  weather: WeatherData | null;
  airQuality: AirQualityData | null;
  forecast: ForecastData | null;
  energyReadings: EnergyReading[];
  carbon: CarbonData | null;
  anomalies: AnomalyAlert[];
  energyHistory: { time: string; usage: number; solar: number }[];
  sustainabilityScore: number;
  prediction: PredictionData | null;
  rollingAvgUsage: number;
};
