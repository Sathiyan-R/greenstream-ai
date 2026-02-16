/**
 * ADVANCED FEATURES - QUICK REFERENCE
 * 
 * This file exports reference documentation for the 5 advanced features.
 * For full implementation examples, see QUICK_REFERENCE.md
 */

// ============================================================================
// COMPONENT EXPORTS
// ============================================================================

export const COMPONENT_EXPORTS = {
  SustainabilityScoreCard: "src/components/dashboard/SustainabilityScoreCard.tsx",
  PredictionChart: "src/components/dashboard/PredictionChart.tsx",
  AnomalyAlerts: "src/components/dashboard/AnomalyAlerts.tsx",
  AIInsightGenerator: "src/components/dashboard/AIInsightGenerator.tsx",
};

// ============================================================================
// UTILITY FUNCTION EXPORTS
// ============================================================================

export const UTILITY_EXPORTS = {
  scoreCalculation: [
    "calculateSustainabilityScore(factors: ScoreFactors): number",
    "getScoreStatus(score: number): ScoreStatus",
    "calculateScoreTrend(current: number, previous: number): ScoreTrend",
  ],
  anomalyDetection: [
    "detectAnomaly(current: number, history: number[], threshold?: number): boolean",
    "detectMultipleAnomalies(metrics: MetricsMap): Anomaly[]",
    "calculateMean(data: number[]): number",
    "calculateStandardDeviation(data: number[]): number",
    "getSeverityColor(severity: string): string",
    "getSeverityBgColor(severity: string): string",
  ],
  predictions: [
    "predictEnergyConsumption(history: number[], hours: number): PredictionPoint[]",
    "predictAQI(history: number[], temp: number, wind: number, hours: number): PredictionPoint[]",
    "predictCarbonEmissions(energy: number[], intensity: number, hours: number): PredictionPoint[]",
    "analyzeMetricTrends(...metrics): TrendAnalysis",
  ],
  insightGenerator: [
    "generateInsights(state: DashboardState): AIInsight[]",
    "generateSummaryInsight(state: DashboardState): string",
    "formatInsightForDisplay(insight: AIInsight): DisplayFormat",
  ],
};

// ============================================================================
// HOOK EXPORTS
// ============================================================================

export const HOOK_EXPORTS = {
  useEnhancedDashboardData: "Optimized computation hook returning anomalies, scoreFactors, energy stats",
  useDashboardDataOptimized: "Provides cache key factors and prediction data",
};

// ============================================================================
// FEATURE USAGE PATTERNS
// ============================================================================

export const FEATURE_PATTERNS = {
  sustainabilityScore: `
    Import SustainabilityScoreCard and scoreCalculation utilities.
    Define ScoreFactors with aqi, energyConsumption, carbonEmission, temperatureSeverity.
    Calculate score: calculateSustainabilityScore(factors).
    Render: <SustainabilityScoreCard factors={scoreFactors} previousScore={72} />
  `,

  predictions: `
    Import PredictionChart and prediction utilities.
    Prepare historical data arrays for energy, AQI, carbon.
    Generate predictions using predict* functions with 12-hour horizon.
    Render: <PredictionChart energyHistory={history} aqi={aqi} temperature={temp} />
  `,

  anomalyDetection: `
    Import anomaly detection utilities and AnomalyAlerts component.
    Call detectMultipleAnomalies with metrics map containing current/history.
    Check severity with getSeverityColor/getSeverityBgColor helpers.
    Render: <AnomalyAlerts anomalies={anomalies} maxDisplay={5} />
  `,

  aiInsights: `
    Import AIInsightGenerator component and insightGenerator utilities.
    Pass dashboardState to generateInsights() for automatic classification.
    Format insights with formatInsightForDisplay for styling.
    Render: <AIInsightGenerator dashboardState={state} onLoadingChange={setLoading} />
  `,

  performance: `
    Import useEnhancedDashboardData hook for optimized computations.
    Wrap components with React.memo() to prevent unnecessary re-renders.
    Use useMemo for expensive calculations on arrays.
    Use React Query with proper staleTime and gcTime settings.
  `,
};

// ============================================================================
// COMMON INTEGRATION CHECKLIST
// ============================================================================

export const INTEGRATION_CHECKLIST = [
  "Import all components from src/components/dashboard/",
  "Import utilities from src/lib/",
  "Import hooks from src/hooks/",
  "Add SustainabilityScoreCard to metric grid",
  "Add PredictionChart with 12-hour forecast tabs",
  "Add AnomalyAlerts at top of dashboard",
  "Add AIInsightGenerator section for insights",
  "Connect useEnhancedDashboardData hook",
  "Wrap components with React.memo for performance",
  "Test with React DevTools Profiler",
  "Verify no TypeScript compilation errors",
  "Test responsive layout on mobile/tablet/desktop",
];

// ============================================================================
// EXPORTS SUMMARY
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
  "FEATURE_INTEGRATION_GUIDE.md": "Integration examples & tips",
  "QUICK_REFERENCE.md": "Quick reference with code examples",
};
