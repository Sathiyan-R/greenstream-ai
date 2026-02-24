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

