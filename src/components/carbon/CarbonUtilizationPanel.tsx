import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  X, 
  TrendingDown, 
  Leaf, 
  Zap, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  DollarSign,
  Target
} from "lucide-react";
import {
  CarbonRecommendation,
  getCarbonLevelColor,
  getCarbonLevelBgColor,
} from "@/lib/carbonEngine";
import {
  simulateScenario,
  generateComparisonChartData,
  generateImplementationPhases,
  calculateROI,
} from "@/lib/carbonSimulation";

interface CarbonUtilizationPanelProps {
  recommendation: CarbonRecommendation;
  onClose: () => void;
}

export const CarbonUtilizationPanel = ({
  recommendation,
  onClose,
}: CarbonUtilizationPanelProps) => {
  const [selectedStrategies, setSelectedStrategies] = useState<string[]>(
    recommendation.recommendedStrategies.slice(0, 2).map((s) => s.name)
  );

  const toggleStrategy = (strategyName: string) => {
    setSelectedStrategies((prev) =>
      prev.includes(strategyName)
        ? prev.filter((s) => s !== strategyName)
        : [...prev, strategyName]
    );
  };

  const selectedStrategyObjects = recommendation.recommendedStrategies.filter(
    (s) => selectedStrategies.includes(s.name)
  );

  const simulation = useMemo(
    () =>
      simulateScenario(
        recommendation.carbonAnalysis.carbonEmission,
        60, 
        selectedStrategyObjects
      ),
    [selectedStrategies, recommendation]
  );

  const chartData = generateComparisonChartData(simulation);
  const implementationPhases = generateImplementationPhases(selectedStrategyObjects);
  const roiAnalysis = calculateROI(selectedStrategyObjects, recommendation.carbonAnalysis.carbonEmission);

  const carbonLevelColor = getCarbonLevelColor(recommendation.carbonAnalysis.carbonLevel);
  const carbonLevelBg = getCarbonLevelBgColor(recommendation.carbonAnalysis.carbonLevel);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 300 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 300 }}
        className="fixed right-0 top-0 bottom-0 w-full max-w-lg bg-gray-900 border-l border-gray-700 overflow-y-auto z-50"
      >
        {