// Real-time Chennai Map Color Logic

export const getAQIColor = (aqi: number): string => {
  if (aqi >= 151) return "#ef4444"; // Red
  if (aqi >= 101) return "#f97316"; // Orange
  if (aqi >= 51) return "#eab308"; // Yellow
  return "#22c55e"; // Green
};

export const getEnergyColor = (energy: number): string => {
  if (energy >= 2000) return "#ef4444"; // High - Red
  if (energy >= 1200) return "#eab308"; // Medium - Yellow
  return "#22c55e"; // Low - Green
};

export const getSustainabilityColor = (score: number): string => {
  if (score >= 80) return "#10b981"; // Bright Green (80-100)
  if (score >= 60) return "#84cc16"; // Light Green (60-79)
  if (score >= 40) return "#f97316"; // Orange (40-59)
  return "#ef4444"; // Red (Below 40)
};

export const getTemperatureColor = (temp: number): string => {
  if (temp >= 35) return "#ef4444"; // red-500
  if (temp >= 33) return "#f97316"; // orange-500
  if (temp >= 31) return "#eab308"; // yellow-500
  if (temp >= 29) return "#84cc16"; // lime-500
  return "#22c55e"; // green-500
};

export const getColorByMode = (
  mode: "temperature" | "aqi" | "energy" | "sustainability",
  zone: {
    temperature: number;
    aqi: number;
    energy_consumption: number;
    sustainability_score: number;
  }
): string => {
  switch (mode) {
    case "temperature":
      return getTemperatureColor(zone.temperature);
    case "aqi":
      return getAQIColor(zone.aqi);
    case "energy":
      return getEnergyColor(zone.energy_consumption);
    case "sustainability":
      return getSustainabilityColor(zone.sustainability_score);
    default:
      return "#6366f1";
  }
};

export const getCircleRadius = (
  mode: "temperature" | "aqi" | "energy" | "sustainability",
  zone: {
    temperature: number;
    aqi: number;
    energy_consumption: number;
    sustainability_score: number;
  }
): number => {
  let normalized = 0;

  switch (mode) {
    case "temperature":
      normalized = Math.min((zone.temperature - 25) / 15, 1);
      break;
    case "aqi":
      normalized = Math.min(zone.aqi / 200, 1);
      break;
    case "energy":
      normalized = Math.min(zone.energy_consumption / 3000, 1);
      break;
    case "sustainability":
      normalized = 1 - zone.sustainability_score / 100; // Inverse: lower score = bigger circle
      break;
  }

  return 3000 + normalized * 5000; // 3000-8000 meter radius for better visibility
};

export const getLegendData = (
  mode: "temperature" | "aqi" | "energy" | "sustainability"
): Array<{ color: string; label: string; range: string }> => {
  switch (mode) {
    case "aqi":
      return [
        { color: "#22c55e", label: "Good", range: "0-50" },
        { color: "#eab308", label: "Moderate", range: "51-100" },
        { color: "#f97316", label: "Unhealthy", range: "101-150" },
        { color: "#ef4444", label: "Very Unhealthy", range: "151+" },
      ];
    case "energy":
      return [
        { color: "#22c55e", label: "Low", range: "< 1200 kWh" },
        { color: "#eab308", label: "Medium", range: "1200-2000 kWh" },
        { color: "#ef4444", label: "High", range: "> 2000 kWh" },
      ];
    case "sustainability":
      return [
        { color: "#10b981", label: "Excellent", range: "80-100" },
        { color: "#84cc16", label: "Good", range: "60-79" },
        { color: "#f97316", label: "Fair", range: "40-59" },
        { color: "#ef4444", label: "Poor", range: "< 40" },
      ];
    case "temperature":
      return [
        { color: "#22c55e", label: "Cool", range: "< 29°C" },
        { color: "#84cc16", label: "Warm", range: "29-31°C" },
        { color: "#eab308", label: "Hot", range: "31-33°C" },
        { color: "#f97316", label: "Very Hot", range: "33-35°C" },
        { color: "#ef4444", label: "Extreme", range: "> 35°C" },
      ];
    default:
      return [];
  }
};
