/**
 * Dashboard Integration Guide
 * 
 * This file demonstrates how to integrate all 5 new advanced features
 * into your existing Dashboard component.
 * 
 * Copy the relevant sections into your Dashboard.tsx
 */

// ============================================================================
// 1. IMPORTS FOR NEW FEATURES
// ============================================================================

/*
import { SustainabilityScoreCard } from "@/components/dashboard/SustainabilityScoreCard";
import { PredictionChart } from "@/components/dashboard/PredictionChart";
import { AnomalyAlerts, AnomalySummary } from "@/components/dashboard/AnomalyAlerts";
import { AIInsightGenerator } from "@/components/dashboard/AIInsightGenerator";
import { useEnhancedDashboardData } from "@/hooks/useEnhancedDashboardData";
import { calculateSustainabilityScore } from "@/lib/scoreCalculation";
*/

// ============================================================================
// 2. IN YOUR DASHBOARD COMPONENT
// ============================================================================

/*
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
        {/* 
          ========== FEATURE 1: ANOMALY ALERTS (SHOW AT TOP) ==========
          Display anomalies prominently for immediate action
        */}
        {anomalies.length > 0 && (
          <section className="space-y-2">
            <h2 className="text-base font-heading font-bold text-destructive">
              ⚠️ Active Anomalies ({anomalies.length})
            </h2>
            <AnomalyAlerts anomalies={anomalies} maxDisplay={3} />
          </section>
        )}

        {/*
          ========== EXISTING DASHBOARD METRICS ==========
          Keep your existing metric cards here
        */}
        {/* Your existing metrics grid... */}

        {/*
          ========== FEATURE 1: SUSTAINABILITY SCORE ==========
          Add to main metrics grid (high priority position)
        */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Existing metric cards */}

          {/* NEW: Sustainability Score */}
          <div className="lg:col-span-1">
            <SustainabilityScoreCard
              factors={scoreFactors}
              previousScore={previousScore}
            />
          </div>
        </div>

        {/*
          ========== FEATURE 2: PREDICTION CHARTS ==========
          Add as a prominent section below metrics
        */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <PredictionChart
            energyHistory={energyHistory}
            aqi={state.airQuality?.aqi || 50}
            temperature={state.weather?.temperature || 20}
            windSpeed={state.weather?.windSpeed || 0}
            carbonIntensity={0.4}
          />

          {/*
            ========== FEATURE 3: ANOMALY SUMMARY ==========
            Show comprehensive anomaly analysis
          */}
          <AnomalySummary anomalies={anomalies} />
        </section>

        {/*
          ========== FEATURE 4: AI INSIGHTS ==========
          Add as a prominent card
        */}
        <section>
          <AIInsightGenerator dashboardState={state} />
        </section>

        {/* Your existing dashboard sections */}
      </div>
    </main>
  );
};
*/

// ============================================================================
// 3. PERFORMANCE OPTIMIZATION TIPS
// ============================================================================

/*
A. MEMOIZE YOUR CHARTS:
   - Both PredictionChart and existing Recharts components are wrapped in memo()
   - This prevents re-renders when props haven't changed

B. REACT QUERY CACHING:
   In your useDashboardData hook, update staleTime:

   const weatherQuery = useQuery({
     queryKey: ['weather', location],
     queryFn: () => fetchWeather(location),
     staleTime: 5 * 60 * 1000,  // 5 minutes - data stays fresh
     gcTime: 10 * 60 * 1000,    // 10 minutes - then garbage collected
   });

C. LAZY LOAD HEAVY SECTIONS:
   import { lazy, Suspense } from 'react';
   
   const AIInsightGenerator = lazy(() => 
     import('@/components/dashboard/AIInsightGenerator')
       .then(m => ({ default: m.AIInsightGenerator }))
   );

   // In JSX:
   <Suspense fallback={<div>Loading insights...</div>}>
     <AIInsightGenerator dashboardState={state} />
   </Suspense>

D. AVOID UNNECESSARY RE-RENDERS:
   - useEnhancedDashboardData already memoizes expensive calculations
   - Only pass necessary dependencies to useMemo/useCallback
   - Consider splitting large dashboard into smaller components with React.memo()
*/

// ============================================================================
// 4. API INTEGRATION FOR AI INSIGHTS
// ============================================================================

/*
OPTIONAL: For real AI-powered insights, extend your backend:

In your Supabase Edge Function (supabase/functions/ai-insights/index.ts):

export default async (req: Request) => {
  const { dashboardData } = await req.json();

  const prompt = `
    Analyze this environmental data and provide 2-3 actionable insights:
    - AQI: ${dashboardData.aqi}
    - Energy: ${dashboardData.energy} kWh
    - Carbon: ${dashboardData.carbon} kg CO2
    - Temperature: ${dashboardData.temperature}°C

    Provide insights in JSON format with title, message, category, severity.
  `;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4-turbo',
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  return response;
};

Then update AIInsightGenerator to call this endpoint instead of generateInsights().
*/

// ============================================================================
// 5. TESTING YOUR NEW FEATURES
// ============================================================================

/*
Test anomaly detection:
- Create mock data with sudden spikes
- Verify alerts appear with correct severity
- Test dismissal functionality

Test predictions:
- Verify chart renders with correct data
- Check tab switching works smoothly
- Monitor performance with DevTools

Test sustainability score:
- Adjust factors and verify score calculation
- Check trend indicator shows correct direction
- Test color changes based on score ranges

Test AI insights:
- Verify insights generate on data changes
- Test refresh button functionality
- Check formatting and icons display correctly
*/

// ============================================================================
// 6. COMPONENT EXPORTS
// ============================================================================

export const FEATURE_COMPONENTS = {
  SustainabilityScoreCard: "src/components/dashboard/SustainabilityScoreCard.tsx",
  PredictionChart: "src/components/dashboard/PredictionChart.tsx",
  AnomalyAlerts: "src/components/dashboard/AnomalyAlerts.tsx",
  AIInsightGenerator: "src/components/dashboard/AIInsightGenerator.tsx",
};

export const UTILITY_MODULES = {
  scoreCalculation: "src/lib/scoreCalculation.ts",
  anomalyDetection: "src/lib/anomalyDetection.ts",
  predictions: "src/lib/predictions.ts",
  insightGenerator: "src/lib/insightGenerator.ts",
  useEnhancedDashboardData: "src/hooks/useEnhancedDashboardData.ts",
};

export const QUICK_START_CHECKLIST = [
  "✅ Import new components into Dashboard.tsx",
  "✅ Add SustainabilityScoreCard to metric grid",
  "✅ Add PredictionChart section",
  "✅ Add AnomalyAlerts at top of dashboard",
  "✅ Add AIInsightGenerator section",
  "✅ Import useEnhancedDashboardData hook",
  "✅ Update API.ts DashboardState type if needed",
  "✅ Test all components render correctly",
  "✅ Verify performance with React DevTools",
  "✅ Adjust layout/styling for your theme",
];
