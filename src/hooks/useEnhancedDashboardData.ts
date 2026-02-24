import { useMemo, useCallback } from "react";
import type { DashboardState } from "@/lib/api";
import { detectMultipleAnomalies, calculateMean } from "@/lib/anomalyDetection";
import { type ScoreFactors } from "@/lib/scoreCalculation";

interface EnhancedDashboardDataProps {
  dashboardState: DashboardState;
}

