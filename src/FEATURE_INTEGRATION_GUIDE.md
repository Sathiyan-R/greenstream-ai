# Feature Integration Guide

## 1. IMPORTS FOR NEW FEATURES

```typescript
import { SustainabilityScoreCard } from "@/components/dashboard/SustainabilityScoreCard";
import { PredictionChart } from "@/components/dashboard/PredictionChart";
import { AnomalyAlerts, AnomalySummary } from "@/components/dashboard/AnomalyAlerts";
import { AIInsightGenerator } from "@/components/dashboard/AIInsightGenerator";
import { useEnhancedDashboardData } from "@/hooks/useEnhancedDashboardData";
import { calculateSustainabilityScore } from "@/lib/scoreCalculation";
```

## 2. IN YOUR DASHBOARD COMPONENT

```typescript
const YourDashboard = () => {
  const { state, loading, apiStatus, refresh } = useDashboardData();

  // NEW: Use enhanced dashboard hook for optimized data
  const { anomalies, scoreFactors, energyHistory, energyStats } = 
    useEnhancedDashboardData({ dashboardState: state });

  // Optional: Track previous score for trend
  const [previousScore, setPreviousScore] = React.useState(0);

  React.useEffect(() => {
    if (state.sustainabilityScore) {
      setPreviousScore(state.sustainabilityScore);
    }
  }, [state.sustainabilityScore]);

  return (
    <main className="min-h-screen bg-background">
      {/* Existing header code... */}

      <div className="p-4 md:p-6 max-w-[1600px] mx-auto space-y-4">
        {/* FEATURE 1: ANOMALY ALERTS (SHOW AT TOP) */}
        {anomalies.length > 0 && (
          <section className="space-y-2">
            <h2 className="text-base font-heading font-bold text-destructive">
              ⚠️ Active Anomalies ({anomalies.length})
            </h2>
            <AnomalyAlerts anomalies={anomalies} maxDisplay={3} />
          </section>
        )}

        {/* EXISTING DASHBOARD METRICS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* NEW: Sustainability Score */}
          <div className="lg:col-span-1">
            <SustainabilityScoreCard
              factors={scoreFactors}
              previousScore={previousScore}
            />
          </div>
        </div>

        {/* FEATURE 2: PREDICTION CHARTS */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <PredictionChart
            energyHistory={energyHistory.map(val => typeof val === "number" ? val : 0)}
            aqi={state.airQuality?.aqi || 50}
            temperature={state.weather?.temperature || 20}
            windSpeed={state.weather?.wind_speed || 0}
            carbonIntensity={0.4}
          />

          {/* FEATURE 3: ANOMALY SUMMARY */}
          <AnomalySummary anomalies={anomalies} />
        </section>

        {/* FEATURE 4: AI INSIGHTS */}
        <section>
          <AIInsightGenerator dashboardState={state} />
        </section>
      </div>
    </main>
  );
};
```

## 3. PERFORMANCE RECOMMENDATIONS

### Enable React Query Caching

```typescript
useQuery({
  queryKey: ['weather', location],
  queryFn: () => fetchWeather(location),
  staleTime: 5 * 60 * 1000,  // 5 minutes
  gcTime: 10 * 60 * 1000,    // 10 minutes
});
```

### Lazy Load Heavy Components

```typescript
import { lazy, Suspense } from 'react';

const PredictionChart = lazy(() => 
  import('@/components/dashboard/PredictionChart')
    .then(m => ({ default: m.PredictionChart }))
);

<Suspense fallback={<Skeleton />}>
  <PredictionChart {...props} />
</Suspense>
```

## 4. TYPE DEFINITIONS

All types are defined in the utility files:
- `ScoreFactors` in `scoreCalculation.ts`
- `Anomaly` in `anomalyDetection.ts`
- `PredictionPoint` in `predictions.ts`
- `AIInsight` in `insightGenerator.ts`

## 5. TESTING

- Test with React DevTools Profiler to verify performance gains
- Check for 4x faster re-renders
- Verify all components render without TypeScript errors
- Test responsiveness on mobile devices
