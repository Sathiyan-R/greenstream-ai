import { useMemo } from "react";
import { motion } from "framer-motion";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card } from "@/components/ui/card";
import { TrendingDown, Zap, Leaf, Wind } from "lucide-react";

interface ZoneBattleImpactChartProps {
  zone1Name: string;
  zone1BaseTemp: number;
  zone1BaseAQI: number;
  zone1BaseEnergy: number;
  zone1BaseCarbon: number;
  zone1Trees: number;
  zone1Efficiency: number;
  zone1Traffic: number;
  
  zone2Name: string;
  zone2BaseTemp: number;
  zone2BaseAQI: number;
  zone2BaseEnergy: number;
  zone2BaseCarbon: number;
  zone2Trees: number;
  zone2Efficiency: number;
  zone2Traffic: number;
}

export const ZoneBattleImpactChart = ({
  zone1Name,
  zone1BaseTemp,
  zone1BaseAQI,
  zone1BaseEnergy,
  zone1BaseCarbon,
  zone1Trees,
  zone1Efficiency,
  zone1Traffic,
  
  zone2Name,
  zone2BaseTemp,
  zone2BaseAQI,
  zone2BaseEnergy,
  zone2BaseCarbon,
  zone2Trees,
  zone2Efficiency,
  zone2Traffic,
}: ZoneBattleImpactChartProps) => {
  const calculateImpact = (zone: any, trees: number, efficiency: number, traffic: number) => {
    const treeTempReduction = Math.min(2.5, (trees / 5000) * 1.4);
    const treeAqiReduction = Math.min(18, (trees / 5000) * 10);
    const trafficAqiReduction = Math.min(12, (traffic / 30) * 12);
    const energyReduction = Math.min(0.3, efficiency / 100);
    const carbonReduction = Math.min(0.35, energyReduction * 0.8 + (trees / 20000));

    return {
      newTemp: Math.max(0, zone.baseTemp - treeTempReduction),
      newAQI: Math.max(0, Math.round(zone.baseAQI - treeAqiReduction - trafficAqiReduction)),
      newEnergy: Math.max(0, Math.round(zone.baseEnergy * (1 - energyReduction))),
      newCarbon: Math.max(0, Math.round(zone.baseCarbon * (1 - carbonReduction))),
      tempReduction: treeTempReduction,
      aqiReduction: treeAqiReduction + trafficAqiReduction,
      energyReduction: energyReduction,
      carbonReduction: carbonReduction,
    };
  };

  const zone1Data = {
    baseTemp: zone1BaseTemp,
    baseAQI: zone1BaseAQI,
    baseEnergy: zone1BaseEnergy,
    baseCarbon: zone1BaseCarbon,
  };

  const zone2Data = {
    baseTemp: zone2BaseTemp,
    baseAQI: zone2BaseAQI,
    baseEnergy: zone2BaseEnergy,
    baseCarbon: zone2BaseCarbon,
  };

  const zone1Impact = calculateImpact(zone1Data, zone1Trees, zone1Efficiency, zone1Traffic);
  const zone2Impact = calculateImpact(zone2Data, zone2Trees, zone2Efficiency, zone2Traffic);

  // Chart data for comparison
  const comparisonData = useMemo(() => [
    {
      metric: "Temperature",
      [zone1Name]: zone1Impact.newTemp,
      [zone2Name]: zone2Impact.newTemp,
      baseline1: zone1BaseTemp,
      baseline2: zone2BaseTemp,
    },
    {
      metric: "AQI",
      [zone1Name]: zone1Impact.newAQI,
      [zone2Name]: zone2Impact.newAQI,
      baseline1: zone1BaseAQI,
      baseline2: zone2BaseAQI,
    },
    {
      metric: "Energy",
      [zone1Name]: zone1Impact.newEnergy,
      [zone2Name]: zone2Impact.newEnergy,
      baseline1: zone1BaseEnergy,
      baseline2: zone2BaseEnergy,
    },
    {
      metric: "Carbon",
      [zone1Name]: zone1Impact.newCarbon,
      [zone2Name]: zone2Impact.newCarbon,
      baseline1: zone1BaseCarbon,
      baseline2: zone2BaseCarbon,
    },
  ], [zone1Impact, zone2Impact, zone1Name, zone2Name, zone1BaseTemp, zone1BaseAQI, zone1BaseEnergy, zone1BaseCarbon, zone2BaseTemp, zone2BaseAQI, zone2BaseEnergy, zone2BaseCarbon]);

  return (
    <div className="space-y-4">
      {/* Before/After Comparison Cards */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-2 gap-2"
      >
        {/* Zone 1 Impact */}
        <div className="space-y-1">
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-2">
            <p className="text-[11px] font-semibold text-blue-200 mb-2">{zone1Name}</p>
            
            <div className="space-y-1 text-[9px]">
              <motion.div
                key={zone1Impact.newTemp}
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="flex justify-between items-center gap-1"
              >
                <span className="text-gray-400">Temp</span>
                <div className="flex items-center gap-0.5">
                  <span className="text-gray-300">{zone1BaseTemp.toFixed(1)}°C</span>
                  <TrendingDown className="w-2.5 h-2.5 text-green-400" />
                  <span className="text-green-400 font-semibold">{zone1Impact.newTemp.toFixed(1)}°C</span>
                </div>
              </motion.div>

              <motion.div
                key={zone1Impact.newAQI}
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="flex justify-between items-center gap-1"
              >
                <span className="text-gray-400">AQI</span>
                <div className="flex items-center gap-0.5">
                  <span className="text-gray-300">{zone1BaseAQI}</span>
                  <TrendingDown className="w-2.5 h-2.5 text-green-400" />
                  <span className="text-green-400 font-semibold">{zone1Impact.newAQI}</span>
                </div>
              </motion.div>

              <motion.div
                key={zone1Impact.newEnergy}
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="flex justify-between items-center gap-1"
              >
                <span className="text-gray-400">Energy</span>
                <div className="flex items-center gap-0.5">
                  <span className="text-gray-300">{(zone1BaseEnergy / 100).toFixed(0)}</span>
                  <TrendingDown className="w-2.5 h-2.5 text-green-400" />
                  <span className="text-green-400 font-semibold">{(zone1Impact.newEnergy / 100).toFixed(0)}</span>
                </div>
              </motion.div>

              <motion.div
                key={zone1Impact.newCarbon}
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="flex justify-between items-center gap-1"
              >
                <span className="text-gray-400">Carbon</span>
                <div className="flex items-center gap-0.5">
                  <span className="text-gray-300">{(zone1BaseCarbon / 100).toFixed(0)}</span>
                  <TrendingDown className="w-2.5 h-2.5 text-green-400" />
                  <span className="text-green-400 font-semibold">{(zone1Impact.newCarbon / 100).toFixed(0)}</span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Zone 2 Impact */}
        <div className="space-y-1">
          <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-2">
            <p className="text-[11px] font-semibold text-purple-200 mb-2">{zone2Name}</p>
            
            <div className="space-y-1 text-[9px]">
              <motion.div
                key={zone2Impact.newTemp}
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="flex justify-between items-center gap-1"
              >
                <span className="text-gray-400">Temp</span>
                <div className="flex items-center gap-0.5">
                  <span className="text-gray-300">{zone2BaseTemp.toFixed(1)}°C</span>
                  <TrendingDown className="w-2.5 h-2.5 text-green-400" />
                  <span className="text-green-400 font-semibold">{zone2Impact.newTemp.toFixed(1)}°C</span>
                </div>
              </motion.div>

              <motion.div
                key={zone2Impact.newAQI}
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="flex justify-between items-center gap-1"
              >
                <span className="text-gray-400">AQI</span>
                <div className="flex items-center gap-0.5">
                  <span className="text-gray-300">{zone2BaseAQI}</span>
                  <TrendingDown className="w-2.5 h-2.5 text-green-400" />
                  <span className="text-green-400 font-semibold">{zone2Impact.newAQI}</span>
                </div>
              </motion.div>

              <motion.div
                key={zone2Impact.newEnergy}
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="flex justify-between items-center gap-1"
              >
                <span className="text-gray-400">Energy</span>
                <div className="flex items-center gap-0.5">
                  <span className="text-gray-300">{(zone2BaseEnergy / 100).toFixed(0)}</span>
                  <TrendingDown className="w-2.5 h-2.5 text-green-400" />
                  <span className="text-green-400 font-semibold">{(zone2Impact.newEnergy / 100).toFixed(0)}</span>
                </div>
              </motion.div>

              <motion.div
                key={zone2Impact.newCarbon}
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="flex justify-between items-center gap-1"
              >
                <span className="text-gray-400">Carbon</span>
                <div className="flex items-center gap-0.5">
                  <span className="text-gray-300">{(zone2BaseCarbon / 100).toFixed(0)}</span>
                  <TrendingDown className="w-2.5 h-2.5 text-green-400" />
                  <span className="text-green-400 font-semibold">{(zone2Impact.newCarbon / 100).toFixed(0)}</span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Impact Comparison Chart */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gray-900/50 border border-gray-700/50 rounded-lg p-2"
      >
        <p className="text-[9px] font-semibold text-gray-300 mb-1">Impact Comparison</p>
        <ResponsiveContainer width="100%" height={150}>
          <BarChart data={comparisonData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="metric" tick={{ fill: "#9ca3af", fontSize: 9 }} />
            <YAxis tick={{ fill: "#9ca3af", fontSize: 9 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(17, 24, 39, 0.9)",
                border: "1px solid rgba(75, 85, 99, 0.3)",
                borderRadius: "6px",
                color: "#e5e7eb",
                fontSize: "12px",
              }}
              formatter={(value: any) => value?.toFixed(1) || 0}
            />
            <Legend wrapperStyle={{ color: "#9ca3af", fontSize: 9 }} />
            <Bar dataKey={zone1Name} fill="#3b82f6" radius={[4, 4, 0, 0]} />
            <Bar dataKey={zone2Name} fill="#a855f7" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Reduction Percentage Chart */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gray-900/50 border border-gray-700/50 rounded-lg p-2"
      >
        <p className="text-[9px] font-semibold text-gray-300 mb-1">Reduction Impact (%)</p>
        <ResponsiveContainer width="100%" height={140}>
          <BarChart
            data={[
              {
                metric: "Temp ↓",
                [zone1Name]: (zone1Impact.tempReduction / zone1BaseTemp) * 100,
                [zone2Name]: (zone2Impact.tempReduction / zone2BaseTemp) * 100,
              },
              {
                metric: "AQI ↓",
                [zone1Name]: (zone1Impact.aqiReduction / zone1BaseAQI) * 100,
                [zone2Name]: (zone2Impact.aqiReduction / zone2BaseAQI) * 100,
              },
              {
                metric: "Energy ↓",
                [zone1Name]: zone1Impact.energyReduction * 100,
                [zone2Name]: zone2Impact.energyReduction * 100,
              },
              {
                metric: "Carbon ↓",
                [zone1Name]: zone1Impact.carbonReduction * 100,
                [zone2Name]: zone2Impact.carbonReduction * 100,
              },
            ]}
            margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="metric" tick={{ fill: "#9ca3af", fontSize: 10 }} />
            <YAxis tick={{ fill: "#9ca3af", fontSize: 10 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(17, 24, 39, 0.9)",
                border: "1px solid rgba(75, 85, 99, 0.3)",
                borderRadius: "6px",
                color: "#e5e7eb",
              }}
              formatter={(value: any) => `${value?.toFixed(1) || 0}%`}
            />
            <Legend wrapperStyle={{ color: "#9ca3af", fontSize: 10 }} />
            <Bar dataKey={zone1Name} fill="#10b981" radius={[4, 4, 0, 0]} />
            <Bar dataKey={zone2Name} fill="#06b6d4" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
};
