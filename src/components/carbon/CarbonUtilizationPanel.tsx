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

  // Get selected strategy objects
  const selectedStrategyObjects = recommendation.recommendedStrategies.filter(
    (s) => selectedStrategies.includes(s.name)
  );

  // Simulate scenario with selected strategies
  const simulation = useMemo(
    () =>
      simulateScenario(
        recommendation.carbonAnalysis.carbonEmission,
        60, // Assuming base score of 60 for demo
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
        {/* Header */}
        <div className="sticky top-0 bg-gray-900 border-b border-gray-700 p-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Carbon Intelligence</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-800 rounded-lg transition"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Zone Name and Carbon Level */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-lg border p-4 ${carbonLevelBg}`}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-lg font-bold text-white">
                  {recommendation.zoneName}
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  {recommendation.carbonAnalysis.zoneType} Zone
                </p>
              </div>
              <Badge
                style={{
                  backgroundColor: `${carbonLevelColor}20`,
                  borderColor: carbonLevelColor,
                  color: carbonLevelColor,
                }}
                className="border"
              >
                {recommendation.carbonAnalysis.carbonLevel}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-[10px] text-gray-400">Carbon Emission</p>
                <p className="text-xl font-bold text-white">
                  {recommendation.carbonAnalysis.carbonEmission.toFixed(1)}{" "}
                  <span className="text-sm">kg CO₂</span>
                </p>
              </div>
              <div>
                <p className="text-[10px] text-gray-400">Energy Consumed</p>
                <p className="text-xl font-bold text-blue-300">
                  {recommendation.carbonAnalysis.energyConsumption.toFixed(0)}{" "}
                  <span className="text-sm">kWh</span>
                </p>
              </div>
            </div>
          </motion.div>

          {/* Carbon Offset Equivalents */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-green-900/20 border border-green-500/20 rounded-lg p-4"
          >
            <p className="text-sm font-semibold text-green-300 mb-3">
              🌍 Carbon Offset Equivalents
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">🌱 Trees to Plant</span>
                <span className="font-bold text-green-300">
                  {recommendation.carbonUtilization.treesNeeded} trees
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">☀️ Solar Capacity</span>
                <span className="font-bold text-yellow-300">
                  {recommendation.carbonUtilization.solarKWRequired} kW
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">⚡ EV Equivalents</span>
                <span className="font-bold text-blue-300">
                  {recommendation.carbonUtilization.evShiftEquivalent} vehicles
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">🏗️ Concrete Offset</span>
                <span className="font-bold text-cyan-300">
                  {recommendation.carbonUtilization.concreteInjectionOffset.toFixed(1)} kg
                </span>
              </div>
            </div>
          </motion.div>

          {/* Recommended Strategies */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <p className="text-sm font-semibold text-white mb-3">
              💡 Recommended Strategies (Select to Simulate)
            </p>
            <div className="space-y-2">
              {recommendation.recommendedStrategies.map((strategy) => (
                <motion.div
                  key={strategy.name}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => toggleStrategy(strategy.name)}
                  className={`p-3 rounded-lg border cursor-pointer transition ${
                    selectedStrategies.includes(strategy.name)
                      ? "bg-blue-500/20 border-blue-500/50"
                      : "bg-gray-800/50 border-gray-700/50 hover:border-gray-600"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-white">
                        {strategy.icon} {strategy.name}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {strategy.description}
                      </p>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-xs text-green-400">
                          {strategy.carbonReduction}% carbon reduction
                        </span>
                        <span className="text-xs text-gray-500">
                          {strategy.implementationDifficulty}
                        </span>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={selectedStrategies.includes(strategy.name)}
                      onChange={() => toggleStrategy(strategy.name)}
                      className="mt-1"
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Simulation Results */}
          {selectedStrategyObjects.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-purple-900/20 border border-purple-500/20 rounded-lg p-4"
            >
              <p className="text-sm font-semibold text-purple-300 mb-3">
                📊 Projected Impact Simulation
              </p>

              {/* Before/After Comparison Chart */}
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="metric" tick={{ fill: "#9ca3af", fontSize: 11 }} />
                  <YAxis tick={{ fill: "#9ca3af", fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(17, 24, 39, 0.9)",
                      border: "1px solid rgba(75, 85, 99, 0.3)",
                      borderRadius: "6px",
                      color: "#e5e7eb",
                    }}
                  />
                  <Legend wrapperStyle={{ color: "#9ca3af", fontSize: 11 }} />
                  <Bar dataKey="before" fill="#ef4444" name="Before" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="after" fill="#10b981" name="After" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="bg-gray-900/50 rounded-lg p-3">
                  <p className="text-[10px] text-gray-400">Carbon Reduction</p>
                  <p className="text-lg font-bold text-green-400">
                    {simulation.totalCarbonReductionPercent.toFixed(1)}%
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {simulation.totalCarbonReduction.toFixed(1)} kg CO₂
                  </p>
                </div>
                <div className="bg-gray-900/50 rounded-lg p-3">
                  <p className="text-[10px] text-gray-400">Score Improvement</p>
                  <p className="text-lg font-bold text-blue-400">
                    +{simulation.simulatedSustainabilityScore - simulation.baseSustainabilityScore}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    → {simulation.simulatedSustainabilityScore.toFixed(1)}/100
                  </p>
                </div>
              </div>

              {/* Timeline and Cost */}
              <div className="grid grid-cols-2 gap-3 mt-3">
                <div className="flex items-center gap-2 bg-gray-900/50 rounded-lg p-3">
                  <Clock className="w-4 h-4 text-orange-400" />
                  <div>
                    <p className="text-[10px] text-gray-400">Timeline</p>
                    <p className="text-sm font-bold text-white">
                      {simulation.timelineMonths.toFixed(1)} months
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-gray-900/50 rounded-lg p-3">
                  <DollarSign className="w-4 h-4 text-green-400" />
                  <div>
                    <p className="text-[10px] text-gray-400">Investment</p>
                    <p className="text-sm font-bold text-white">
                      ₹{(simulation.estimatedCostRupees / 100000).toFixed(1)}L
                    </p>
                  </div>
                </div>
              </div>

              {/* ROI Analysis */}
              {roiAnalysis && roiAnalysis.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  className="mt-4 bg-gradient-to-r from-emerald-900/20 to-cyan-900/20 border border-emerald-500/20 rounded-lg p-3"
                >
                  <p className="text-xs font-bold text-emerald-300 mb-3 flex items-center gap-2">
                    💰 ROI & Payback Analysis
                  </p>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {roiAnalysis.map((roi, idx) => (
                      <div key={idx} className="bg-gray-900/50 rounded-lg p-2">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-xs font-semibold text-white truncate">
                            {roi.strategyName}
                          </p>
                          <div className="flex items-center gap-1">
                            <Target className="w-3 h-3 text-emerald-400" />
                            <span className="text-[10px] font-bold text-emerald-300">
                              {roi.paybackPeriodYears.toFixed(1)}y
                            </span>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-1 text-[9px] text-gray-400">
                          <span>💵 ₹{(roi.investmentRupees / 100000).toFixed(1)}L</span>
                          <span>⏱️ {roi.annualCarbonSavings.toFixed(0)} kg/yr</span>
                          <span className="text-emerald-300">📈 {roi.roi10YearPercent.toFixed(0)}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Implementation Phases */}
          {implementationPhases.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-4"
            >
              <p className="text-sm font-semibold text-white mb-4">
                📅 Implementation Roadmap
              </p>
              
              {/* Timeline Visualization */}
              <div className="relative mb-6">
                {/* Vertical timeline line */}
                <div className="absolute left-6 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-green-500 rounded-full" />
                
                {/* Phase items */}
                <div className="space-y-4">
                  {implementationPhases.map((phase, phaseIndex) => (
                    <motion.div
                      key={phase.phase}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + phaseIndex * 0.1 }}
                      className="relative pl-20"
                    >
                      {/* Timeline dot */}
                      <div className="absolute left-0 top-1.5 w-12 h-12 flex items-center justify-center">
                        <div className="absolute w-4 h-4 bg-gradient-to-r from-blue-400 to-green-400 rounded-full" />
                        <div className="absolute w-4 h-4 bg-gradient-to-r from-blue-400 to-green-400 rounded-full animate-ping opacity-75" />
                      </div>

                      {/* Phase content */}
                      <div className="bg-gradient-to-r from-blue-900/20 to-green-900/20 border border-blue-500/20 rounded-lg p-3">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="text-xs font-bold text-blue-300 uppercase">
                              ⏱️ {phase.month}
                            </p>
                            <p className="text-sm font-semibold text-white">
                              Phase {phase.phase}
                            </p>
                          </div>
                          <div className="px-2 py-1 bg-blue-500/20 rounded text-[10px] font-bold text-blue-200 whitespace-nowrap">
                            {phase.phase === 1 ? "🟢 Easy" : phase.phase === 2 ? "🟡 Medium" : "🔴 Hard"}
                          </div>
                        </div>

                        <p className="text-xs text-gray-300 mb-2">
                          {phase.description}
                        </p>

                        {/* Strategies in this phase */}
                        <div className="space-y-1">
                          {phase.strategies.map((strategy) => {
                            const strategyObj = selectedStrategyObjects.find(
                              (s) => s.name === strategy
                            );
                            return (
                              <div
                                key={strategy}
                                className="flex items-start gap-2 text-xs text-gray-400 bg-gray-900/30 rounded p-1.5"
                              >
                                <span className="text-blue-300 font-bold">✓</span>
                                <div className="flex-1">
                                  <p className="text-gray-200">{strategy}</p>
                                  {strategyObj && (
                                    <p className="text-[9px] text-gray-500">
                                    💰 {strategyObj.estimatedCost} • ⏱️ {strategyObj.timeToImplement}
                                    </p>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Timeline Summary */}
              <div className="bg-gray-900/50 rounded-lg p-3 border border-gray-700/50">
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-center">
                    <p className="text-[10px] text-gray-400">Total Duration</p>
                    <p className="text-sm font-bold text-blue-300">
                      {simulation.timelineMonths.toFixed(0)} months
                    </p>
                  </div>
                  <div className="text-center border-l border-r border-gray-700">
                    <p className="text-[10px] text-gray-400">Total Investment</p>
                    <p className="text-sm font-bold text-green-300">
                      ₹{(simulation.estimatedCostRupees / 100000).toFixed(1)}L
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] text-gray-400">Strategies</p>
                    <p className="text-sm font-bold text-yellow-300">
                      {selectedStrategyObjects.length}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Close Button */}
          <Button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
          >
            Close Panel
          </Button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
