// Map-related type definitions

export type MapMode = "temperature" | "aqi" | "energy";

export interface ZoneData {
  id: string;
  name: string;
  lat: number;
  lng: number;
  temperature: number; // Celsius
  aqi: number; // 0-500
  energy: number; // kWh
  carbon: number; // kg CO2
  population?: number;
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
