/**
 * Prediction Engine
 * Mock ML-based forecasting for sustainability metrics
 */

export interface PredictionPoint {
  time: string;
  value: number;
}

/**
 * Simple exponential smoothing for prediction
 * Weights recent data more heavily
 */
function exponentialSmoothing(data: number[], alpha: number = 0.3): number[] {
  if (data.length === 0) return [];

  const smoothed: number[] = [data[0]];

  for (let i = 1; i < data.length; i++) {
    const smooth = alpha * data[i] + (1 - alpha) * smoothed[i - 1];
    smoothed.push(smooth);
  }

  return smoothed;
}

/**
 * Simple linear regression for trend
 */
function linearTrend(data: number[], steps: number): number[] {
  if (data.length < 2) return data;

  const n = data.length;
  const x = Array.from({ length: n }, (_, i) => i);
  const y = data;

  // Calculate slope and intercept
  const xMean = x.reduce((a, b) => a + b, 0) / n;
  const yMean = y.reduce((a, b) => a + b, 0) / n;

  const numerator = x.reduce((sum, xi, i) => sum + (xi - xMean) * (y[i] - yMean), 0);
  const denominator = x.reduce((sum, xi) => sum + Math.pow(xi - xMean, 2), 0);

  const slope = denominator === 0 ? 0 : numerator / denominator;
  const intercept = yMean - slope * xMean;

  // Generate predictions
  const predictions: number[] = [];
  for (let i = n; i < n + steps; i++) {
    predictions.push(Math.max(0, slope * i + intercept));
  }

  return predictions;
}

/**
 * Generate energy consumption forecast (next 12-24 hours)
 * Simulates daily patterns with weather influence
 */
export function predictEnergyConsumption(
  historicalData: number[],
  forecastHours: number = 12
): PredictionPoint[] {
  const baselineEnergy = historicalData.length > 0 ? historicalData[historicalData.length - 1] : 500;

  // Add some variability based on time of day (simulated)
  const predictions = linearTrend(historicalData, forecastHours);

  // Add realistic hourly variations
  return predictions.map((value, i) => {
    const hourOfDay = (new Date().getHours() + i) % 24;
    // Higher consumption during day (8-18h)
    const timeMultiplier = hourOfDay >= 8 && hourOfDay <= 18 ? 1.2 : 0.8;
    const adjusted = value * timeMultiplier;

    return {
      time: `${(new Date().getHours() + i).toString().padStart(2, "0")}:00`,
      value: Math.round(adjusted),
    };
  });
}

/**
 * Forecast AQI for next 12-24 hours
 * Considers weather patterns and pollution trends
 */
export function predictAQI(
  historicalAQI: number[],
  temperature: number,
  windSpeed: number,
  forecastHours: number = 12
): PredictionPoint[] {
  const smoothed = exponentialSmoothing(historicalAQI);
  const predictions = linearTrend(smoothed, forecastHours);

  return predictions.map((value, i) => {
    // Wind helps disperse pollution
    const windFactor = 1 - (windSpeed / 30) * 0.3; // 0.7 - 1.0
    // High temp can increase ozone formation
    const tempFactor = temperature > 25 ? 1.1 : 0.95;

    const adjusted = Math.round(value * windFactor * tempFactor);

    return {
      time: `+${i}h`,
      value: Math.max(0, Math.min(500, adjusted)),
    };
  });
}

/**
 * Forecast carbon emissions (next 12-24 hours)
 * Based on energy consumption patterns
 */
export function predictCarbonEmissions(
  historicalData: number[],
  carbonIntensity: number = 0.4, // kg CO2 per kWh
  forecastHours: number = 12
): PredictionPoint[] {
  const energyPredictions = predictEnergyConsumption(historicalData, forecastHours);

  return energyPredictions.map((point) => ({
    time: point.time,
    value: Math.round(point.value * carbonIntensity),
  }));
}

/**
 * Generate current conditions insight
 * Analyzes if metrics are within normal ranges
 */
export function analyzeMetricTrends(
  currentAQI: number,
  energy: number,
  carbon: number,
  previousAQI: number,
  previousEnergy: number,
  previousCarbon: number
): string[] {
  const insights: string[] = [];

  const aqiChange = currentAQI - previousAQI;
  const energyChange = energy - previousEnergy;
  const carbonChange = carbon - previousCarbon;

  if (aqiChange > 20) {
    insights.push("⚠️ Air quality deteriorating rapidly");
  } else if (aqiChange < -20) {
    insights.push("✅ Air quality improving significantly");
  }

  if (energyChange > 100) {
    insights.push("⚡ Energy consumption spike detected");
  } else if (energyChange < -50) {
    insights.push("📉 Energy consumption decreasing");
  }

  if (carbonChange > 50) {
    insights.push("🔴 Carbon emissions increasing");
  } else if (carbonChange < -30) {
    insights.push("🟢 Carbon footprint reducing");
  }

  if (insights.length === 0) {
    insights.push("📊 Environmental metrics stable");
  }

  return insights;
}
