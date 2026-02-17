import { MapMode, MapLegendItem } from "@/types/map";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface MapLegendProps {
  mode: MapMode;
}

const temperatureLegend: MapLegendItem[] = [
  { color: "#22c55e", label: "Cool", range: "< 29°C" },
  { color: "#eab308", label: "Warm", range: "29-31°C" },
  { color: "#f59e0b", label: "Hot", range: "31-33°C" },
  { color: "#f97316", label: "Very Hot", range: "33-35°C" },
  { color: "#ef4444", label: "Extreme", range: "≥ 35°C" },
];

const aqiLegend: MapLegendItem[] = [
  { color: "#22c55e", label: "Good", range: "0-50" },
  { color: "#f59e0b", label: "Moderate", range: "51-100" },
  { color: "#ef4444", label: "Unhealthy", range: "101-150" },
  { color: "#7c3aed", label: "Very Unhealthy", range: "≥ 151" },
];

const energyLegend: MapLegendItem[] = [
  { color: "#10b981", label: "Low", range: "< 300 kWh" },
  { color: "#84cc16", label: "Moderate", range: "300-500 kWh" },
  { color: "#eab308", label: "High", range: "500-750 kWh" },
  { color: "#f97316", label: "Very High", range: "750-1000 kWh" },
  { color: "#dc2626", label: "Critical", range: "≥ 1000 kWh" },
];

export const MapLegend = ({ mode }: MapLegendProps) => {
  const getLegendData = (): MapLegendItem[] => {
    switch (mode) {
      case "temperature":
        return temperatureLegend;
      case "aqi":
        return aqiLegend;
      case "energy":
        return energyLegend;
      default:
        return [];
    }
  };

  const getTitle = () => {
    switch (mode) {
      case "temperature":
        return "Temperature Scale";
      case "aqi":
        return "Air Quality Index";
      case "energy":
        return "Energy Consumption";
      default:
        return "Legend";
    }
  };

  const legendData = getLegendData();

  return (
    <Card className="absolute top-4 right-4 p-4 bg-gray-900/95 border-gray-700 backdrop-blur-sm z-10 min-w-[200px]">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-white text-sm">{getTitle()}</h3>
          <Badge variant="outline" className="text-xs">
            {mode.toUpperCase()}
          </Badge>
        </div>
        
        <div className="space-y-2">
          {legendData.map((item, index) => (
            <div key={index} className="flex items-center gap-2 text-xs">
              <div
                className="w-4 h-4 rounded-full border border-white/20 flex-shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <div className="flex-1 min-w-0">
                <div className="text-white font-medium">{item.label}</div>
                <div className="text-gray-400 text-[10px]">{item.range}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-2 border-t border-gray-700">
          <p className="text-[10px] text-gray-400">
            Circle size indicates intensity
          </p>
        </div>
      </div>
    </Card>
  );
};
