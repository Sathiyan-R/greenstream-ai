import { AIInsight } from "@/types/map";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Brain, 
  X, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2,
  Lightbulb,
  MapPin,
  Thermometer,
  Wind,
  Zap,
  Leaf
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AIInsightPanelProps {
  insight: AIInsight | null;
  onClose: () => void;
}

export const AIInsightPanel = ({ insight, onClose }: AIInsightPanelProps) => {
  if (!insight) return null;

  const getSeverityConfig = (severity: string) => {
    switch (severity) {
      case "high":
        return {
          color: "bg-red-500/10 text-red-400 border-red-500/30",
          badgeColor: "bg-red-500",
          icon: AlertTriangle,
          label: "High Priority",
        };
      case "medium":
        return {
          color: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
          badgeColor: "bg-yellow-500",
          icon: TrendingUp,
          label: "Medium Priority",
        };
      default:
        return {
          color: "bg-green-500/10 text-green-400 border-green-500/30",
          badgeColor: "bg-green-500",
          icon: CheckCircle2,
          label: "Normal",
        };
    }
  };

  const config = getSeverityConfig(insight.severity);
  const SeverityIcon = config.icon;

  return (
    <Card className="absolute top-4 left-1/2 -translate-x-1/2 w-full max-w-2xl p-6 bg-gray-900/98 border-gray-700 backdrop-blur-md z-20 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              AI Environmental Analysis
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <MapPin className="w-3 h-3 text-gray-400" />
              <p className="text-sm text-gray-400">{insight.zoneName}</p>
            </div>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="text-gray-400 hover:text-white hover:bg-gray-800"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Severity Badge */}
      <div className="mb-4">
        <Badge 
          className={cn(
            "px-3 py-1 flex items-center gap-1.5 w-fit",
            config.color
          )}
        >
          <SeverityIcon className="w-3 h-3" />
          {config.label}
        </Badge>
      </div>

      {/* AI Insight */}
      <div className="mb-5 p-4 bg-gradient-to-br from-blue-950/40 to-purple-950/40 border border-blue-500/20 rounded-lg">
        <div className="flex items-start gap-2">
          <Brain className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
          <p className="text-gray-200 text-sm leading-relaxed">{insight.insight}</p>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        <div className="p-3 bg-gray-800/50 rounded-lg border border-gray-700">
          <div className="flex items-center gap-2 mb-1">
            <Thermometer className="w-3 h-3 text-orange-400" />
            <span className="text-[10px] text-gray-400 uppercase">Temp</span>
          </div>
          <p className="text-lg font-bold text-white">{insight.metrics.temperature}°C</p>
        </div>
        
        <div className="p-3 bg-gray-800/50 rounded-lg border border-gray-700">
          <div className="flex items-center gap-2 mb-1">
            <Wind className="w-3 h-3 text-purple-400" />
            <span className="text-[10px] text-gray-400 uppercase">AQI</span>
          </div>
          <p className="text-lg font-bold text-white">{insight.metrics.aqi}</p>
        </div>
        
        <div className="p-3 bg-gray-800/50 rounded-lg border border-gray-700">
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-3 h-3 text-yellow-400" />
            <span className="text-[10px] text-gray-400 uppercase">Energy</span>
          </div>
          <p className="text-lg font-bold text-white">{insight.metrics.energy} kWh</p>
        </div>
        
        <div className="p-3 bg-gray-800/50 rounded-lg border border-gray-700">
          <div className="flex items-center gap-2 mb-1">
            <Leaf className="w-3 h-3 text-green-400" />
            <span className="text-[10px] text-gray-400 uppercase">Carbon</span>
          </div>
          <p className="text-lg font-bold text-white">{insight.metrics.carbon} kg</p>
        </div>
      </div>

      {/* Recommendations */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb className="w-4 h-4 text-yellow-400" />
          <h4 className="text-sm font-semibold text-white">AI Recommendations</h4>
        </div>
        <div className="space-y-2">
          {insight.recommendations.map((rec, index) => (
            <div 
              key={index} 
              className="flex items-start gap-2 p-3 bg-gray-800/30 rounded border border-gray-700/50 hover:bg-gray-800/50 transition-colors"
            >
              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">{index + 1}</span>
              </div>
              <p className="text-sm text-gray-300">{rec}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-5 pt-4 border-t border-gray-700">
        <p className="text-xs text-gray-500 flex items-center gap-1">
          <Brain className="w-3 h-3" />
          Powered by GreenStream AI Engine
        </p>
      </div>
    </Card>
  );
};
