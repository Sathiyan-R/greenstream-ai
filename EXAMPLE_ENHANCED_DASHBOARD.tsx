/**
 * EXAMPLE: Enhanced Dashboard Component Reference
 * 
 * This file exports reference patterns for integrating the 5 advanced features.
 * For full implementation code, see EXAMPLE_ENHANCED_DASHBOARD.md
 */

// ============================================================================
// COMPONENT STRUCTURE REFERENCE
// ============================================================================

export const COMPONENT_STRUCTURE = {
  layout: "Single main container with sections vertically stacked",
  sections: [
    "Header with navigation and anomaly badge",
    "Critical alerts section (high-severity anomalies)",
    "Key metrics grid (sustainability score, energy, AQI, carbon)",
    "Forecast section (12-hour predictions and anomaly summary)",
    "AI insights section (auto-generated recommendations)",
    "Debug info (development only)",
  ],
};

// ============================================================================
// INTEGRATION PATTERN EXAMPLES
// ============================================================================

export const INTEGRATION_PATTERNS = {
  hooks: {
    getDashboardData: "const { state, loading, apiStatus, refresh } = useDashboardData();",
    getEnhancedData:
      "const { anomalies, scoreFactors, energyHistory, energyStats, getAnomalyCount } = useEnhancedDashboardData({ dashboardState: state });",
  },

  stateManagement: {
    previousScore: "Track with useState for trend calculation",
    loading: "Show loading spinner while data fetches",
    scrolling: "Auto-scroll to top on component mount",
  },

  rendering: {
    conditionalAlerts: "Render anomaly alerts only if anomalies.length > 0",
    severityFiltering: "Filter anomalies by severity for different sections",
    responsiveGrid: "Use grid-cols-1 md:grid-cols-2 lg:grid-cols-4 for metrics",
  },

  animations: {
    container: "motion.div with initial opacity and y position",
    delayed: "Use staggered delays (0.1s, 0.2s, 0.3s, etc.) for cascade effect",
    transitions: "3s for button hover, 300ms for UI transitions",
  },
};

// ============================================================================
// DATA FLOW PATTERN
// ============================================================================

export const DATA_FLOW = `
1. Component mounts → useDashboardData() fetches from API
2. Raw data arrives → useEnhancedDashboardData() processes it
3. Processing generates:
   - anomalies: Detected using Z-score algorithm
   - scoreFactors: AQI, energy, carbon, temperature
   - energyHistory: Historical energy readings
   - energyStats: Min, max, average calculations
   - getAnomalyCount: Function to count by severity

4. Render triggers with processed data
5. Each feature displays its data:
   - SustainabilityScoreCard: Uses scoreFactors
   - PredictionChart: Uses energyHistory, AQI, temperature, wind
   - AnomalyAlerts: Uses anomalies array
   - AIInsightGenerator: Uses full dashboardState

6. User interactions:
   - Click refresh button → calls refresh()
   - Scroll to top → useEffect runs on mount
   - Previous score update → monitored for trend
`;

// ============================================================================
// LAYOUT GRID STRUCTURE
// ============================================================================

export const LAYOUT_GRID = {
  "Metrics Grid": {
    columns: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
    cards: [
      "SustainabilityScoreCard (takes full width or 1 column)",
      "Other metric cards from existing dashboard",
    ],
  },

  "Forecast Grid": {
    columns: "grid-cols-1 lg:grid-cols-2",
    sections: [
      "PredictionChart - 12-hour forecasts with tabs",
      "AnomalySummary - Summary statistics",
    ],
  },

  "Alert Section": {
    columns: "Full width but only renders if anomalies detected",
    content: "AnomalyAlerts component with high-severity anomalies",
  },

  "Insights Section": {
    columns: "Full width",
    content: "AIInsightGenerator component",
  },
};

// ============================================================================
// PROP PASSING PATTERN
// ============================================================================

export const PROP_PATTERNS = {
  SustainabilityScoreCard: {
    factors: "scoreFactors from useEnhancedDashboardData",
    previousScore: "Tracked state for trend calculation",
  },

  PredictionChart: {
    energyHistory: "Array of historical energy values",
    aqi: "Current air quality index from state",
    temperature: "Current temperature from state",
    windSpeed: "Use wind_speed from state (not windSpeed)",
    carbonIntensity: "CO2 emissions factor, typically 0.4",
  },

  AnomalyAlerts: {
    anomalies: "Array from useEnhancedDashboardData, can be filtered",
    maxDisplay: "Maximum anomalies to show, typically 3-5",
  },

  AnomalySummary: {
    anomalies: "Complete array of all anomalies",
  },

  AIInsightGenerator: {
    dashboardState: "Full state object from useDashboardData",
    onLoadingChange: "Optional callback for loading state",
  },
};

// ============================================================================
// COMMON ISSUES AND SOLUTIONS
// ============================================================================

export const TROUBLESHOOTING = {
  "No data displayed": `
    - Check useDashboardData hook returns valid state
    - Verify API endpoints are accessible
    - Check browser console for fetch errors
    - Ensure mock data is set up if API unavailable
  `,

  "Type errors on windSpeed": `
    - API uses wind_speed not windSpeed
    - Update PredictionChart prop or add conversion layer
  `,

  "Performance issues": `
    - Wrap components with React.memo()
    - Use useMemo for expensive calculations
    - Check React DevTools Profiler for bottlenecks
    - Ensure re-renders aren't cascading unnecessarily
  `,

  "Anomalies not showing": `
    - Verify historical data has enough samples (>10 recommended)
    - Check Z-score threshold (default 2)
    - Ensure current value is actually anomalous (>2 std dev)
  `,

  "Predictions look wrong": `
    - Verify historical data is sorted by time
    - Check that prediction functions receive arrays not single values
    - Ensure time period (hours) is reasonable (12 is typical)
  `,
};

// ============================================================================
// PERFORMANCE TIPS
// ============================================================================

export const PERFORMANCE_TIPS = [
  "Wrap EnhancedDashboard with React.memo() to prevent parent re-renders",
  "Use useCallback for event handlers passed as props",
  "Memoize anomalies array: useMemo(() => detectAnomalies(...), [deps])",
  "Implement pagination or virtualization for large anomaly lists",
  "Defer non-critical updates with useTransition (React 18+)",
  "Use React Query or SWR for efficient data fetching",
  "Optimize chart rendering with recharts shouldComponentUpdate",
  "Lazy load AI insights component if not immediately visible",
  "Profile with React DevTools Profiler before optimization",
  "Monitor bundle size with size-limit or bundle-analyzer",
];

// ============================================================================
// CUSTOMIZATION EXAMPLES
// ============================================================================

export const CUSTOMIZATION_OPTIONS = `
Change animation timing:
  - Adjust delay values in motion.div components
  - Modify transition duration in className

Modify anomaly display:
  - Filter by severity: anomalies.filter(a => a.severity === 'high')
  - Limit count: anomalies.slice(0, 5)
  - Group by type: anomalies.reduce((groups, a) => {...}, {})

Customize chart props:
  - Change carbonIntensity from 0.4 to your actual value
  - Adjust forecast hours (default 12, can be 6, 24, etc.)
  - Modify chart type (line, bar, area) in PredictionChart

Theme customization:
  - Change color classes: text-red-600 → text-orange-600
  - Adjust spacing: gap-4 → gap-6
  - Modify border styles: border-red-200 → border-red-300
`;

// ============================================================================
// TESTING CHECKLIST
// ============================================================================

export const TESTING_CHECKLIST = [
  "Sustainability Score Card renders with correct score and status",
  "Prediction charts display all 3 chart types (energy, AQI, carbon)",
  "Anomaly alerts show only when anomalies exist",
  "AI insights generate automatically without external API",
  "Performance is acceptable with 100+ anomalies",
  "Responsive design works on mobile (375px), tablet (768px), desktop (1024px+)",
  "TypeScript compilation passes without errors",
  "No console warnings about missing keys or dependencies",
  "Loading state displays while data fetches",
  "Refresh button properly re-fetches data",
  "Previous score tracking works for trend indicator",
  "All imports resolve correctly",
  "Animations are smooth at 60 FPS (check DevTools)",
];

// ============================================================================
// FILE REFERENCES
// ============================================================================

export const FILE_REFERENCES = {
  documentation: {
    "ADVANCED_FEATURES.md": "Complete feature documentation with examples",
    "FEATURE_INTEGRATION_GUIDE.md": "Integration patterns and best practices",
    "EXAMPLE_ENHANCED_DASHBOARD.md": "Full component code example",
    "QUICK_REFERENCE.md": "Copy-paste patterns",
  },

  components: {
    "SustainabilityScoreCard.tsx": "Score display with trend",
    "PredictionChart.tsx": "12-hour forecast charts",
    "AnomalyAlerts.tsx": "Anomaly display components",
    "AIInsightGenerator.tsx": "AI insights panel",
  },

  utilities: {
    "scoreCalculation.ts": "Score and status logic",
    "anomalyDetection.ts": "Z-score anomaly detection",
    "predictions.ts": "Time series forecasting",
    "insightGenerator.ts": "Insight rule engine",
  },

  hooks: {
    "useEnhancedDashboardData.ts": "Optimized data calculations",
  },
};
