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
          {/* Animated line */}
          <div className="h-8 w-1 bg-gradient-to-b from-transparent via-green-500 to-transparent relative overflow-hidden">
            <motion.div
              className={`absolute inset-0 bg-gradient-to-b ${colorClass}`}
              animate={{ y: ["-100%", "100%"] }}
              transition={{ duration: 2, repeat: Infinity, delay }}
              style={{ opacity: 0.6 }}
            />
          </div>

          {/* Arrow */}
          <motion.div
            animate={{ y: [0, 4, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, delay }}
          >
            <ArrowDown className={`w-5 h-5 text-${color === "green" ? "green" : color === "blue" ? "blue" : "cyan"}-400`} />
          </motion.div>
        </div>
      ) : (
        <div className="flex items-center gap-2 px-4">
          {/* Horizontal line */}
          <div className="h-1 w-12 bg-gradient-to-r from-transparent via-green-500 to-transparent relative overflow-hidden">
            <motion.div
              className={`absolute inset-0 bg-gradient-to-r ${colorClass}`}
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 2, repeat: Infinity, delay }}
              style={{ opacity: 0.6 }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AnimatedConnector;
