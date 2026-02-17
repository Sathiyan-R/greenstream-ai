import { MapMode } from "@/types/map";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Thermometer, Wind, Zap, Leaf } from "lucide-react";

interface MapControlsProps {
  mode: MapMode;
  onModeChange: (mode: MapMode) => void;
}

export const MapControls = ({ mode, onModeChange }: MapControlsProps) => {
  const controls = [
    {
      id: "sustainability" as MapMode,
      label: "Sustainability",
      icon: Leaf,
      color: "from-emerald-500 to-green-500",
    },
    {
      id: "temperature" as MapMode,
      label: "Temperature",
      icon: Thermometer,
      color: "from-orange-500 to-red-500",
    },
    {
      id: "aqi" as MapMode,
      label: "Air Quality",
      icon: Wind,
      color: "from-purple-500 to-violet-500",
    },
    {
      id: "energy" as MapMode,
      label: "Energy",
      icon: Zap,
      color: "from-yellow-500 to-amber-500",
    },
  ];

  return (
    <Card className="absolute top-4 left-4 p-3 bg-gray-900/95 border-gray-700 backdrop-blur-sm z-10">
      <div className="space-y-2">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          View Mode
        </h3>
        <div className="flex flex-col gap-2">
          {controls.map((control) => {
            const Icon = control.icon;
            const isActive = mode === control.id;
            
            return (
              <Button
                key={control.id}
                variant={isActive ? "default" : "outline"}
                size="sm"
                onClick={() => onModeChange(control.id)}
                className={`
                  justify-start gap-2 transition-all duration-300
                  ${isActive 
                    ? `bg-gradient-to-r ${control.color} text-white border-none shadow-lg` 
                    : 'bg-gray-800/50 text-gray-300 border-gray-700 hover:bg-gray-700/50'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                <span className="font-medium">{control.label}</span>
              </Button>
            );
          })}
        </div>
      </div>
    </Card>
  );
};
