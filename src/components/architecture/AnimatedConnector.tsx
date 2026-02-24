import React from "react";
import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";

interface AnimatedConnectorProps {
  color?: "green" | "blue" | "cyan";
  vertical?: boolean;
  delay?: number;
}

export const AnimatedConnector: React.FC<AnimatedConnectorProps> = ({
  color = "green",
  vertical = true,
  delay = 0,
}) => {
  const colorMap = {
    green: "from-green-500 to-green-900",
    blue: "from-blue-500 to-blue-900",
    cyan: "from-cyan-500 to-cyan-900",
  };

  const colorClass = colorMap[color];

  return (
    <div className={`flex ${vertical ? "justify-center" : "items-center"} relative`}>
      {vertical ? (
        <div className="flex flex-col items-center gap-2 py-4">
          {