/**
 * EXAMPLE: Enhanced Dashboard Component
 * 
 * This is a complete example showing how to integrate all 5 advanced features
 * into your existing Dashboard.tsx
 * 
 * Copy this as a reference for your actual implementation.
 */

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground text-sm">Loading environmental data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ========== HEADER ========== */}
      <header className="border-b border-border px-6 py-3 flex items-center justify-between sticky top-0 z-50 bg-background/80 backdrop-blur-xl">
        <Link to="/" className="flex items-center gap-2">
          <Leaf className="w-5 h-5 text-primary" />
          <span className="font-heading font-bold text-lg">GreenStream AI</span>
        </Link>

        <div className="flex items-center gap-4">
          {/* ✅ FEATURE 3: Anomaly badge in header */}
          {anomalies.length > 0 && (
            <AnomalyBadge
              count={anomalies.length}
              severe={getAnomalyCount("high") > 0}
            />
          )}

          <div className="flex items-center gap-2 px-2 py-1 rounded-lg bg-primary/10">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse-glow" />
            <span className="text-xs font-heading text-primary font-semibold">LIVE</span>
          </div>

          <button
            onClick={refresh}
            className="p-2 rounded-lg hover:bg-muted/50 transition-colors"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </header>

      {/* ========== MAIN CONTENT ========== */}
      <div className="p-4 md:p-6 max-w-[1600px] mx-auto space-y-6">
        
        {/* ========== SECTION 1: CRITICAL ALERTS ========== */}
        {/* ✅ FEATURE 3: Show high-severity anomalies at top */}
        {getAnomalyCount("high") > 0 && (
          <motion.section
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3 p-4 rounded-lg border border-red-200 bg-red-50"
          >
            <div className="flex items-center gap-2 text-red-700 font-semibold">
              <AlertTriangle className="w-5 h-5" />
              <h2>Critical Anomalies ({getAnomalyCount("high")})</h2>
            </div>
            <AnomalyAlerts
              anomalies={anomalies.filter((a) => a.severity === "high")}
              maxDisplay={3}
            />
          </motion.section>
        )}

        {/* ========== SECTION 2: KEY METRICS GRID ========== */}
        {/* ✅ FEATURE 1: Sustainability Score Card as primary metric */}
        <section>
          <h2 className="text-base font-heading font-bold mb-4">Dashboard Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Sustainability Score - FEATURE 1 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
            >
              <SustainabilityScoreCard
                factors={scoreFactors}
                previousScore={previousScore}
              />
            </motion.div>

            {/* Example: Existing metric cards would go here */}
            {/* 
            <MetricCard label="Current Energy" value={energyStats.current} unit="kWh" icon={Zap} />
            <MetricCard label="AQI" value={state.airQuality?.aqi} unit="points" icon={Wind} />
            <MetricCard label="Carbon" value={state.carbon?.total} unit="kg CO₂" icon={Activity} />
            */}
          </div>
        </section>

        {/* ========== SECTION 3: PREDICTIONS & ANOMALIES ========== */}
        <section className="space-y-4">
          <h2 className="text-base font-heading font-bold">Analysis & Forecasts</h2>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            
            {/* Prediction Chart - FEATURE 2 */}
            <motion.div
              className="lg:col-span-3"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <PredictionChart
                energyHistory={energyHistory.map((val) => typeof val === "number" ? val : 0)}
                aqi={state.airQuality?.aqi || 50}
                temperature={state.weather?.temperature || 20}
                windSpeed={state.weather?.windSpeed || 0}
                carbonIntensity={0.4}
              />
            </motion.div>

            {/* Anomaly Summary - FEATURE 3 */}
            <motion.div
              className="lg:col-span-2 space-y-4"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <AnomalySummary anomalies={anomalies} />
            </motion.div>
          </div>
        </section>

        {/* ========== SECTION 4: ALL ANOMALIES ========== */}
        {/* ✅ FEATURE 3: Comprehensive anomaly display */}
        {anomalies.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-3"
          >
            <h2 className="text-base font-heading font-bold">All Anomalies</h2>
            <AnomalyAlerts
              anomalies={anomalies}
              maxDisplay={5}
            />
          </motion.section>
        )}

        {/* ========== SECTION 5: AI INSIGHTS ========== */}
        {/* ✅ FEATURE 4: AI-powered insights */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <AIInsightGenerator
            dashboardState={state}
            onLoadingChange={(loading) => {
              // Handle loading state if needed
            }}
          />
        </motion.section>

        {/* ========== SECTION 6: ENERGY EFFICIENCY ========== */}
        {/* Example: Additional dashboard section */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-panel rounded-lg border border-border p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-heading font-bold">Energy Statistics</h3>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Current</p>
              <p className="text-lg font-semibold">{energyStats.current} kWh</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Average</p>
              <p className="text-lg font-semibold">{energyStats.average.toFixed(0)} kWh</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Peak</p>
              <p className="text-lg font-semibold">{energyStats.peak.toFixed(0)} kWh</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Minimum</p>
              <p className="text-lg font-semibold">{energyStats.min.toFixed(0)} kWh</p>
            </div>
          </div>
        </motion.section>

        {/* ========== FOOTER INFO ========== */}
        <div className="mt-8 p-4 rounded-lg bg-muted/30 border border-border/30 text-center text-sm text-muted-foreground">
          <p>Last updated: {new Date().toLocaleTimeString()}</p>
          <p className="text-xs mt-2">
            ✨ All features demonstrated: Sustainability Score • Predictions • Anomalies • AI Insights • Optimizations
          </p>
        </div>
      </div>
    </div>
  );
});

EnhancedDashboard.displayName = "EnhancedDashboard";

export default EnhancedDashboard;

/**
 * NEXT STEPS:
 * 
 * 1. Copy this file to src/pages/Dashboard.tsx
 * 2. Or integrate the sections into your existing Dashboard.tsx
 * 3. Replace placeholder metric cards with your actual components
 * 4. Adjust spacing and grid layout to match your design
 * 5. Verify all imports are available
 * 6. Test with real data from your backend
 * 7. Adjust colors/styling to match your theme
 * 8. Performance test with React DevTools Profiler
 */
