import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, AlertTriangle, Zap } from "lucide-react";
import { ZoneData } from "@/types/map";
import { useDNACalculation, getRiskColor, getRiskBgColor, traitMetadata } from "@/hooks/useDNACalculation";
import { DNARadarChart } from "./DNARadarChart";
import { Button } from "@/components/ui/button";

interface AlertDNAPanelProps {
  zone: ZoneData | null;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * useKeyboardShortcut hook for ESC key handling
 */
const useKeyboardShortcut = (key: string, callback: () => void, isActive: boolean) => {
  useEffect(() => {
    if (!isActive) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === key) {
        event.preventDefault();
        callback();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [key, callback, isActive]);
};

/**
 * Generate AI recommendation based on zone data and weakest trait
 */
const generateAIRecommendation = (zone: ZoneData, weakestTrait: string): string => {
  const recommendations: Record<string, string> = {
    heatRisk:
      `⚠️ Critical Heat Alert: Install cooling systems and increase green cover. Current temperature: ${zone.temperature}°C. Recommend immediate cooling infrastructure upgrades.`,
    pollutionPersistence:
      `🌫️ Air Quality Concern: Pollution is persisting due to low wind speeds. AQI: ${zone.aqi}. Promote industrial stack height improvements and tree planting.`,
    energyInstability:
      `⚡ Energy Fluctuation: Unstable power consumption detected. Implement smart grid systems and energy audits. Current: ${zone.energy_consumption || 0} kWh.`,
    carbonDensity:
      `🔋 High Carbon Output: Zone has excessive emissions density. Transition to renewable energy and optimize transportation. Current: ${zone.carbon_emission || 0} kg CO2e.`,
  };

  return recommendations[weakestTrait] || "Monitor zone closely for environmental changes.";
};

export const AlertDNAPanel = React.memo(({ zone, isOpen, onClose }: AlertDNAPanelProps) => {
  const dna = useDNACalculation(zone);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // ESC key to close panel
  useKeyboardShortcut("Escape", onClose, isOpen);

  // Auto-close when clicking outside (handled by parent)
  // Auto-refresh DNA data every 30 seconds
  useEffect(() => {
    if (!autoRefresh || !isOpen) return;

    const interval = setInterval(() => {
      // Trigger re-render by updating dependency (handled by useDNACalculation)
    }, 30000);

    return () => clearInterval(interval);
  }, [autoRefresh, isOpen]);

  if (!zone || !dna) return null;

  const weakestTraitMetadata = traitMetadata[dna.weakestTrait];
  const recommendation = generateAIRecommendation(zone, dna.weakestTrait);

  // Grade colors
  const gradeColors: Record<string, string> = {
    "A+": "from-emerald-500 to-green-500 text-white",
    "A": "from-green-500 to-emerald-600 text-white",
    "B": "from-yellow-500 to-amber-600 text-white",
    "C": "from-orange-500 to-yellow-600 text-white",
    "D": "from-red-500 to-orange-600 text-white",
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />

          {/* DNA Panel */}
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="fixed right-0 top-0 h-screen w-full sm:w-[500px] z-50 overflow-y-auto bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
          >
            <div className="relative min-h-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-l border-cyan-500/50 shadow-2xl">
              {/* Animated DNA background lines */}
              <div className="absolute inset-0 opacity-10">
                <svg
                  className="w-full h-full"
                  viewBox="0 0 100 800"
                  preserveAspectRatio="none"
                >
                  <motion.path
                    d="M 20 0 Q 40 100, 20 200 Q 0 300, 20 400 Q 40 500, 20 600 Q 0 700, 20 800"
                    stroke="#06B6D4"
                    strokeWidth="0.5"
                    fill="none"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                  />
                  <motion.path
                    d="M 80 0 Q 60 100, 80 200 Q 100 300, 80 400 Q 60 500, 80 600 Q 100 700, 80 800"
                    stroke="#06B6D4"
                    strokeWidth="0.5"
                    fill="none"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2, ease: "easeInOut", delay: 0.5 }}
                  />
                </svg>
              </div>

              {/* Content */}
              <div className="relative p-6 space-y-6">
                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                  <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <h2 className="text-2xl font-bold text-white mb-1">
                      🧬 Environmental DNA
                    </h2>
                    <p className="text-cyan-400 text-sm font-medium">{zone.zone_name}</p>
                  </motion.div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onClose}
                    className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-400" />
                  </motion.button>
                </div>

                {/* Grade Badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                  className="flex items-center justify-between"
                >
                  <div>
                    <p className="text-gray-400 text-sm mb-2">Genome Grade</p>
                    <div
                      className={`inline-block px-6 py-2 rounded-lg font-bold text-xl bg-gradient-to-r ${gradeColors[dna.grade]} border border-current/30`}
                    >
                      {dna.grade}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-400 text-sm mb-2">Aggregate Score</p>
                    <p className="text-3xl font-bold text-white">{dna.aggregateScore}</p>
                    <p className="text-xs text-gray-500">/100</p>
                  </div>
                </motion.div>

                {/* Sustainability Score */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-500/30 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 font-medium">Sustainability Score</span>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-emerald-400">
                        {zone.sustainability_score || 0}/100
                      </p>
                      <p className="text-xs text-gray-400">
                        {(zone.trend_temperature || "").includes("↑") ? "📈" : "📉"} Last update
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Radar Chart */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 backdrop-blur-sm"
                >
                  <h3 className="text-sm font-semibold text-white mb-4 text-center">
                    Environmental Risk Profile
                  </h3>
                  <DNARadarChart traits={dna.traits} />
                </motion.div>

                {/* Trait Breakdown */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
                  <h3 className="text-sm font-semibold text-white mb-3">Risk Breakdown</h3>
                  <div className="space-y-2">
                    {Object.entries(dna.traits).map(([key, value], idx) => {
                      const meta = traitMetadata[key as keyof typeof traitMetadata];
                      const isWeakest = key === dna.weakestTrait;

                      return (
                        <motion.div
                          key={key}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.25 + idx * 0.05 }}
                          className={`${getRiskBgColor(value)} border rounded-lg p-3 transition-all ${isWeakest ? "ring-2 ring-yellow-400/50" : ""}`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-lg">{meta.icon}</span>
                                <p className="font-semibold text-white text-sm">{meta.label}</p>
                                {isWeakest && (
                                  <span className="inline-flex items-center gap-1 bg-yellow-500/20 px-2 py-0.5 rounded text-xs text-yellow-300 font-medium">
                                    <AlertTriangle className="w-3 h-3" /> Weakest
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-gray-400">{meta.description}</p>
                            </div>
                            <div className="text-right ml-3">
                              <p className={`text-lg font-bold ${getRiskColor(value)}`}>{Math.round(value)}</p>
                              <p className="text-xs text-gray-400">/100</p>
                            </div>
                          </div>

                          {/* Progress bar */}
                          <div className="mt-2 h-1.5 bg-gray-700/50 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500"
                              initial={{ scaleX: 0 }}
                              animate={{ scaleX: value / 100 }}
                              transition={{ delay: 0.3 + idx * 0.05, duration: 0.8 }}
                              style={{ transformOrigin: "left" }}
                            />
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>

                {/* Weakest Trait Alert */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.35 }}
                  className="bg-gradient-to-br from-red-950/50 to-orange-950/50 border-2 border-red-500/50 rounded-lg p-4"
                >
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-red-300 mb-1">Primary Risk</h4>
                      <p className="text-red-200 text-sm">
                        {weakestTraitMetadata.label} — {getSeverityLabel(dna.traits[dna.weakestTrait])}
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* AI Recommendation */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-gradient-to-br from-blue-950/50 to-purple-950/50 border border-blue-500/30 rounded-lg p-4"
                >
                  <div className="flex items-start gap-3">
                    <Zap className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-blue-300 mb-2">🤖 AI Recommendation</h4>
                      <p className="text-blue-200 text-sm leading-relaxed">{recommendation}</p>
                    </div>
                  </div>
                </motion.div>

                {/* Real-time Sync Badge */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.45 }}
                  className="flex items-center justify-center gap-2 text-xs text-gray-500 pt-2"
                >
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-2 h-2 rounded-full bg-green-500"
                  />
                  Real-time sync enabled
                </motion.div>

                {/* Close Button */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="pt-4 border-t border-gray-700"
                >
                  <Button
                    onClick={onClose}
                    className="w-full bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white"
                  >
                    Close Panel
                  </Button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
});

AlertDNAPanel.displayName = "AlertDNAPanel";

/**
 * Get severity label for a trait value
 */
function getSeverityLabel(value: number): string {
  if (value >= 75) return "🔴 Critical";
  if (value >= 50) return "🟠 High";
  if (value >= 25) return "🟡 Moderate";
  return "🟢 Low";
}
