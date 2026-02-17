import { motion, AnimatePresence } from "framer-motion";
import { MapMode } from "@/types/map";
import { getLegendData } from "@/lib/mapColors";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Activity } from "lucide-react";

interface FloatingLegendProps {
  mode: MapMode;
  lastUpdated: Date | null;
  isLive: boolean;
}

export const FloatingLegend = ({ mode, lastUpdated, isLive }: FloatingLegendProps) => {
  const legendData = getLegendData(mode);
  
  const formatTime = (date: Date | null) => {
    if (!date) return "Never";
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="absolute bottom-6 right-6 z-20"
    >
      <Card className="bg-gray-900/95 backdrop-blur-md border-gray-700 p-4 w-64 shadow-2xl">
        {/* Header */}
        <div className="mb-3 pb-3 border-b border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-white uppercase tracking-wide">
              {mode === "aqi" && "Air Quality Index"}
              {mode === "energy" && "Energy Consumption"}
              {mode === "sustainability" && "Sustainability Score"}
              {mode === "temperature" && "Temperature"}
            </h3>
          </div>
          
          {/* Live Status */}
          <AnimatePresence>
            {isLive && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="mb-2"
              >
                <Badge className="gap-1.5 bg-green-500/20 text-green-400 border-green-500/50">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <Activity className="w-3 h-3" />
                  </motion.div>
                  <span className="text-xs font-semibold">🟢 Updating...</span>
                </Badge>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Last Updated */}
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <Clock className="w-3 h-3" />
            <span>Updated: {formatTime(lastUpdated)}</span>
          </div>
        </div>

        {/* Legend Items */}
        <div className="space-y-2">
          {legendData.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center gap-3"
            >
              <div
                className="w-5 h-5 rounded-full flex-shrink-0 ring-2 ring-white/10"
                style={{ backgroundColor: item.color }}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-medium text-white truncate">
                    {item.label}
                  </span>
                  <span className="text-xs text-gray-400 whitespace-nowrap">
                    {item.range}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-3 pt-3 border-t border-gray-700">
          <p className="text-[10px] text-gray-500 text-center">
            Auto-refresh every 1 minute
          </p>
        </div>
      </Card>
    </motion.div>
  );
};
