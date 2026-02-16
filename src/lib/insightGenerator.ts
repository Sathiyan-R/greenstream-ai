/**
 * AI Insight Generator
 * Generates contextual insights from dashboard data
 */

import type { DashboardState } from "./api";

export interface AIInsight {
  id: string;
  title: string;
  message: string;
  category: "energy" | "air" | "carbon" | "sustainability" | "weather" | "general";
  severity: "info" | "warning" | "success";
  timestamp: Date;
  actionable: boolean;
  suggestion?: string;
}

/**
 * Generate insights from dashboard data
 * Analyzes patterns and relationships between metrics
 */
export function generateInsights(dashboardState: DashboardState): AIInsight[] {
  const insights: AIInsight[] = [];
  const timestamp = new Date();

  // Air Quality Insights
  if (dashboardState.airQuality) {
    const { aqi, pm25, pm10, so2, no2 } = dashboardState.airQuality;

    if (aqi > 150) {
      insights.push({
        id: `air-${timestamp.getTime()}`,
        title: "High Pollution Alert",
        message: `Current AQI is ${aqi} (Unhealthy). Avoid outdoor activities and use air purifiers.`,
        category: "air",
        severity: "warning",
        timestamp,
        actionable: true,
        suggestion: "Reduce outdoor exposure, increase local ventilation",
      });
    } else if (aqi > 100) {
      insights.push({
        id: `air-moderate-${timestamp.getTime()}`,
        title: "Moderate Air Quality",
        message: `AQI at ${aqi}. Sensitive groups should limit intense outdoor activities.`,
        category: "air",
        severity: "warning",
        timestamp,
        actionable: true,
      });
    } else if (aqi < 50) {
      insights.push({
        id: `air-good-${timestamp.getTime()}`,
        title: "Excellent Air Quality",
        message: "Perfect conditions for outdoor activities.",
        category: "air",
        severity: "success",
        timestamp,
        actionable: false,
      });
    }

    // Specific pollutant warnings
    if (pm25 && pm25 > 35) {
      insights.push({
        id: `pm25-${timestamp.getTime()}`,
        title: "High PM2.5 Levels",
        message: `Fine particulate matter at ${pm25} µg/m³. Wear N95 masks outdoors.`,
        category: "air",
        severity: "warning",
        timestamp,
        actionable: true,
      });
    }
  }

  // Energy Insights
  if (dashboardState.energyReadings && dashboardState.energyReadings.length > 0) {
    const currentEnergy = dashboardState.energyReadings[0];
    const avgEnergy = dashboardState.rollingAvgUsage;

    if (currentEnergy > avgEnergy * 1.3) {
      insights.push({
        id: `energy-high-${timestamp.getTime()}`,
        title: "High Energy Consumption",
        message: `Current usage ${currentEnergy} kWh is 30% above average (${avgEnergy.toFixed(0)} kWh).`,
        category: "energy",
        severity: "warning",
        timestamp,
        actionable: true,
        suggestion:
          "Check for active appliances, optimize heating/cooling, or consider demand reduction",
      });
    } else if (currentEnergy < avgEnergy * 0.7) {
      insights.push({
        id: `energy-low-${timestamp.getTime()}`,
        title: "Low Energy Usage",
        message: `Great job! Usage is 30% below average. Maintain current efficiency.`,
        category: "energy",
        severity: "success",
        timestamp,
        actionable: false,
      });
    }
  }

  // Carbon Insights
  if (dashboardState.carbon) {
    const { total, energy, transport, waste } = dashboardState.carbon;

    if (total > 100) {
      insights.push({
        id: `carbon-high-${timestamp.getTime()}`,
        title: "High Carbon Footprint",
        message: `Daily emissions: ${total.toFixed(1)} kg CO2e. Primary source: ${
          energy > 40 ? "Energy" : transport > 40 ? "Transport" : "Other"
        }.`,
        category: "carbon",
        severity: "warning",
        timestamp,
        actionable: true,
        suggestion:
          energy > 40
            ? "Switch to renewable energy sources"
            : transport > 40
              ? "Reduce travel or use public transport"
              : "Optimize daily activities",
      });
    }
  }

  // Weather-based Insights
  if (dashboardState.weather) {
    const { temperature, humidity, windSpeed, weatherMain } = dashboardState.weather;

    if (temperature > 30) {
      insights.push({
        id: `heat-${timestamp.getTime()}`,
        title: "High Temperature Alert",
        message: `Temperature at ${temperature}°C. Stay hydrated and avoid peak sun hours (11-16).`,
        category: "weather",
        severity: "warning",
        timestamp,
        actionable: true,
      });
    }

    if (windSpeed > 30) {
      insights.push({
        id: `wind-${timestamp.getTime()}`,
        title: "Strong Winds Expected",
        message: `Wind speed: ${windSpeed} km/h. Air quality may improve due to pollution dispersal.`,
        category: "weather",
        severity: "info",
        timestamp,
        actionable: false,
      });
    }

    // Weather-Energy correlation
    if (temperature > 28 && dashboardState.rollingAvgUsage > 400) {
      insights.push({
        id: `weather-energy-${timestamp.getTime()}`,
        title: "AC Driving High Energy Consumption",
        message: `High temperature (${temperature}°C) likely causing increased AC usage.`,
        category: "sustainability",
        severity: "info",
        timestamp,
        actionable: true,
        suggestion: "Consider increasing thermostat by 2-3°C for energy savings",
      });
    }
  }

  // Sustainability Score Insight
  if (dashboardState.sustainabilityScore) {
    const score = dashboardState.sustainabilityScore;

    if (score < 30) {
      insights.push({
        id: `sustain-critical-${timestamp.getTime()}`,
        title: "Critical Sustainability Status",
        message: `Sustainability score: ${score}/100. Immediate action required across all metrics.`,
        category: "sustainability",
        severity: "warning",
        timestamp,
        actionable: true,
      });
    } else if (score > 70) {
      insights.push({
        id: `sustain-good-${timestamp.getTime()}`,
        title: "Positive Sustainability Trend",
        message: `Score at ${score}/100. Keep up with current sustainability practices.`,
        category: "sustainability",
        severity: "success",
        timestamp,
        actionable: false,
      });
    }
  }

  // Anomaly-based Insights
  if (dashboardState.anomalies && dashboardState.anomalies.length > 0) {
    dashboardState.anomalies.slice(0, 2).forEach((anomaly) => {
      insights.push({
        id: `anomaly-${anomaly.id}`,
        title: `Anomaly Detected: ${anomaly.metric}`,
        message: anomaly.description,
        category: "general",
        severity: anomaly.severity === "high" ? "warning" : "info",
        timestamp,
        actionable: anomaly.severity === "high",
      });
    });
  }

  return insights.slice(0, 5); // Return top 5 insights
}

/**
 * Generate a single summary insight for quick display
 */
export function generateSummaryInsight(dashboardState: DashboardState): string {
  const insights = generateInsights(dashboardState);

  if (insights.length === 0) {
    return "✅ All environmental metrics are optimal";
  }

  const topInsight = insights[0];

  switch (topInsight.severity) {
    case "warning":
      return `⚠️ ${topInsight.title}: ${topInsight.message.substring(0, 80)}...`;
    case "success":
      return `✅ ${topInsight.title}: ${topInsight.message.substring(0, 80)}...`;
    default:
      return `ℹ️ ${topInsight.title}: ${topInsight.message.substring(0, 80)}...`;
  }
}

/**
 * Format insights for display in UI
 */
export function formatInsightForDisplay(
  insight: AIInsight
): {
  icon: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
} {
  const baseClasses = {
    info: {
      icon: "ℹ️",
      bgColor: "bg-blue-50",
      textColor: "text-blue-800",
      borderColor: "border-blue-200",
    },
    warning: {
      icon: "⚠️",
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-800",
      borderColor: "border-yellow-200",
    },
    success: {
      icon: "✅",
      bgColor: "bg-green-50",
      textColor: "text-green-800",
      borderColor: "border-green-200",
    },
  };

  return baseClasses[insight.severity];
}
