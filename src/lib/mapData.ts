import { ZoneData, AIInsight } from "@/types/map";

// Chennai zones with simulated environmental data
export const chennaiZones: ZoneData[] = [
  {
    id: "zone-1",
    name: "T. Nagar",
    lat: 13.0418,
    lng: 80.2341,
    temperature: 32,
    aqi: 145,
    energy: 850,
    carbon: 697,
    area: "Commercial Hub",
  },
  {
    id: "zone-2",
    name: "Anna Nagar",
    lat: 13.0850,
    lng: 80.2101,
    temperature: 31,
    aqi: 98,
    energy: 620,
    carbon: 508.4,
    area: "Residential",
  },
  {
    id: "zone-3",
    name: "Velachery",
    lat: 12.9750,
    lng: 80.2200,
    temperature: 33,
    aqi: 132,
    energy: 720,
    carbon: 590.4,
    area: "Mixed Development",
  },
  {
    id: "zone-4",
    name: "OMR (Thoraipakkam)",
    lat: 12.9407,
    lng: 80.2329,
    temperature: 35,
    aqi: 168,
    energy: 1250,
    carbon: 1025,
    area: "IT Corridor",
  },
  {
    id: "zone-5",
    name: "Adyar",
    lat: 13.0067,
    lng: 80.2570,
    temperature: 30,
    aqi: 85,
    energy: 450,
    carbon: 369,
    area: "Coastal Residential",
  },
  {
    id: "zone-6",
    name: "Tambaram",
    lat: 12.9249,
    lng: 80.1000,
    temperature: 34,
    aqi: 178,
    energy: 890,
    carbon: 729.8,
    area: "Industrial",
  },
  {
    id: "zone-7",
    name: "Mylapore",
    lat: 13.0339,
    lng: 80.2619,
    temperature: 29,
    aqi: 72,
    energy: 380,
    carbon: 311.6,
    area: "Heritage & Coastal",
  },
  {
    id: "zone-8",
    name: "Guindy",
    lat: 13.0067,
    lng: 80.2206,
    temperature: 32,
    aqi: 125,
    energy: 680,
    carbon: 557.6,
    area: "Industrial Park",
  },
  {
    id: "zone-9",
    name: "Porur",
    lat: 13.0358,
    lng: 80.1559,
    temperature: 33,
    aqi: 155,
    energy: 750,
    carbon: 615,
    area: "Suburban Residential",
  },
  {
    id: "zone-10",
    name: "Nungambakkam",
    lat: 13.0569,
    lng: 80.2424,
    temperature: 31,
    aqi: 110,
    energy: 560,
    carbon: 459.2,
    area: "Urban Core",
  },
  {
    id: "zone-11",
    name: "ECR (Palavakkam)",
    lat: 12.9698,
    lng: 80.2549,
    temperature: 28,
    aqi: 65,
    energy: 320,
    carbon: 262.4,
    area: "Coastal Tourist",
  },
  {
    id: "zone-12",
    name: "Ambattur",
    lat: 13.1143,
    lng: 80.1548,
    temperature: 34,
    aqi: 185,
    energy: 920,
    carbon: 754.4,
    area: "Industrial Estate",
  },
];

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
