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
      {