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

  // ESC key to close popup
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
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <motion.h2
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-2xl font-bold text-white mb-1"
              >
                {zone.zone_name}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="text-sm text-gray-400"
              >
                {zone.zone_region}
              </motion.p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="hover:bg-gray-800"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Sustainability Score */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mb-6"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-300">
                Sustainability Score
              </span>
              <Badge
                className="text-white font-bold px-3 py-1"
                style={{ backgroundColor: sustainabilityColor }}
              >
                {zone.sustainability_score}/100
              </Badge>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${zone.sustainability_score}%` }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="h-full rounded-full"
                style={{ backgroundColor: sustainabilityColor }}
              />
            </div>
          </motion.div>

          {/* Current Metrics with Trends */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-orange-900/20 to-red-900/20 rounded-lg p-4 border border-orange-500/20"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-400 uppercase">Temperature</span>
                {getTrendIcon(zone.trend_temperature)}
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-white">
                  {zone.temperature}
                </span>
                <span className="text-sm text-gray-400">°C</span>
              </div>
              <span className={`text-xs font-medium ${getTrendColor(zone.trend_temperature)}`}>
                {zone.trend_temperature}
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="bg-gradient-to-br from-purple-900/20 to-violet-900/20 rounded-lg p-4 border border-purple-500/20"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-400 uppercase">AQI</span>
                {getTrendIcon(zone.trend_aqi)}
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-white">{zone.aqi}</span>
              </div>
              <span className={`text-xs font-medium ${getTrendColor(zone.trend_aqi)}`}>
                {zone.trend_aqi}
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-yellow-900/20 to-amber-900/20 rounded-lg p-4 border border-yellow-500/20"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-400 uppercase">Energy</span>
                {getTrendIcon(zone.trend_energy)}
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-white">
                  {Math.round(zone.energy_consumption)}
                </span>
                <span className="text-sm text-gray-400">kWh</span>
              </div>
              <span className={`text-xs font-medium ${getTrendColor(zone.trend_energy)}`}>
                {zone.trend_energy}
              </span>
            </motion.div>
          </div>

          {/* Prediction for Tomorrow */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="mb-4 bg-blue-900/10 border border-blue-500/20 rounded-lg p-4"
          >
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Calendar className="w-5 h-5 text-blue-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-blue-300 mb-1">
                  Tomorrow's Forecast
                </h3>
                <p className="text-sm text-gray-300 leading-relaxed">
                  {zone.prediction_tomorrow}
                </p>
              </div>
            </div>
          </motion.div>

          {/* AI Suggestion */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-emerald-900/10 border border-emerald-500/20 rounded-lg p-4"
          >
            <div className="flex items-start gap-3">
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                className="p-2 bg-emerald-500/20 rounded-lg"
              >
                <Sparkles className="w-5 h-5 text-emerald-400" />
              </motion.div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-emerald-300 mb-1">
                  AI Recommendation
                </h3>
                <p className="text-sm text-gray-300 leading-relaxed">
                  {zone.ai_suggestion}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Carbon Emission & Location */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
            className="mt-4 pt-4 border-t border-gray-700 space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">Carbon Emission</span>
              <span className="text-sm font-semibold text-gray-300">
                {Math.round(zone.carbon_emission)} kg CO₂
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-xs text-gray-400">Location</span>
              </div>
              <span className="text-sm font-semibold text-gray-300">
                {zone.zone_name}
              </span>
            </div>
          </motion.div>

          {/* Carbon Analysis Button */}
          {onCarbonAnalysis && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-4 pt-4 border-t border-gray-700"
            >
              <Button
                onClick={() => onCarbonAnalysis(zone)}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white gap-2"
                size="sm"
              >
                <Zap className="w-4 h-4" />
                Carbon Intelligence
              </Button>
            </motion.div>
          )}
        </Card>
      </motion.div>
    </motion.div>
  );
};
