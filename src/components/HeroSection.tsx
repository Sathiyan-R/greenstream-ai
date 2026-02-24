import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Rocket, Brain } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Particle = ({ delay, x, y, size }: { delay: number; x: number; y: number; size: number }) => (
  <motion.div
    className="absolute rounded-full bg-primary/20"
    style={{ width: size, height: size, left: `${x}%`, top: `${y}%` }}
    animate={{ y: [0, -30, 0], opacity: [0.2, 0.6, 0.2] }}
    transition={{ duration: 4 + Math.random() * 3, repeat: Infinity, delay }}
  />
);

const GridLine = ({ orientation, position }: { orientation: "h" | "v"; position: number }) => (
  <div
    className={`absolute ${orientation === "h" ? "w-full h-px left-0" : "h-full w-px top-0"} bg-gradient-to-r from-transparent via-primary/10 to-transparent`}
    style={orientation === "h" ? { top: `${position}%` } : { left: `${position}%` }}
  />
);

const HeroSection = () => {
  const particles = Array.from({ length: 30 }, (_, i) => ({
    delay: i * 0.3,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 2 + Math.random() * 4,
  }));

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {