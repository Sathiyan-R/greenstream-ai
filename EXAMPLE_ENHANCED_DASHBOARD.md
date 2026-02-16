# Enhanced Dashboard Example

Complete example showing how to integrate all 5 advanced features into your existing Dashboard.tsx

## Complete Implementation

```typescript
import { memo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { RefreshCw, AlertTriangle, TrendingUp } from "lucide-react";

// New feature imports
import { SustainabilityScoreCard } from "@/components/dashboard/SustainabilityScoreCard";
import { PredictionChart } from "@/components/dashboard/PredictionChart";
import { AnomalyAlerts, AnomalySummary, AnomalyBadge } from "@/components/dashboard/AnomalyAlerts";
import { AIInsightGenerator } from "@/components/dashboard/AIInsightGenerator";

// Hooks and utilities
import { useDashboardData } from "@/hooks/useDashboardData";
import { useEnhancedDashboardData } from "@/hooks/useEnhancedDashboardData";
import { Link } from "react-router-dom";
import { Leaf } from "lucide-react";

/**
 * Enhanced Dashboard Component
 * Integrates all 5 advanced features
 */
export const EnhancedDashboard = memo(() => {
  // ✅ Get existing dashboard data
  const { state, loading, apiStatus, refresh } = useDashboardData();

  // ✅ FEATURE 5: Use enhanced data hook for optimized calculations
  const { anomalies, scoreFactors, energyHistory, energyStats, getAnomalyCount } =
    useEnhancedDashboardData({ dashboardState: state });

  // Track previous score for trend indicator
  const [previousScore, setPreviousScore] = useState(state.sustainabilityScore || 0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Update previous score when current changes
  useEffect(() => {
    if (state.sustainabilityScore && state.sustainabilityScore !== previousScore) {
      setPreviousScore(state.sustainabilityScore);
    }
  }, [state.sustainabilityScore, previousScore]);

  if (loading)
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-32 bg-muted rounded-lg" />
          <div className="h-48 bg-muted rounded-lg" />
        </div>
      </div>
    );

  return (
    <main className="p-6 max-w-[1600px] mx-auto">
      {/* ============================================================ */}
      {/* ALERT SECTION - Show anomalies first for immediate attention */}
      {/* ============================================================ */}
      {anomalies.length > 0 && (
        <motion.div
          className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <h2 className="text-lg font-bold text-red-600">Active Anomalies Detected</h2>
            <AnomalyBadge count={anomalies.length} severe={anomalies.some((a) => a.severity === "high")} />
          </div>

          {/* ✅ FEATURE 3: Anomaly Alerts Component */}
          <AnomalyAlerts anomalies={anomalies.filter((a) => a.severity === "high")} maxDisplay={3} />
        </motion.div>
      )}

      {/* ============================================================ */}
      {/* METRICS GRID - Main dashboard cards */}
      {/* ============================================================ */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Key Metrics</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* ✅ FEATURE 1: Sustainability Score Card */}
          <motion.div
            key="score"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <SustainabilityScoreCard factors={scoreFactors} previousScore={previousScore} />
          </motion.div>

          {/* Other metric cards from your existing dashboard */}
          {/* Example: AQI Card, Energy Card, etc. */}
        </div>
      </div>

      {/* ============================================================ */}
      {/* FORECASTS SECTION - Predictions for next 12 hours */}
      {/* ============================================================ */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-6 w-6" />
            12-Hour Forecast
          </div>
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* ✅ FEATURE 2: Prediction Charts */}
          <motion.div
            className="bg-card rounded-lg border p-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <PredictionChart
              energyHistory={energyHistory.map((val) => typeof val === "number" ? val : 0)}
              aqi={state.airQuality?.aqi || 50}
              temperature={state.weather?.temperature || 20}
              windSpeed={state.weather?.wind_speed || 0}
              carbonIntensity={0.4}
            />
          </motion.div>

          {/* ✅ FEATURE 3: Anomaly Summary */}
          <motion.div
            className="bg-card rounded-lg border p-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <AnomalySummary anomalies={anomalies} />
          </motion.div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* AI INSIGHTS SECTION - AI-powered recommendations */}
      {/* ============================================================ */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">
          <div className="flex items-center gap-2">
            <Leaf className="h-6 w-6" />
            AI Insights
          </div>
        </h2>

        {/* ✅ FEATURE 4: AI Insight Generator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <AIInsightGenerator
            dashboardState={state}
            onLoadingChange={(loading) => {
              // Optional: Implement your own loading state
            }}
          />
        </motion.div>
      </div>

      {/* ============================================================ */}
      {/* FOOTER - Links and controls */}
      {/* ============================================================ */}
      <div className="flex items-center justify-between pt-6 border-t">
        <div className="text-sm text-muted-foreground">
          Last updated: {new Date().toLocaleTimeString()}
        </div>

        <motion.button
          onClick={refresh}
          whileHover={{ rotate: 180 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh Data
        </motion.button>
      </div>

      {/* ============================================================ */}
      {/* DEBUG INFO - Only in development */}
      {/* ============================================================ */}
      {process.env.NODE_ENV === "development" && (
        <motion.div
          className="mt-8 p-4 bg-slate-100 rounded-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="font-mono text-sm font-bold mb-2">Debug Info</h3>
          <div className="font-mono text-xs space-y-1">
            <div>Anomalies: {getAnomalyCount()}</div>
            <div>Energy Stats: {energyStats && `Avg: ${energyStats.average.toFixed(2)}W`}</div>
            <div>API Status: {apiStatus}</div>
          </div>
        </motion.div>
      )}
    </main>
  );
});
```

## Integration Steps

1. **Copy the component structure** above into your `Dashboard.tsx` or create a new route for `EnhancedDashboard`

2. **Verify all imports resolve correctly** by checking for red squiggles in your IDE

3. **Add to your main dashboard:**
   ```typescript
   // In Dashboard.tsx or your main routing file
   import { EnhancedDashboard } from './components/pages/EnhancedDashboard';
   ```

4. **Connect to your data source** - the example uses `useDashboardData()` hook, adjust as needed for your API

5. **Test each feature:**
   - Sustainability Score Card renders with proper styling
   - Prediction charts show 12-hour forecasts
   - Anomalies display in the alert section
   - AI insights generate automatically
   - Performance is acceptable with React DevTools Profiler

## Key Features Demonstrated

### Feature 1: Sustainability Score Card
- Circular progress indicator (0-100)
- Color-coded status (excellent, good, fair, poor, critical)
- Trend indicator showing improvement/decline
- Component: `SustainabilityScoreCard`

### Feature 2: Prediction Charts
- 12-hour forecasts using exponential smoothing
- Tabs for Energy, AQI, and Carbon predictions
- Responsive layout
- Component: `PredictionChart`

### Feature 3: Anomaly Detection
- Real-time anomaly detection using Z-score
- Severity classification (low, medium, high)
- Visual alert badges and detailed component
- Components: `AnomalyAlerts`, `AnomalySummary`, `AnomalyBadge`

### Feature 4: AI Insight Generator
- Automatic insight generation from 6 categories
- 20+ built-in rules
- Color-coded severity
- Component: `AIInsightGenerator`

### Feature 5: Performance Optimizations
- Memoized components to prevent unnecessary renders
- Optimized data calculations with `useEnhancedDashboardData`
- Efficient trend analysis
- React Query integration for data fetching

## Customization Options

### Change Animation Timing
```typescript
// Adjust delay values in motion.div components
transition={{ delay: 0.1 }}  // Increase for slower cascade
```

### Modify Anomaly Display
```typescript
// Filter anomalies by severity
anomalies={anomalies.filter((a) => a.severity === "high")}

// Or show all
anomalies={anomalies}
```

### Customize Chart Props
```typescript
<PredictionChart
  energyHistory={energyHistory}
  aqi={state.airQuality?.aqi || 50}
  temperature={state.weather?.temperature || 20}
  windSpeed={state.weather?.wind_speed || 0}
  carbonIntensity={0.4}  // Change CO2 emission factor
/>
```

## Common Issues and Solutions

**Imports not resolving?**
- Verify all components are in `src/components/dashboard/`
- Check that hooks are in `src/hooks/`
- Ensure utility files are in `src/lib/`

**No data displaying?**
- Check that `useDashboardData()` returns valid state object
- Verify API endpoints are accessible
- Use browser DevTools to inspect API responses

**Performance issues?**
- Ensure components are wrapped with `React.memo()`
- Use React DevTools Profiler to identify bottlenecks
- Check that calculations are properly memoized with `useMemo()`

## Next Steps

1. Copy this structure into your actual Dashboard implementation
2. Adjust imports based on your project structure
3. Connect to your real data sources
4. Deploy and monitor performance
5. Gather user feedback and iterate
