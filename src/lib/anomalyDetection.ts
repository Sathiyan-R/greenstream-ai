/**
 * Anomaly Detection Utilities
 * Implements statistical anomaly detection for environmental metrics
 */

export interface Anomaly {
  id: string;
  metric: string;
  currentValue: number;
  expectedValue: number;
  deviation: number;
  severity: "low" | "medium" | "high";
  timestamp: Date;
  description: string;
}

/**
 * Calculate mean of an array
 */
export function calculateMean(data: number[]): number {
  if (data.length === 0) return 0;
  return data.reduce((sum, val) => sum + val, 0) / data.length;
}

/**
 * Calculate standard deviation
 */
export function calculateStandardDeviation(data: number[]): number {
  if (data.length < 2) return 0;
  const mean = calculateMean(data);
  const variance = data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / data.length;
  return Math.sqrt(variance);
}

/**
 * Detect if a value is anomalous using Z-score method
 * |value - mean| > threshold * stdDev indicates anomaly
 * Default threshold = 2 (95% confidence)
 */
export function detectAnomaly(
  currentValue: number,
  historicalData: number[],
  threshold: number = 2
): boolean {
  if (historicalData.length < 2) return false;

  const mean = calculateMean(historicalData);
  const stdDev = calculateStandardDeviation(historicalData);

  if (stdDev === 0) return false;

  const zScore = Math.abs((currentValue - mean) / stdDev);
  return zScore > threshold;
}

/**
 * Detect multiple anomalies across metrics
 */
export function detectMultipleAnomalies(metrics: {
  [key: string]: { current: number; history: number[] };
}): Anomaly[] {
  const anomalies: Anomaly[] = [];

  Object.entries(metrics).forEach(([metricName, data]) => {
    if (detectAnomaly(data.current, data.history)) {
      const mean = calculateMean(data.history);
      const stdDev = calculateStandardDeviation(data.history);
      const deviation = Math.abs(data.current - mean);

      // Determine severity based on deviation
      let severity: "low" | "medium" | "high" = "low";
      if (stdDev > 0) {
        const zScore = deviation / stdDev;
        if (zScore > 3) severity = "high";
        else if (zScore > 2) severity = "medium";
      }

      const description = 
        data.current > mean
          ? `${metricName} is unusually high (${data.current.toFixed(1)})`
          : `${metricName} is unusually low (${data.current.toFixed(1)})`;

      anomalies.push({
        id: `${metricName}-${Date.now()}`,
        metric: metricName,
        currentValue: data.current,
        expectedValue: mean,
        deviation,
        severity,
        timestamp: new Date(),
        description,
      });
    }
  });

  return anomalies;
}

/**
 * Get severity color for UI display
 */
export function getSeverityColor(severity: "low" | "medium" | "high"): string {
  switch (severity) {
    case "low":
      return "text-yellow-500";
    case "medium":
      return "text-orange-500";
    case "high":
      return "text-red-600";
  }
}

/**
 * Get severity background color
 */
export function getSeverityBgColor(severity: "low" | "medium" | "high"): string {
  switch (severity) {
    case "low":
      return "bg-yellow-50 border-yellow-200";
    case "medium":
      return "bg-orange-50 border-orange-200";
    case "high":
      return "bg-red-50 border-red-200";
  }
}
