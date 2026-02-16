import { memo, useState, useCallback } from "react";
import { Lightbulb, RefreshCw, Activity, Zap, Wind, AlertCircle } from "lucide-react";
import { generateInsights, formatInsightForDisplay, type AIInsight } from "@/lib/insightGenerator";
import type { DashboardState } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface AIInsightGeneratorProps {
  dashboardState: DashboardState;
  onLoadingChange?: (loading: boolean) => void;
}

/**
 * Get icon for insight category
 */
function getCategoryIcon(category: string) {
  switch (category) {
    case "energy":
      return <Zap className="w-4 h-4" />;
    case "air":
      return <Wind className="w-4 h-4" />;
    case "carbon":
      return <Activity className="w-4 h-4" />;
    case "weather":
      return <AlertCircle className="w-4 h-4" />;
    default:
      return <Lightbulb className="w-4 h-4" />;
  }
}

/**
 * Insight Card Component
 */
const InsightCard = memo(({ insight }: { insight: AIInsight }) => {
  const styling = formatInsightForDisplay(insight);

  return (
    <div className={`border rounded-lg p-4 ${styling.bgColor} animate-in fade-in slide-in-from-left-2 duration-300`}>
      <div className="flex gap-3">
        <div className={`flex-shrink-0 ${styling.textColor}`}>{getCategoryIcon(insight.category)}</div>
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-semibold ${styling.textColor}`}>{insight.title}</p>
          <p className={`text-xs mt-1 ${styling.textColor} opacity-90`}>{insight.message}</p>

          {insight.suggestion && (
            <div className={`mt-2 p-2 rounded bg-white/50 border ${styling.borderColor}`}>
              <p className="text-xs font-medium">💡 Suggestion:</p>
              <p className={`text-xs mt-0.5 ${styling.textColor}`}>{insight.suggestion}</p>
            </div>
          )}

          <p className={`text-xs mt-2 opacity-60 ${styling.textColor}`}>
            {insight.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </p>
        </div>
      </div>
    </div>
  );
});

InsightCard.displayName = "InsightCard";

/**
 * AI Insight Generator Component
 * Generates and displays contextual insights from dashboard data
 */
export const AIInsightGenerator = memo(({ dashboardState, onLoadingChange }: AIInsightGeneratorProps) => {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const generateNewInsights = useCallback(() => {
    setIsLoading(true);
    onLoadingChange?.(true);

    // Simulate AI processing delay
    setTimeout(() => {
      const newInsights = generateInsights(dashboardState);
      setInsights(newInsights);
      setIsLoading(false);
      onLoadingChange?.(false);
    }, 500);
  }, [dashboardState, onLoadingChange]);

  // Generate insights on mount and when dashboard state changes significantly
  const insightGenerationTriggers = [
    dashboardState.airQuality?.aqi,
    dashboardState.weather?.temperature,
    dashboardState.rollingAvgUsage,
    dashboardState.anomalies?.length,
  ].join("-");

  // Auto-generate insights on significant changes
  React.useEffect(() => {
    generateNewInsights();
  }, [insightGenerationTriggers]);

  return (
    <Card className="glass-panel border-border p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-primary" />
          <div>
            <h3 className="text-lg font-heading font-bold">AI Insights</h3>
            <p className="text-xs text-muted-foreground">Real-time environmental analysis</p>
          </div>
        </div>
        <Button
          onClick={generateNewInsights}
          disabled={isLoading}
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Loading State */}
      {isLoading && insights.length === 0 && (
        <div className="flex items-center justify-center py-8">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-muted-foreground">Analyzing environmental data...</p>
          </div>
        </div>
      )}

      {/* Insights List */}
      {insights.length > 0 && (
        <div className="space-y-3">
          {insights.map((insight) => (
            <InsightCard key={insight.id} insight={insight} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && insights.length === 0 && (
        <div className="py-8 text-center">
          <Lightbulb className="w-8 h-8 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">No insights available at this time</p>
          <p className="text-xs text-muted-foreground/70 mt-1">Check back when new data arrives</p>
        </div>
      )}

      {/* Footer Info */}
      {insights.length > 0 && (
        <div className="mt-4 p-3 bg-muted/30 rounded-lg border border-border/30">
          <p className="text-xs text-muted-foreground">
            ✨ These insights are AI-generated based on current environmental metrics and historical patterns.
            Use as guidance for sustainability decisions.
          </p>
        </div>
      )}
    </Card>
  );
});

AIInsightGenerator.displayName = "AIInsightGenerator";

// Import React for useEffect
import React from "react";
