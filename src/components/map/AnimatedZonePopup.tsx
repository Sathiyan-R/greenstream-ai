import { useEffect } from "react";
import { motion } from "framer-motion";
import { ZoneData } from "@/types/map";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, TrendingUp, TrendingDown, Minus, Sparkles, Calendar, MapPin, Zap } from "lucide-react";
import { getSustainabilityColor } from "@/lib/mapColors";

interface AnimatedZonePopupProps {
  zone: ZoneData;
  onClose: () => void;
  onCarbonAnalysis?: (zone: ZoneData) => void;
}

const getTrendIcon = (trend: string) => {
  switch (trend) {
    case "↑":
      return <TrendingUp className="w-4 h-4 text-red-400" />;
    case "↓":
      return <TrendingDown className="w-4 h-4 text-green-400" />;
    default:
      return <Minus className="w-4 h-4 text-gray-400" />;
  }
};

const getTrendColor = (trend: string) => {
  switch (trend) {
    case "↑":
      return "text-red-400";
    case "↓":
      return "text-green-400";
    default:
      return "text-gray-400";
  }
};

export const AnimatedZonePopup = ({ zone, onClose, onCarbonAnalysis }: AnimatedZonePopupProps) => {
  const sustainabilityColor = getSustainabilityColor(zone.sustainability_score);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
      >
        <Card className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-gray-700 p-6 max-w-2xl w-full shadow-2xl">
          {