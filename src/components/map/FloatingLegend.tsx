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
        {