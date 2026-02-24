import { memo } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { calculateSustainabilityScore, getScoreStatus, calculateScoreTrend, type ScoreFactors } from "@/lib/scoreCalculation";

interface SustainabilityScoreCardProps {
  factors: ScoreFactors;
  previousScore?: number;
}

