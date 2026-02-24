import React from "react";
import { motion } from "framer-motion";

interface GlowCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "accent";
  onClick?: () => void;
  isExpanded?: boolean;
}

export const GlowCard: React.FC<GlowCardProps> = ({
  children,
  className = "",
  variant = "primary",
  onClick,
  isExpanded = false,
}) => {
  const glowColor = {
    primary: "from-green-500/20 to-green-900/20",
    secondary: "from-blue-500/20 to-blue-900/20",
    accent: "from-cyan-500/20 to-purple-900/20",
  };

  const borderColor = {
    primary: "border-green-500/30 hover:border-green-400/60",
    secondary: "border-blue-500/30 hover:border-blue-400/60",
    accent: "border-cyan-500/30 hover:border-cyan-400/60",
  };

  return (
    <motion.div
      className={`relative group cursor-pointer ${onClick ? "cursor-pointer" : ""} h-full`}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      {