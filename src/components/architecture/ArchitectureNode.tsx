import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface ArchitectureNodeProps {
  title: string;
  description: string;
  details: string[];
  icon: React.ComponentType<{ className?: string }>;
  color?: "green" | "blue" | "cyan";
  index?: number;
}

export const ArchitectureNode: React.FC<ArchitectureNodeProps> = ({
  title,
  description,
  details,
  icon: Icon,
  color = "green",
  index = 0,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const colorMap = {
    green: {
      bg: "bg-gradient-to-br from-green-500/10 to-green-600/5",
      border: "border-green-500/30 hover:border-green-400/60",
      glow: "from-green-500/20 to-green-900/20",
      icon: "text-green-400",
      dot: "bg-green-500",
    },
    blue: {
      bg: "bg-gradient-to-br from-blue-500/10 to-blue-600/5",
      border: "border-blue-500/30 hover:border-blue-400/60",
      glow: "from-blue-500/20 to-blue-900/20",
      icon: "text-blue-400",
      dot: "bg-blue-500",
    },
    cyan: {
      bg: "bg-gradient-to-br from-cyan-500/10 to-cyan-600/5",
      border: "border-cyan-500/30 hover:border-cyan-400/60",
      glow: "from-cyan-500/20 to-cyan-900/20",
      icon: "text-cyan-400",
      dot: "bg-cyan-500",
    },
  };

  const colors = colorMap[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="h-full"
    >
      <div className={`group relative h-full`}>
        {