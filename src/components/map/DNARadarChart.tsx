import React from "react";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";
import { DNATraits } from "@/hooks/useDNACalculation";

interface DNARadarChartProps {
  traits: DNATraits;
}

export const DNARadarChart = React.memo(({ traits }: DNARadarChartProps) => {
  const data = [
    {
      axis: "Heat Risk",
      value: traits.heatRisk,
      fullMark: 100,
    },
    {
      axis: "Pollution",
      value: traits.pollutionPersistence,
      fullMark: 100,
    },
    {
      axis: "Energy",
      value: traits.energyInstability,
      fullMark: 100,
    },
    {
      axis: "Carbon",
      value: traits.carbonDensity,
      fullMark: 100,
    },
  ];

  return (
    <div className="w-full h-64 flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <PolarGrid
            strokeDasharray="3 3"
            stroke="#4B5563"
            gridType="polygon"
          />
          <PolarAngleAxis
            dataKey="axis"
            tick={{ fill: "#A0AEC0", fontSize: 12 }}
            stroke="#4B5563"
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={{ fill: "#718096", fontSize: 10 }}
            stroke="#4B5563"
          />
          <Radar
            name="Environmental Risk"
            dataKey="value"
            stroke="#EF4444"
            fill="#EF4444"
            fillOpacity={0.6}
            animationDuration={800}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
});

DNARadarChart.displayName = "DNARadarChart";
