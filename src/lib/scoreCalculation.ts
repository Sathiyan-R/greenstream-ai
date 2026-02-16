/**
 * Sustainability Score Calculation
 * Combines multiple environmental factors into a single score (0-100)
 */

export interface ScoreFactors {
  aqi: number;
  energyConsumption: number;
  carbonEmission: number;
  temperatureSeverity: number;
}

/**
 * Calculate sustainability score from environmental factors
 * Score = 100 - (aqi * 0.2 + energy * 0.3 + carbon * 0.3 + tempRisk * 0.2)
 *
 * Weights:
 * - AQI: 20% (air quality impact)
 * - Energy: 30% (consumption impact)
 * - Carbon: 30% (emission impact)
 * - Temperature: 20% (climate severity)
 */
export function calculateSustainabilityScore(factors: ScoreFactors): number {
  const { aqi, energyConsumption, carbonEmission, temperatureSeverity } = factors;

  // Normalize values to 0-100 scale
  const aqi_normalized = Math.min(aqi / 3, 100); // AQI scale: 0-300
  const energy_normalized = Math.min((energyConsumption / 1000) * 100, 100); // kWh normalized
  const carbon_normalized = Math.min((carbonEmission / 500) * 100, 100); // kg CO2 normalized
  const temp_normalized = Math.min(Math.abs(temperatureSeverity) * 10, 100); // Temp deviation normalized

  const score = 100 - (aqi_normalized * 0.2 + energy_normalized * 0.3 + carbon_normalized * 0.3 + temp_normalized * 0.2);

  return Math.max(0, Math.min(100, Math.round(score)));
}

export interface ScoreStatus {
  label: "Excellent" | "Good" | "Moderate" | "Poor" | "Critical";
  color: "emerald" | "green" | "yellow" | "orange" | "red";
  description: string;
}

/**
 * Get status label and styling based on score
 */
export function getScoreStatus(score: number): ScoreStatus {
  if (score >= 80) {
    return { label: "Excellent", color: "emerald", description: "Outstanding sustainability metrics" };
  }
  if (score >= 60) {
    return { label: "Good", color: "green", description: "Healthy environmental conditions" };
  }
  if (score >= 40) {
    return { label: "Moderate", color: "yellow", description: "Some environmental concerns" };
  }
  if (score >= 20) {
    return { label: "Poor", color: "orange", description: "Significant sustainability issues" };
  }
  return { label: "Critical", color: "red", description: "Urgent environmental action needed" };
}

/**
 * Calculate trend direction (-1, 0, 1) and percentage change
 */
export function calculateScoreTrend(
  currentScore: number,
  previousScore: number
): { direction: -1 | 0 | 1; change: number } {
  const change = currentScore - previousScore;
  const direction = change > 2 ? 1 : change < -2 ? -1 : 0;
  return { direction, change: Math.abs(change) };
}
