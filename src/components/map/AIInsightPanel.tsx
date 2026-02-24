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
      {