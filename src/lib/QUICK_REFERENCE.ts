/**
 * ADVANCED FEATURES - QUICK REFERENCE
 * 
 * Quick copy-paste guide for integrating all 5 features
 */

// ============================================================================
// FEATURE 1: SUSTAINABILITY SCORE CARD
// ============================================================================

import { SustainabilityScoreCard } from "@/components/dashboard/SustainabilityScoreCard";
import {
  calculateSustainabilityScore,
  getScoreStatus,
  calculateScoreTrend,
  type ScoreFactors,
} from "@/lib/scoreCalculation";

// Usage:
const scoreFactors: ScoreFactors = {
  aqi: 75,
  energyConsumption: 450,
  carbonEmission: 180,
  temperatureSeverity: 5,
};

const score = calculateSustainabilityScore(scoreFactors); // Returns 0-100
const status = getScoreStatus(score); // Returns status object
const trend = calculateScoreTrend(score, previousScore); // Returns direction & change

// Render:
// <SustainabilityScoreCard factors={scoreFactors} previousScore={72} />

// ============================================================================
// FEATURE 2: PREDICTION CHARTS
// ============================================================================

import { PredictionChart } from "@/components/dashboard/PredictionChart";
import {
  predictEnergyConsumption,
  predictAQI,
  predictCarbonEmissions,
  analyzeMetricTrends,
  type PredictionPoint,
} from "@/lib/predictions";

// Usage:
const energyHistory = [500, 480, 520, 510, ...]; // Array of historical values
const predictions = {
  energy: predictEnergyConsumption(energyHistory, 12), // Next 12 hours
  aqi: predictAQI(aqiHistory, temperature, windSpeed, 12),
  carbon: predictCarbonEmissions(energyHistory, 0.4, 12), // 0.4 kg CO2/kWh
};

const insights = analyzeMetricTrends(currentAQI, energy, carbon, prevAQI, prevEnergy, prevCarbon);

// Render:
// <PredictionChart
//   energyHistory={energyHistory}
//   aqi={75}
//   temperature={22}
//   windSpeed={12}
//   carbonIntensity={0.4}
// />

// ============================================================================
// FEATURE 3: ANOMALY DETECTION
// ============================================================================

import {
  AnomalyAlerts,
  AnomalyBadge,
  AnomalySummary,
} from "@/components/dashboard/AnomalyAlerts";
import {
  detectAnomaly,
  detectMultipleAnomalies,
  calculateMean,
  calculateStandardDeviation,
  getSeverityColor,
  getSeverityBgColor,
  type Anomaly,
} from "@/lib/anomalyDetection";

// Usage - Single metric:
const isAnomaly = detectAnomaly(
  currentValue, // Current reading
  historicalData, // Array of past values
  threshold // Optional, default 2
);

// Usage - Multiple metrics:
const anomalies = detectMultipleAnomalies({
  "Energy Consumption": {
    current: 650,
    history: [450, 480, 520, 495, 510, ...],
  },
  "Air Quality Index": {
    current: 180,
    history: [65, 68, 72, 70, 69, ...],
  },
});

// Statistics:
const mean = calculateMean(data);
const stdDev = calculateStandardDeviation(data);

// Styling:
const color = getSeverityColor("high"); // "text-red-600"
const bg = getSeverityBgColor("medium"); // "bg-orange-50 border-orange-200"

// Render:
// <div>
//   <AnomalyBadge count={anomalies.length} severe={anomalies.some(a => a.severity === 'high')} />
//   <AnomalyAlerts anomalies={anomalies} maxDisplay={5} />
//   <AnomalySummary anomalies={anomalies} />
// </div>

// ============================================================================
// FEATURE 4: AI INSIGHT GENERATOR
// ============================================================================

import { AIInsightGenerator } from "@/components/dashboard/AIInsightGenerator";
import {
  generateInsights,
  generateSummaryInsight,
  formatInsightForDisplay,
  type AIInsight,
} from "@/lib/insightGenerator";

// Usage - Generate insights from state:
const insights = generateInsights(dashboardState);
// Returns array of up to 5 AIInsight objects

// Usage - Get summary:
const summary = generateSummaryInsight(dashboardState);
// Returns: "⚠️ High Pollution Alert: Current AQI is 180..."

// Usage - Format for display:
const styling = formatInsightForDisplay(insight);
// Returns: { icon: "⚠️", bgColor: "bg-yellow-50", ... }

// Render component:
// <AIInsightGenerator dashboardState={state} onLoadingChange={setLoading} />

// ============================================================================
// FEATURE 5: PERFORMANCE OPTIMIZATION
// ============================================================================

import { useEnhancedDashboardData, useDashboardDataOptimized } from "@/hooks/useEnhancedDashboardData";

// Usage - Optimized data computation:
const {
  anomalies,
  scoreFactors,
  energyHistory,
  energyStats,
  getAnomalyCount,
} = useEnhancedDashboardData({ dashboardState });

// Usage - Optimization metadata:
const { cacheKeyFactors, predictionData } = useDashboardDataOptimized(dashboardState);

// For React Query optimization in your API fetch:
/*
import { useQuery } from '@tanstack/react-query';

useQuery({
  queryKey: ['weather', location],
  queryFn: () => fetchWeather(location),
  staleTime: 5 * 60 * 1000,  // 5 minutes
  gcTime: 10 * 60 * 1000,    // 10 minutes
});
*/

// ============================================================================
// COMPLETE INTEGRATION EXAMPLE
// ============================================================================

/*
import { memo, useState, useMemo } from 'react';
import { SustainabilityScoreCard } from "@/components/dashboard/SustainabilityScoreCard";
import { PredictionChart } from "@/components/dashboard/PredictionChart";
import { AnomalyAlerts, AnomalySummary } from "@/components/dashboard/AnomalyAlerts";
import { AIInsightGenerator } from "@/components/dashboard/AIInsightGenerator";
import { useEnhancedDashboardData } from "@/hooks/useEnhancedDashboardData";
import { useDashboardData } from "@/hooks/useDashboardData";

export const EnhancedDashboard = memo(() => {
  const { state, loading } = useDashboardData();
  const { anomalies, scoreFactors, energyHistory } = useEnhancedDashboardData({
    dashboardState: state,
  });
  const [previousScore, setPreviousScore] = useState(0);

  return (
    <main className="p-6 max-w-[1600px] mx-auto space-y-6">
      {/* Anomalies First */}
      {anomalies.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-lg font-bold text-red-600">Active Anomalies</h2>
          <AnomalyAlerts anomalies={anomalies} maxDisplay={3} />
        </div>
      )}

      {/* Main Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <SustainabilityScoreCard 
          factors={scoreFactors} 
          previousScore={previousScore} 
        />
        {/* Other metric cards */}
      </div>

      {/* Predictions & Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <PredictionChart
          energyHistory={energyHistory}
          aqi={state.airQuality?.aqi || 50}
          temperature={state.weather?.temperature || 20}
          windSpeed={state.weather?.windSpeed || 0}
        />
        <AnomalySummary anomalies={anomalies} />
      </div>

      {/* AI Insights */}
      <AIInsightGenerator dashboardState={state} />
    </main>
  );
});
*/

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/*
// From scoreCalculation.ts
interface ScoreFactors {
  aqi: number;
  energyConsumption: number;
  carbonEmission: number;
  temperatureSeverity: number;
}

// From anomalyDetection.ts
interface Anomaly {
  id: string;
  metric: string;
  currentValue: number;
  expectedValue: number;
  deviation: number;
  severity: "low" | "medium" | "high";
  timestamp: Date;
  description: string;
}

// From predictions.ts
interface PredictionPoint {
  time: string;
  value: number;
}

// From insightGenerator.ts
interface AIInsight {
  id: string;
  title: string;
  message: string;
  category: "energy" | "air" | "carbon" | "sustainability" | "weather" | "general";
  severity: "info" | "warning" | "success";
  timestamp: Date;
  actionable: boolean;
  suggestion?: string;
}
*/

// ============================================================================
// COMMON PATTERNS
// ============================================================================

// Pattern 1: Conditional Rendering Based on Severity
/*
{anomalies.some(a => a.severity === 'high') && (
  <AnomalyBadge count={anomalies.length} severe={true} />
)}
*/

// Pattern 2: Responsive Grid Layout for Charts
/*
<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
  <PredictionChart {...props} />
  <AnomalySummary anomalies={anomalies} />
</div>
*/

// Pattern 3: Loading State
/*
{loading ? (
  <div className="animate-pulse bg-muted rounded-lg h-96" />
) : (
  <SustainabilityScoreCard {...props} />
)}
*/

// Pattern 4: Memoization for Performance
/*
const memoizedAnomalies = useMemo(() => 
  detectMultipleAnomalies(metrics),
  [metrics]
);
*/

// ============================================================================
// USEFUL EXPORTS SUMMARY
// ============================================================================

export const EXPORTS_SUMMARY = {
  // Components
  SustainabilityScoreCard: "Advanced score display with trend",
  PredictionChart: "12-hour forecast with ML predictions",
  AnomalyAlerts: "Displayed anomalies with severity",
  AnomalyBadge: "Compact anomaly count badge",
  AnomalySummary: "Summary statistics of anomalies",
  AIInsightGenerator: "AI-powered insights panel",

  // Utilities
  "scoreCalculation.ts": "Score calculation & status logic",
  "anomalyDetection.ts": "Statistical anomaly detection",
  "predictions.ts": "Energy/AQI/carbon forecasting",
  "insightGenerator.ts": "Insight generation engine",
  "useEnhancedDashboardData": "Optimized computation hook",

  // Files
  "ADVANCED_FEATURES.md": "Comprehensive feature documentation",
  "FEATURE_INTEGRATION_GUIDE.ts": "Integration examples & tips",
};
