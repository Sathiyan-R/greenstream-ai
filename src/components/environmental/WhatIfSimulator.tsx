import { useMemo } from "react";
import { motion } from "framer-motion";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sparkles, TrendingUp, Target, AlertCircle, CheckCircle } from "lucide-react";
import { ZoneData, MapMode } from "@/types/map";
import { useChennaiEnvironmentStatus } from "@/hooks/useChennaiEnvironmentStatus";

interface WhatIfSimulatorProps {
  zones: ZoneData[];
  mode: MapMode;
}

export const WhatIfSimulator = ({ zones, mode }: WhatIfSimulatorProps) => {
  const { stats, totalCarbon } = useChennaiEnvironmentStatus();
  const [simTrees, setSimTrees] = useLocalStorage('greenstream_sim_trees', 2500);
  const [simEfficiency, setSimEfficiency] = useLocalStorage('greenstream_sim_efficiency', 12);
  const [simTraffic, setSimTraffic] = useLocalStorage('greenstream_sim_traffic', 8);

  const simulator = useMemo(() => {
    const baseTemp = stats.avgTemperature || 28;
    const baseAQI = stats.avgAQI || 100;
    const baseEnergy = stats.totalEnergy || 5000;
    const baseCarbon = totalCarbon || 2000;

    const treeTempReduction = Math.min(2.5, (simTrees / 5000) * 1.4);
    const treeAqiReduction = Math.min(18, (simTrees / 5000) * 10);
    const trafficAqiReduction = Math.min(12, (simTraffic / 30) * 12);
    const energyReduction = Math.min(0.3, simEfficiency / 100);
    const carbonReduction = Math.min(0.35, energyReduction * 0.8 + (simTrees / 20000));

    return {
      predictedTemp: Math.max(0, baseTemp - treeTempReduction),
      predictedAQI: Math.max(0, Math.round(baseAQI - treeAqiReduction - trafficAqiReduction)),
      predictedEnergy: Math.max(0, Math.round(baseEnergy * (1 - energyReduction))),
      predictedCarbon: Math.max(0, Math.round(baseCarbon * (1 - carbonReduction))),
      impactScore: Math.min(100, Math.round((treeTempReduction * 12) + (trafficAqiReduction * 4) + (energyReduction * 120)))
    };
  }, [simTrees, simEfficiency, simTraffic, stats.avgTemperature, stats.avgAQI, stats.totalEnergy, totalCarbon]);

  return (
    <Card className="p-4 bg-gradient-to-br from-slate-950/70 to-emerald-950/40 border-emerald-500/30">
      <div className="flex-1 mb-4">
        <h3 className="font-semibold text-white text-sm mb-1">What-If Simulator</h3>
        <p className="text-xs text-gray-300">Model the impact of green interventions.</p>
      </div>

      <div className="space-y-3">
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-400">Tree Planting</span>
            <span className="text-xs font-semibold text-emerald-300">{simTrees.toLocaleString()} trees</span>
          </div>
          <input
            type="range"
            min={0}
            max={10000}
            step={250}
            value={simTrees}
            onChange={(e) => setSimTrees(Number(e.target.value))}
            className="w-full accent-emerald-500"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-400">Energy Efficiency</span>
            <span className="text-xs font-semibold text-emerald-300">{simEfficiency}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={30}
            step={1}
            value={simEfficiency}
            onChange={(e) => setSimEfficiency(Number(e.target.value))}
            className="w-full accent-emerald-500"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-400">Traffic Reduction</span>
            <span className="text-xs font-semibold text-emerald-300">{simTraffic}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={30}
            step={1}
            value={simTraffic}
            onChange={(e) => setSimTraffic(Number(e.target.value))}
            className="w-full accent-emerald-500"
          />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-3"
        >
          <p className="text-[10px] text-gray-400">Projected Temp</p>
          <p className="text-lg font-bold text-emerald-300">{simulator.predictedTemp.toFixed(1)}°C</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.05 }}
          className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-3"
        >
          <p className="text-[10px] text-gray-400">Projected AQI</p>
          <p className="text-lg font-bold text-emerald-300">{simulator.predictedAQI}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-3"
        >
          <p className="text-[10px] text-gray-400">Projected Energy</p>
          <p className="text-lg font-bold text-emerald-300">{simulator.predictedEnergy} kWh</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15 }}
          className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-3"
        >
          <p className="text-[10px] text-gray-400">Projected Carbon</p>
          <p className="text-lg font-bold text-emerald-300">{simulator.predictedCarbon} kg CO2</p>
        </motion.div>
      </div>

      <div className="mt-3">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400">Impact Score</span>
          <span className="text-xs font-semibold text-emerald-300">{simulator.impactScore}/100</span>
        </div>
        <div className="mt-2 h-2 rounded-full bg-gray-800 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${simulator.impactScore}%` }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400"
          />
        </div>
      </div>
    </Card>
  );
};