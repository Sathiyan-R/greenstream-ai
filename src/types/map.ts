

export type MapMode = "temperature" | "aqi" | "energy" | "sustainability";

export interface ZoneData {
  id: string;
  zone_name: string;
  zone_region: string;
  latitude: number;
  longitude: number;
  temperature: number;
  humidity?: number;
  aqi: number;
  energy_consumption: number;
  energy_variance?: number;
  carbon_emission: number;
  sustainability_score: number;
  trend_temperature: string;
  trend_aqi: string;
  trend_energy: string;
  prediction_tomorrow: string;
  ai_suggestion: string;
  last_updated: string;
  wind_speed?: number;
  zone_area?: number;
  
  name?: string;
  lat?: number;
  lng?: number;
  energy?: number;
  carbon?: number;
  area?: string;
}

export interface MapLegendItem {
  color: string;
  label: string;
  range: string;
}

export interface AIInsight {
  zoneId: string;
  zoneName: string;
  insight: string;
  recommendations: string[];
  severity: "low" | "medium" | "high";
  metrics: {
    temperature: number;
    aqi: number;
    energy: number;
    carbon: number;
  };
}
