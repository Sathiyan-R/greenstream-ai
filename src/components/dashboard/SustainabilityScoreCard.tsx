import { memo } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { calculateSustainabilityScore, getScoreStatus, calculateScoreTrend, type ScoreFactors } from "@/lib/scoreCalculation";

interface SustainabilityScoreCardProps {
  factors: ScoreFactors;
  previousScore?: number;
}

/**
 * Circular progress component for score visualization
 */
const CircularProgress = ({ score, color }: { score: number; color: string }) => {
  const circumference = 2 * Math.PI * 45; // radius = 45
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative w-32 h-32 flex items-center justify-center">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          className="text-muted-foreground/20"
        />
        {/* Progress circle */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke={`hsl(var(--${color}))`}
          strokeWidth="3"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500"
        />
      </svg>
      {/* Center text */}
      <div className="absolute flex flex-col items-center gap-0.5">
        <div className="text-3xl font-bold">{score}</div>
        <div className="text-xs text-muted-foreground">/100</div>
      </div>
    </div>
  );
};

/**
 * Sustainability Score Card Component
 * Displays overall sustainability metric with circular progress indicator
 */
export const SustainabilityScoreCard = memo(
  ({ factors, previousScore = 0 }: SustainabilityScoreCardProps) => {
    const currentScore = calculateSustainabilityScore(factors);
    const status = getScoreStatus(currentScore);
    const trend = previousScore > 0 ? calculateScoreTrend(currentScore, previousScore) : { direction: 0, change: 0 };

    const colorMap = {
      emerald: "primary",
      green: "green-500",
      yellow: "yellow-500",
      orange: "orange-500",
      red: "destructive",
    };

    return (
      <div className="glass-panel rounded-lg border border-border p-6 space-y-6">
        {/* Header */}
        <div>
          <h3 className="text-lg font-heading font-bold">Sustainability Score</h3>
          <p className="text-sm text-muted-foreground">Overall environmental health</p>
        </div>

        {/* Content Grid */}
        <div className="flex flex-col items-center gap-6">
          {/* Circular Progress */}
          <CircularProgress score={currentScore} color={colorMap[status.color]} />

          {/* Status and Trend */}
          <div className="w-full space-y-3 text-center">
            {/* Status Label */}
            <div>
              <p className={`text-sm font-semibold ${status.color === "emerald" ? "text-emerald-600" : status.color === "green" ? "text-green-600" : status.color === "yellow" ? "text-yellow-600" : status.color === "orange" ? "text-orange-600" : "text-red-600"}`}>
                {status.label}
              </p>
              <p className="text-xs text-muted-foreground">{status.description}</p>
            </div>

            {/* Trend Indicator */}
            {previousScore > 0 && (
              <div className="flex items-center justify-center gap-2 px-2 py-2 rounded-lg bg-muted/50">
                {trend.direction === 1 ? (
                  <TrendingUp className="w-4 h-4 text-green-600" />
                ) : trend.direction === -1 ? (
                  <TrendingDown className="w-4 h-4 text-red-600" />
                ) : (
                  <div className="w-1 h-1 rounded-full bg-muted-foreground" />
                )}
                <span className="text-xs font-medium">
                  {trend.direction === 0
                    ? "No change"
                    : `${trend.direction === 1 ? "↑" : "↓"} ${trend.change.toFixed(1)} points`}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Factor Breakdown */}
        <div className="pt-4 border-t border-border space-y-3">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Factors</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Air Quality (AQI)</p>
              <p className="text-sm font-semibold">{factors.aqi}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Energy (kWh)</p>
              <p className="text-sm font-semibold">{factors.energyConsumption}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Carbon (kg CO₂)</p>
              <p className="text-sm font-semibold">{factors.carbonEmission}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Temp Risk</p>
              <p className="text-sm font-semibold">{factors.temperatureSeverity}°C</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

SustainabilityScoreCard.displayName = "SustainabilityScoreCard";
