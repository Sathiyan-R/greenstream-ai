import { ZoneData, AIInsight } from "@/types/map";
import { WeatherData, AirQualityData, EnergyReading, CarbonData } from "@/lib/api";

// Chennai zones base data with coordinates and areas
const chennaiZonesBase: ZoneData[] = [
  {
    id: "zone-1",
    zone_name: "T. Nagar",
    zone_region: "Commercial Hub",
    latitude: 13.0418,
    longitude: 80.2341,
    temperature: 32,
    humidity: 72,
    aqi: 145,
    energy_consumption: 850,
    energy_variance: 127,
    carbon_emission: 697,
    sustainability_score: 54,
    wind_speed: 6,
    zone_area: 45,
    trend_temperature: "↑",
    trend_aqi: "↓",
    trend_energy: "→",
    prediction_tomorrow: "Stable conditions expected",
    ai_suggestion: "Monitor energy consumption closely",
    last_updated: new Date().toISOString(),
    name: "T. Nagar",
    lat: 13.0418,
    lng: 80.2341,
    energy: 850,
    carbon: 697,
    area: "Commercial Hub",
  },
  {
    id: "zone-2",
    zone_name: "Anna Nagar",
    zone_region: "Residential",
    latitude: 13.0850,
    longitude: 80.2101,
    temperature: 31,
    humidity: 68,
    aqi: 98,
    energy_consumption: 620,
    energy_variance: 93,
    carbon_emission: 508.4,
    sustainability_score: 72,
    wind_speed: 10,
    zone_area: 55,
    trend_temperature: "→",
    trend_aqi: "↓",
    trend_energy: "↓",
    prediction_tomorrow: "Air quality improving",
    ai_suggestion: "Maintain current sustainable practices",
    last_updated: new Date().toISOString(),
    name: "Anna Nagar",
    lat: 13.0850,
    lng: 80.2101,
    energy: 620,
    carbon: 508.4,
    area: "Residential",
  },
  {
    id: "zone-3",
    zone_name: "Velachery",
    zone_region: "Mixed Development",
    latitude: 12.9750,
    longitude: 80.2200,
    temperature: 33,
    humidity: 75,
    aqi: 132,
    energy_consumption: 720,
    energy_variance: 108,
    carbon_emission: 590.4,
    sustainability_score: 61,
    wind_speed: 7,
    zone_area: 48,
    trend_temperature: "↑",
    trend_aqi: "→",
    trend_energy: "↑",
    prediction_tomorrow: "Monitor energy usage",
    ai_suggestion: "Consider energy efficiency measures",
    last_updated: new Date().toISOString(),
    name: "Velachery",
    lat: 12.9750,
    lng: 80.2200,
    energy: 720,
    carbon: 590.4,
    area: "Mixed Development",
  },
  {
    id: "zone-4",
    zone_name: "OMR (Thoraipakkam)",
    zone_region: "IT Corridor",
    latitude: 12.9407,
    longitude: 80.2329,
    temperature: 35,
    humidity: 70,
    aqi: 168,
    energy_consumption: 1250,
    energy_variance: 187,
    carbon_emission: 1025,
    sustainability_score: 42,
    wind_speed: 8,
    zone_area: 60,
    trend_temperature: "↑",
    trend_aqi: "↑",
    trend_energy: "↑",
    prediction_tomorrow: "Critical: Intervention required",
    ai_suggestion: "Implement renewable energy solutions urgently",
    last_updated: new Date().toISOString(),
    name: "OMR (Thoraipakkam)",
    lat: 12.9407,
    lng: 80.2329,
    energy: 1250,
    carbon: 1025,
    area: "IT Corridor",
  },
  {
    id: "zone-5",
    zone_name: "Adyar",
    zone_region: "Coastal Residential",
    latitude: 13.0067,
    longitude: 80.2570,
    temperature: 30,
    humidity: 65,
    aqi: 85,
    energy_consumption: 450,
    energy_variance: 67,
    carbon_emission: 369,
    sustainability_score: 81,
    wind_speed: 14,
    zone_area: 50,
    trend_temperature: "→",
    trend_aqi: "↓",
    trend_energy: "↓",
    prediction_tomorrow: "Excellent conditions expected",
    ai_suggestion: "Continue sustainable practices",
    last_updated: new Date().toISOString(),
    name: "Adyar",
    lat: 13.0067,
    lng: 80.2570,
    energy: 450,
    carbon: 369,
    area: "Coastal Residential",
  },
  {
    id: "zone-6",
    zone_name: "Tambaram",
    zone_region: "Industrial",
    latitude: 12.9249,
    longitude: 80.1000,
    temperature: 34,
    humidity: 71,
    aqi: 178,
    energy_consumption: 890,
    energy_variance: 133,
    carbon_emission: 729.8,
    sustainability_score: 38,
    wind_speed: 5,
    zone_area: 42,
    trend_temperature: "↑",
    trend_aqi: "↑",
    trend_energy: "→",
    prediction_tomorrow: "Air quality may worsen",
    ai_suggestion: "Urgent emission control measures needed",
    last_updated: new Date().toISOString(),
    name: "Tambaram",
    lat: 12.9249,
    lng: 80.1000,
    energy: 890,
    carbon: 729.8,
    area: "Industrial",
  },
  {
    id: "zone-7",
    zone_name: "Mylapore",
    zone_region: "Heritage & Coastal",
    latitude: 13.0339,
    longitude: 80.2619,
    temperature: 29,
    humidity: 63,
    aqi: 72,
    energy_consumption: 380,
    energy_variance: 57,
    carbon_emission: 311.6,
    sustainability_score: 85,
    wind_speed: 12,
    zone_area: 52,
    trend_temperature: "→",
    trend_aqi: "↓",
    trend_energy: "→",
    prediction_tomorrow: "Outstanding sustainability",
    ai_suggestion: "Model zone for best practices",
    last_updated: new Date().toISOString(),
    name: "Mylapore",
    lat: 13.0339,
    lng: 80.2619,
    energy: 380,
    carbon: 311.6,
    area: "Heritage & Coastal",
  },
  {
    id: "zone-8",
    zone_name: "Guindy",
    zone_region: "Industrial Park",
    latitude: 13.0067,
    longitude: 80.2206,
    temperature: 32,
    humidity: 70,
    aqi: 125,
    energy_consumption: 680,
    energy_variance: 102,
    carbon_emission: 557.6,
    sustainability_score: 65,
    wind_speed: 7,
    zone_area: 40,
    trend_temperature: "→",
    trend_aqi: "→",
    trend_energy: "↑",
    prediction_tomorrow: "Moderate conditions",
    ai_suggestion: "Optimize industrial processes",
    last_updated: new Date().toISOString(),
    name: "Guindy",
    lat: 13.0067,
    lng: 80.2206,
    energy: 680,
    carbon: 557.6,
    area: "Industrial Park",
  },
  {
    id: "zone-9",
    zone_name: "Porur",
    zone_region: "Suburban Residential",
    latitude: 13.0358,
    longitude: 80.1559,
    temperature: 33,
    humidity: 73,
    aqi: 155,
    energy_consumption: 750,
    energy_variance: 112,
    carbon_emission: 615,
    sustainability_score: 52,
    wind_speed: 6,
    zone_area: 44,
    trend_temperature: "↑",
    trend_aqi: "→",
    trend_energy: "↑",
    prediction_tomorrow: "Monitor closely",
    ai_suggestion: "Implement green infrastructure",
    last_updated: new Date().toISOString(),
    name: "Porur",
    lat: 13.0358,
    lng: 80.1559,
    energy: 750,
    carbon: 615,
    area: "Suburban Residential",
  },
  {
    id: "zone-10",
    zone_name: "Nungambakkam",
    zone_region: "Urban Core",
    latitude: 13.0569,
    longitude: 80.2424,
    temperature: 31,
    humidity: 69,
    aqi: 110,
    energy_consumption: 560,
    energy_variance: 84,
    carbon_emission: 459.2,
    sustainability_score: 68,
    wind_speed: 9,
    zone_area: 46,
    trend_temperature: "→",
    trend_aqi: "↓",
    trend_energy: "→",
    prediction_tomorrow: "Good conditions",
    ai_suggestion: "Continue monitoring",
    last_updated: new Date().toISOString(),
    name: "Nungambakkam",
    lat: 13.0569,
    lng: 80.2424,
    energy: 560,
    carbon: 459.2,
    area: "Urban Core",
  },
  {
    id: "zone-11",
    zone_name: "ECR (Palavakkam)",
    zone_region: "Coastal Tourist",
    latitude: 12.9698,
    longitude: 80.2549,
    temperature: 28,
    humidity: 62,
    aqi: 65,
    energy_consumption: 320,
    energy_variance: 48,
    carbon_emission: 262.4,
    sustainability_score: 88,
    wind_speed: 15,
    zone_area: 58,
    trend_temperature: "→",
    trend_aqi: "↓",
    trend_energy: "↓",
    prediction_tomorrow: "Excellent",
    ai_suggestion: "Maintain eco-tourism standards",
    last_updated: new Date().toISOString(),
    name: "ECR (Palavakkam)",
    lat: 12.9698,
    lng: 80.2549,
    energy: 320,
    carbon: 262.4,
    area: "Coastal Tourist",
  },
  {
    id: "zone-12",
    zone_name: "Ambattur",
    zone_region: "Industrial Estate",
    latitude: 13.1143,
    longitude: 80.1548,
    temperature: 34,
    humidity: 72,
    aqi: 185,
    energy_consumption: 920,
    energy_variance: 138,
    carbon_emission: 754.4,
    sustainability_score: 35,
    wind_speed: 4,
    zone_area: 38,
    trend_temperature: "↑",
    trend_aqi: "↑",
    trend_energy: "↑",
    prediction_tomorrow: "Critical levels detected",
    ai_suggestion: "Immediate pollution control required",
    last_updated: new Date().toISOString(),
    name: "Ambattur",
    lat: 13.1143,
    lng: 80.1548,
    energy: 920,
    carbon: 754.4,
    area: "Industrial Estate",
  },
];

// Export static zones for fallback
export const chennaiZones = chennaiZonesBase;

// Update zones with real-time API data
export const updateZonesWithLiveData = (
  weather: WeatherData | null,
  airQuality: AirQualityData | null,
  energyReadings: EnergyReading[],
  carbonData: CarbonData | null
): ZoneData[] => {
  const totalEnergy = energyReadings.reduce((sum, r) => sum + r.energyUsage, 0);
  const totalCarbon = carbonData?.totalEmissions || 0;
  
  // Add some variation to distribute data across zones
  return chennaiZonesBase.map((zone, index) => {
    // Use base temperature from zone, but adjust with API data if available
    const baseTemp = zone.temperature;
    const apiTemp = weather?.temperature || baseTemp;
    const variation = (index % 3 - 1) * 2; // -2, 0, or +2 degrees variation
    const temperature = Math.round(apiTemp + variation);
    
    // Use API AQI with zone-specific variation
    const baseAqi = zone.aqi;
    const apiAqi = airQuality?.aqi || baseAqi;
    const aqiVariation = (index % 5 - 2) * 15; // Variation between zones
    const aqi = Math.max(0, Math.round(apiAqi + aqiVariation));
    
    // Distribute total energy across zones based on area type
    const energyMultiplier = zone.area?.includes("Industrial") ? 1.3 :
                            zone.area?.includes("IT") ? 1.4 :
                            zone.area?.includes("Commercial") ? 1.2 :
                            zone.area?.includes("Coastal") ? 0.6 : 1.0;
    
    const zoneEnergy = energyReadings[index % energyReadings.length]?.energyUsage || zone.energy;
    const energy = Math.round(zoneEnergy * energyMultiplier);
    
    // Calculate carbon based on energy (0.82 kg CO2 per kWh)
    const carbon = Math.round(energy * 0.82);
    
    return {
      ...zone,
      temperature,
      aqi,
      energy,
      carbon
    };
  });
};

// Color mapping functions
export const getTemperatureColor = (temp: number): string => {
  if (temp >= 35) return "#ef4444"; // red-500
  if (temp >= 33) return "#f97316"; // orange-500
  if (temp >= 31) return "#f59e0b"; // amber-500
  if (temp >= 29) return "#eab308"; // yellow-500
  return "#22c55e"; // green-500
};

export const getAQIColor = (aqi: number): string => {
  if (aqi >= 151) return "#7c3aed"; // violet-600 (Unhealthy)
  if (aqi >= 101) return "#ef4444"; // red-500 (Unhealthy for Sensitive)
  if (aqi >= 51) return "#f59e0b"; // amber-500 (Moderate)
  return "#22c55e"; // green-500 (Good)
};

export const getEnergyColor = (energy: number): string => {
  if (energy >= 1000) return "#dc2626"; // red-600
  if (energy >= 750) return "#f97316"; // orange-500
  if (energy >= 500) return "#eab308"; // yellow-500
  if (energy >= 300) return "#84cc16"; // lime-500
  return "#10b981"; // emerald-500
};

export const getColorByMode = (mode: string, value: number): string => {
  switch (mode) {
    case "temperature":
      return getTemperatureColor(value);
    case "aqi":
      return getAQIColor(value);
    case "energy":
      return getEnergyColor(value);
    default:
      return "#6366f1";
  }
};

export const getCircleRadius = (mode: string, value: number): number => {
  let normalized = 0;
  
  switch (mode) {
    case "temperature":
      normalized = Math.min((value - 25) / 15, 1); // 25-40°C range
      break;
    case "aqi":
      normalized = Math.min(value / 200, 1); // 0-200 AQI range
      break;
    case "energy":
      normalized = Math.min(value / 1500, 1); // 0-1500 kWh range
      break;
  }
  
  return 800 + (normalized * 1200); // 800-2000 meter radius
};

// AI Insight Generator
export const generateAIInsight = (zone: ZoneData): AIInsight => {
  const insights: string[] = [];
  const recommendations: string[] = [];
  let severity: "low" | "medium" | "high" = "low";

  // Temperature Analysis
  if (zone.temperature >= 35) {
    insights.push(`Extreme heat in ${zone.name} (${zone.temperature}°C)`);
    recommendations.push("Increase cooling efficiency, consider energy-saving measures");
    severity = "high";
  } else if (zone.temperature >= 33) {
    insights.push(`High temperature detected (${zone.temperature}°C)`);
    recommendations.push("Monitor AC usage patterns");
    if (severity === "low") severity = "medium";
  }

  // AQI Analysis
  if (zone.aqi >= 151) {
    insights.push(`Unhealthy air quality (AQI: ${zone.aqi})`);
    recommendations.push("Avoid outdoor activities, use air purifiers");
    severity = "high";
  } else if (zone.aqi >= 101) {
    insights.push(`Air quality moderate to poor (AQI: ${zone.aqi})`);
    recommendations.push("Sensitive groups should limit outdoor exposure");
    if (severity === "low") severity = "medium";
  }

  // Energy Analysis
  if (zone.energy >= 1000) {
    insights.push(`Very high energy consumption (${zone.energy} kWh)`);
    recommendations.push("Peak load detected - review energy optimization strategies");
    severity = "high";
  } else if (zone.energy >= 750) {
    insights.push(`Elevated energy usage (${zone.energy} kWh)`);
    recommendations.push("Consider load balancing and renewable energy");
    if (severity === "low") severity = "medium";
  }

  // Correlations
  if (zone.temperature >= 33 && zone.energy >= 700) {
    insights.push(`High energy usage correlates with temperature spike - likely increased AC demand`);
  }

  if (zone.aqi >= 120 && zone.area?.includes("Industrial")) {
    insights.push(`Industrial activity contributing to elevated AQI levels`);
  }

  if (zone.area?.includes("Coastal") && zone.aqi < 100) {
    insights.push(`Sea breeze from Bay of Bengal helping maintain good air quality`);
  }

  // Area-specific insights
  if (zone.name === "OMR (Thoraipakkam)") {
    insights.push(`IT corridor experiencing peak office hours demand`);
  }

  if (zone.area?.includes("Residential") && zone.energy < 500) {
    insights.push(`Residential zone showing efficient energy patterns`);
  }

  const insight = insights.length > 0 
    ? insights.join(". ") + "."
    : `${zone.name} showing normal environmental conditions across all metrics.`;

  if (recommendations.length === 0) {
    recommendations.push("Continue monitoring current patterns");
    recommendations.push("Maintain sustainable practices");
  }

  return {
    zoneId: zone.id,
    zoneName: zone.name,
    insight,
    recommendations,
    severity,
    metrics: {
      temperature: zone.temperature,
      aqi: zone.aqi,
      energy: zone.energy,
      carbon: zone.carbon,
    },
  };
};
