import { memo, useMemo } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from "recharts";
import { Activity, Zap, Wind } from "lucide-react";
import { predictEnergyConsumption, predictAQI, predictCarbonEmissions } from "@/lib/predictions";
import { Card } from "@/components/ui/card";

interface PredictionChartProps {
  energyHistory: number[];
  aqi: number;
  temperature: number;
  windSpeed: number;
  carbonIntensity?: number;
}

