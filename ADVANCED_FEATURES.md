# GreenStream AI - Advanced Features Documentation

## Overview

This document describes the 5 advanced features added to enhance your sustainability dashboard.

---

## 1. Sustainability Score Card

### Purpose
Provides a unified sustainability metric combining AQI, energy consumption, carbon emissions, and temperature severity.

### Components
- **File**: `src/components/dashboard/SustainabilityScoreCard.tsx`
- **Utilities**: `src/lib/scoreCalculation.ts`

### Features
- ✅ Circular progress indicator (0-100)
- ✅ 5-level status system: Excellent, Good, Moderate, Poor, Critical
- ✅ Trend indicator (↑ improving, ↓ declining, → stable)
- ✅ Factor breakdown showing component contributions
- ✅ Color-coded based on score

### Score Calculation Formula
```
Score = 100 - (aqi × 0.2 + energy × 0.3 + carbon × 0.3 + tempRisk × 0.2)

Weights:
- AQI: 20% (air quality priority)
- Energy: 30% (consumption impact)
- Carbon: 30% (emission impact)
- Temperature: 20% (climate severity)
```

### Usage
```tsx
import { SustainabilityScoreCard } from "@/components/dashboard/SustainabilityScoreCard";
import { calculateSustainabilityScore } from "@/lib/scoreCalculation";

const factors = {
  aqi: 75,                    // Air Quality Index (0-300)
  energyConsumption: 450,     // kWh
  carbonEmission: 180,        // kg CO2e
  temperatureSeverity: 5,     // °C deviation from 20°C baseline
};

<SustainabilityScoreCard factors={factors} previousScore={72} />
```

### Status Levels
| Score | Status | Color | Description |
|-------|--------|-------|-------------|
| 80-100 | Excellent | 🟢 Emerald | Outstanding sustainability |
| 60-79 | Good | 🟢 Green | Healthy conditions |
| 40-59 | Moderate | 🟡 Yellow | Some concerns |
| 20-39 | Poor | 🟠 Orange | Significant issues |
| 0-19 | Critical | 🔴 Red | Urgent action needed |

---

## 2. Prediction Charts

### Purpose
Forecasts energy consumption, AQI, and carbon emissions for the next 12-24 hours using ML-inspired algorithms.

### Components
- **File**: `src/components/dashboard/PredictionChart.tsx`
- **Utilities**: `src/lib/predictions.ts`

### Features
- ✅ 12-hour forecast with 3 different metrics
- ✅ Tab-based switching between charts
- ✅ Exponential smoothing for trend prediction
- ✅ Linear regression for directional forecasts
- ✅ Weather-aware AQI predictions
- ✅ Energy consumption patterns with time-of-day variations

### Prediction Methods
1. **Energy**: Linear regression + hourly pattern simulation
2. **AQI**: Exponential smoothing + wind/temperature factors
3. **Carbon**: Derived from energy forecasts with carbon intensity

### Usage
```tsx
import { PredictionChart } from "@/components/dashboard/PredictionChart";

<PredictionChart
  energyHistory={[450, 480, 520, ...]}  // Last 48 data points
  aqi={75}                                // Current AQI
  temperature={22}                        // Current temp
  windSpeed={12}                          // Wind speed (km/h)
  carbonIntensity={0.4}                   // kg CO2 per kWh
/>
```

### Output Format
```tsx
interface PredictionPoint {
  time: string;     // "14:00" or "+3h"
  value: number;    // Predicted value
}
```

---

## 3. Anomaly Detection

### Purpose
Detects unusual patterns in environmental metrics using statistical Z-score analysis.

### Components
- **Files**: 
  - `src/lib/anomalyDetection.ts` (Detection logic)
  - `src/components/dashboard/AnomalyAlerts.tsx` (UI components)

### Features
- ✅ Z-score based anomaly detection
- ✅ Automatic severity classification (low, medium, high)
- ✅ Multi-metric anomaly tracking
- ✅ Alert banners with detailed information
- ✅ Anomaly summary dashboard
- ✅ Dismissal functionality

### Detection Algorithm
```
Z-Score = |current - mean| / stdDev

Default threshold = 2 (95% confidence)
- Z > 3: High severity
- Z > 2: Medium severity
- Z ≤ 2: Low severity or normal
```

### Usage
```tsx
import { AnomalyAlerts, AnomalySummary } from "@/components/dashboard/AnomalyAlerts";
import { detectMultipleAnomalies } from "@/lib/anomalyDetection";

const metrics = {
  "Energy Consumption": {
    current: 650,
    history: [450, 480, 520, 495, 510, 460, 470],
  },
  "Air Quality Index": {
    current: 180,
    history: [65, 68, 72, 70, 69, 75, 73],
  },
};

const anomalies = detectMultipleAnomalies(metrics);

<AnomalyAlerts anomalies={anomalies} maxDisplay={5} />
<AnomalySummary anomalies={anomalies} />
```

### Anomaly Object Structure
```tsx
interface Anomaly {
  id: string;              // Unique identifier
  metric: string;          // "Energy Consumption"
  currentValue: number;    // 650
  expectedValue: number;   // 510 (mean)
  deviation: number;       // 140
  severity: "low" | "medium" | "high";
  timestamp: Date;
  description: string;     // "Energy Consumption is unusually high (650)"
}
```

---

## 4. AI Insight Generator

### Purpose
Generates contextual insights and recommendations from dashboard data.

### Components
- **File**: `src/components/dashboard/AIInsightGenerator.tsx`
- **Utilities**: `src/lib/insightGenerator.ts`

### Features
- ✅ Multi-category insights (energy, air, carbon, weather, sustainability)
- ✅ Severity levels (info, warning, success)
- ✅ Actionable suggestions
- ✅ Automatic insight generation on data changes
- ✅ Manual refresh capability
- ✅ Correlation detection (e.g., AC usage during heat waves)

### Insight Categories
| Category | Triggers |
|----------|----------|
| **Energy** | Consumption spikes, efficiency gains |
| **Air** | AQI changes, pollutant warnings |
| **Carbon** | Emission trends, source analysis |
| **Weather** | Temperature alerts, wind patterns |
| **Sustainability** | Score changes, multi-metric analysis |
| **General** | Anomaly alerts |

### Usage
```tsx
import { AIInsightGenerator } from "@/components/dashboard/AIInsightGenerator";

<AIInsightGenerator 
  dashboardState={dashboardState}
  onLoadingChange={(loading) => setLoading(loading)}
/>
```

### Insight Example
```tsx
{
  id: "energy-high-1708012345678",
  title: "High Energy Consumption",
  message: "Current usage 650 kWh is 30% above average (510 kWh)",
  category: "energy",
  severity: "warning",
  actionable: true,
  suggestion: "Check for active appliances, optimize heating/cooling",
  timestamp: Date.now(),
}
```

### Extending with Real AI
Replace mock generation with API calls:
```tsx
const response = await fetch(`${apiUrl}/functions/v1/ai-insights`, {
  method: 'POST',
  body: JSON.stringify({ dashboardData: state }),
});
```

---

## 5. Performance Optimizations

### Applied Optimizations

#### 1. **Component Memoization**
```tsx
// All new chart components use React.memo()
export const PredictionChart = memo(({ ... }) => { ... });
export const SustainabilityScoreCard = memo(({ ... }) => { ... });
```

#### 2. **Expensive Calculations Memoization**
```tsx
const { anomalies, scoreFactors, energyHistory, energyStats } = 
  useEnhancedDashboardData({ dashboardState });
```

The `useEnhancedDashboardData` hook memoizes:
- Anomaly detection
- Score calculations
- Historical data filtering
- Statistical aggregations

#### 3. **React Query Optimization**
Configure in your API fetch functions:
```tsx
const query = useQuery({
  queryKey: ['weather', location],
  queryFn: () => fetchWeather(location),
  staleTime: 5 * 60 * 1000,    // 5 minute freshness
  gcTime: 10 * 60 * 1000,      // 10 minute cache
});
```

#### 4. **Lazy Loading Heavy Components**
```tsx
import { lazy, Suspense } from 'react';

const PredictionChart = lazy(() =>
  import('@/components/dashboard/PredictionChart')
    .then(m => ({ default: m.PredictionChart }))
);

<Suspense fallback={<Skeleton />}>
  <PredictionChart {...props} />
</Suspense>
```

#### 5. **Efficient Re-render Prevention**
- Components only re-render when their specific props change
- useMemo dependencies carefully selected
- Historical data limited to necessary window (e.g., last 48 points)

### Performance Monitoring
```tsx
// Check component render times
import { useIsomorphicLayoutEffect } from 'react';

useIsomorphicLayoutEffect(() => {
  const start = performance.now();
  return () => {
    const end = performance.now();
    console.log(`ComponentName: ${end - start}ms`);
  };
}, []);
```

---

## Integration Checklist

- [ ] Copy new component files to `src/components/dashboard/`
- [ ] Copy utility files to `src/lib/`
- [ ] Copy hook file to `src/hooks/`
- [ ] Import components in Dashboard.tsx
- [ ] Add components to dashboard grid
- [ ] Test all features render correctly
- [ ] Verify performance with React DevTools
- [ ] Adjust styling/colors for your theme
- [ ] Update types in `src/lib/api.ts` if needed
- [ ] Test with real data

---

## File Structure

```
src/
├── components/dashboard/
│   ├── SustainabilityScoreCard.tsx    (Feature 1)
│   ├── PredictionChart.tsx             (Feature 2)
│   ├── AnomalyAlerts.tsx               (Feature 3)
│   └── AIInsightGenerator.tsx           (Feature 4)
├── lib/
│   ├── scoreCalculation.ts             (Feature 1 logic)
│   ├── anomalyDetection.ts             (Feature 3 logic)
│   ├── predictions.ts                  (Feature 2 logic)
│   ├── insightGenerator.ts             (Feature 4 logic)
│   └── api.ts                          (existing)
├── hooks/
│   ├── useEnhancedDashboardData.ts     (Feature 5)
│   └── useDashboardData.ts             (existing)
└── FEATURE_INTEGRATION_GUIDE.ts        (Integration examples)
```

---

## Troubleshooting

### Charts Not Rendering
- Verify recharts is installed (`npm ls recharts`)
- Check Recharts version compatibility
- Ensure ResponsiveContainer parent has height

### Anomalies Not Detecting
- Verify historical data has at least 2 points
- Check deviation threshold (default = 2σ)
- Review Z-score calculation in anomalyDetection.ts

### Performance Issues
- Profile with React DevTools Profiler
- Check for missing memo() wrappers
- Verify useMemo dependencies are correct
- Consider lazy loading heavy components

### Styling Issues
- Ensure Tailwind is properly configured
- Check color variable names (`hsl(var(...))`)
- Verify shadcn-ui components are installed

---

## Tips for Extension

1. **Add More Predictors**: Extend `predictions.ts` with ARIMA or neural networks
2. **Real AI Backend**: Connect to Claude/GPT-4 for insights
3. **Custom Anomaly Rules**: Add domain-specific thresholds
4. **Data Export**: Add CSV export for trends
5. **Notifications**: Send alerts via email/SMS for critical anomalies

