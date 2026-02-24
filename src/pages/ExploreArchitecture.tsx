import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Cloud,
  Zap,
  GitBranch,
  Brain,
  Radio,
  Gauge,
  AlertTriangle,
  TrendingUp,
  MessageSquare,
  CheckCircle2,
  Database,
  Cpu,
  Code2,
  Clock,
  Activity,
  Lightbulb,
} from "lucide-react";
import { ArchitectureNode } from "@/components/architecture/ArchitectureNode";
import { AnimatedConnector } from "@/components/architecture/AnimatedConnector";
import { GlowCard } from "@/components/architecture/GlowCard";

const FloatingParticles = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-green-400 rounded-full"
          animate={{
            x: [Math.random() * 400, Math.random() * 400],
            y: [Math.random() * 400, Math.random() * 400],
            opacity: [0.5, 0.1],
          }}
          transition={{
            duration: Math.random() * 3 + 2,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        />
      ))}
    </div>
  );
};

const HeroSection = () => {
  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden pt-20 pb-12">
      {