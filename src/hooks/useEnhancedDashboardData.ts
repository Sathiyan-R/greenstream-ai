import { useMemo, useCallback } from "react";
import type { DashboardState } from "@/lib/api";
import { detectMultipleAnomalies, calculateMean } from "@/lib/anomalyDetection";
import { type ScoreFactors } from "@/lib/scoreCalculation";

interface EnhancedDashboardDataProps {
  dashboardState: DashboardState;
}

/**
 * Hook for computing enhanced dashboard metrics
 * Memoizes expensive calculations to prevent unnecessary re-renders
 */
export function useEnhancedDashboardData({ dashboardState }: EnhancedDashboardDataProps) {
  // Memoize anomaly detection
  const anomalies = useMemo(() => {
    if (!dashboardState.energyReadings || dashboardState.energyReadings.length < 5) {
      return [];
    }

    const metrics: Record<string, { current: number; history: number[] }> = {};

    // Energy anomalies
    if (dashboardState.energyReadings.length > 0) {
      metrics["Energy Consumption"] = {
        current: dashboardState.energyReadings[0],
        history: dashboardState.energyReadings.slice(0, 10).map((r) => r),
      };
    }

    // AQI anomalies
    if (dashboardState.airQuality) {
      metrics["Air Quality Index"] = {
        current: dashboardState.airQuality.aqi,
        history: Array(5).fill(dashboardState.airQuality.aqi),
      };
    }

    return detectMultipleAnomalies(metrics);
  }, [dashboardState.energyReadings, dashboardState.airQuality]);

  // Memoize score factors
  const scoreFactors = useMemo((): ScoreFactors => {
    return {
      aqi: dashboardState.airQuality?.aqi || 50,
      energyConsumption: dashboardState.energyReadings?.[0] || 0,
      carbonEmission: dashboardState.carbon?.total || 0,
      temperatureSeverity: Math.abs((dashboardState.weather?.temperature || 20) - 20),
    };
  }, [
    dashboardState.airQuality?.aqi,
    dashboardState.energyReadings,
    dashboardState.carbon?.total,
    dashboardState.weather?.temperature,
  ]);

  // Memoize historical energy data for predictions
  const energyHistory = useMemo(() => {
    return dashboardState.energyHistory?.slice(-48) || []; // Last 48 data points
  }, [dashboardState.energyHistory]);

  // Memoize energy statistics
  const energyStats = useMemo(() => {
    if (!dashboardState.energyReadings || dashboardState.energyReadings.length === 0) {
      return { current: 0, average: 0, peak: 0, min: 0 };
    }

    const data = dashboardState.energyReadings;
    return {
      current: data[0],
      average: calculateMean(data),
      peak: Math.max(...data),
      min: Math.min(...data),
    };
  }, [dashboardState.energyReadings]);

  const getAnomalyCount = useCallback((severity?: "low" | "medium" | "high") => {
    return severity ? anomalies.filter((a) => a.severity === severity).length : anomalies.length;
  }, [anomalies]);

  return {
    anomalies,
    scoreFactors,
    energyHistory,
    energyStats,
    getAnomalyCount,
  };
}

/**
 * Hook for optimized dashboard data fetching with React Query
 */
export function useDashboardDataOptimized(dashboardState: DashboardState) {
  // Cache key that changes only when critical data changes
  const cacheKeyFactors = useMemo(() => {
    return `dashboard-${dashboardState.airQuality?.aqi}-${dashboardState.rollingAvgUsage}-${Date.now() % 60000}`;
  }, [dashboardState.airQuality?.aqi, dashboardState.rollingAvgUsage]);

  // Memoize predictions to avoid constant recalculation
  const predictionData = useMemo(() => {
    return {
      energyHistory: dashboardState.energyHistory?.slice(-48) || [],
      aqi: dashboardState.airQuality?.aqi || 50,
      temperature: dashboardState.weather?.temperature || 20,
      windSpeed: dashboardState.weather?.windSpeed || 0,
    };
  }, [
    dashboardState.energyHistory,
    dashboardState.airQuality?.aqi,
    dashboardState.weather?.temperature,
    dashboardState.weather?.windSpeed,
  ]);

  return {
    cacheKeyFactors,
    predictionData,
  };
}
