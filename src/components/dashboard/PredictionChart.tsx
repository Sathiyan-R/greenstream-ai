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

/**
 * Tab selector for prediction charts
 */
const PredictionTabs = ({
  activeTab,
  onTabChange,
}: {
  activeTab: "energy" | "aqi" | "carbon";
  onTabChange: (tab: "energy" | "aqi" | "carbon") => void;
}) => {
  const tabs: { id: "energy" | "aqi" | "carbon"; label: string; icon: React.ReactNode }[] = [
    { id: "energy", label: "Energy", icon: <Zap className="w-4 h-4" /> },
    { id: "aqi", label: "Air Quality", icon: <Wind className="w-4 h-4" /> },
    { id: "carbon", label: "Carbon", icon: <Activity className="w-4 h-4" /> },
  ];

  return (
    <div className="flex gap-2 border-b border-border">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors ${
            activeTab === tab.id
              ? "border-b-2 border-primary text-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  );
};

/**
 * Energy Consumption Forecast Chart
 */
const EnergyForecastChart = memo(({ data }: { data: Array<{ time: string; value: number }> }) => (
  <div className="w-full h-80">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground))" />
        <XAxis
          dataKey="time"
          stroke="hsl(var(--muted-foreground))"
          style={{ fontSize: "12px" }}
        />
        <YAxis
          stroke="hsl(var(--muted-foreground))"
          style={{ fontSize: "12px" }}
          label={{ value: "kWh", angle: -90, position: "insideLeft" }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--background))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "6px",
          }}
          formatter={(value: number) => `${value} kWh`}
        />
        <Bar dataKey="value" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  </div>
));

EnergyForecastChart.displayName = "EnergyForecastChart";

/**
 * AQI Forecast Chart
 */
const AQIForecastChart = memo(({ data }: { data: Array<{ time: string; value: number }> }) => (
  <div className="w-full h-80">
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground))" />
        <XAxis
          dataKey="time"
          stroke="hsl(var(--muted-foreground))"
          style={{ fontSize: "12px" }}
        />
        <YAxis
          stroke="hsl(var(--muted-foreground))"
          style={{ fontSize: "12px" }}
          label={{ value: "AQI", angle: -90, position: "insideLeft" }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--background))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "6px",
          }}
          formatter={(value: number) => `AQI ${value}`}
        />
        <Line
          type="monotone"
          dataKey="value"
          stroke="hsl(var(--yellow-500))"
          dot={{ fill: "hsl(var(--yellow-500))", r: 4 }}
          activeDot={{ r: 6 }}
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
));

AQIForecastChart.displayName = "AQIForecastChart";

/**
 * Carbon Emissions Forecast Chart
 */
const CarbonForecastChart = memo(({ data }: { data: Array<{ time: string; value: number }> }) => (
  <div className="w-full h-80">
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
        <defs>
          <linearGradient id="colorCarbon" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.8} />
            <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground))" />
        <XAxis
          dataKey="time"
          stroke="hsl(var(--muted-foreground))"
          style={{ fontSize: "12px" }}
        />
        <YAxis
          stroke="hsl(var(--muted-foreground))"
          style={{ fontSize: "12px" }}
          label={{ value: "kg CO₂", angle: -90, position: "insideLeft" }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--background))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "6px",
          }}
          formatter={(value: number) => `${value} kg CO₂`}
        />
        <Area
          type="monotone"
          dataKey="value"
          stroke="hsl(var(--destructive))"
          fillOpacity={1}
          fill="url(#colorCarbon)"
        />
      </AreaChart>
    </ResponsiveContainer>
  </div>
));

CarbonForecastChart.displayName = "CarbonForecastChart";

/**
 * Prediction Chart Component
 * Displays forecasts for energy, AQI, and carbon emissions
 */
export const PredictionChart = memo(
  ({ energyHistory, aqi, temperature, windSpeed, carbonIntensity = 0.4 }: PredictionChartProps) => {
    // Memoize predictions to avoid recalculation
    const predictions = useMemo(() => {
      return {
        energy: predictEnergyConsumption(energyHistory.slice(-24), 12),
        aqi: predictAQI(Array(12).fill(aqi), temperature, windSpeed, 12),
        carbon: predictCarbonEmissions(energyHistory.slice(-24), carbonIntensity, 12),
      };
    }, [energyHistory, aqi, temperature, windSpeed, carbonIntensity]);

    // Use local state for tab management
    const [activeTab, setActiveTab] = React.useState<"energy" | "aqi" | "carbon">("energy");

    return (
      <Card className="glass-panel border-border p-6">
        {/* Header */}
        <div className="mb-6">
          <h3 className="text-lg font-heading font-bold">12-Hour Forecast</h3>
          <p className="text-sm text-muted-foreground">ML-powered predictions for key metrics</p>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <PredictionTabs activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        {/* Chart Content */}
        <div>
          {activeTab === "energy" && <EnergyForecastChart data={predictions.energy} />}
          {activeTab === "aqi" && <AQIForecastChart data={predictions.aqi} />}
          {activeTab === "carbon" && <CarbonForecastChart data={predictions.carbon} />}
        </div>

        {/* Footer Info */}
        <div className="mt-4 p-3 bg-muted/30 rounded-lg border border-border/30">
          <p className="text-xs text-muted-foreground">
            {activeTab === "energy" &&
              "⚡ Forecasts are based on historical consumption patterns and time-of-day variations."}
            {activeTab === "aqi" &&
              "💨 AQI predictions consider weather conditions and typical pollution patterns."}
            {activeTab === "carbon" &&
              "🌱 Carbon emissions are calculated from predicted energy consumption."}
          </p>
        </div>
      </Card>
    );
  }
);

PredictionChart.displayName = "PredictionChart";

// Import React for useState
import React from "react";
