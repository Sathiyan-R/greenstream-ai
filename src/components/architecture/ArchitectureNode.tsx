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
        {/* Glow effect */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${colors.glow} rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
        />

        {/* Node card */}
        <div
          onClick={() => setIsExpanded(!isExpanded)}
          className={`
            relative h-full cursor-pointer backdrop-blur-md ${colors.bg} 
            border ${colors.border} rounded-xl p-6 transition-all duration-300
            ${isExpanded ? `ring-2 ${colors.border}` : ""}
          `}
        >
          {/* Icon */}
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-lg bg-white/5 ${colors.icon}`}>
              <Icon className="w-6 h-6" />
            </div>
            {details.length > 0 && (
              <motion.div
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronDown className={`w-5 h-5 ${colors.icon}`} />
              </motion.div>
            )}
          </div>

          {/* Title and description */}
          <h3 className="text-sm font-bold text-white mb-2">{title}</h3>
          <p className="text-xs text-gray-300 mb-4">{description}</p>

          {/* Expanded details */}
          <motion.div
            initial={false}
            animate={{ height: isExpanded ? "auto" : 0, opacity: isExpanded ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="pt-4 border-t border-white/10">
              <ul className="space-y-2">
                {details.map((detail, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-gray-200">
                    <span className={`w-1.5 h-1.5 rounded-full ${colors.dot} mt-1 flex-shrink-0`} />
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default ArchitectureNode;
