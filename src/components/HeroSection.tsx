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
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-[hsl(150_30%_5%)]" />

      {/* Grid lines */}
      <div className="absolute inset-0 opacity-30">
        {[10, 20, 30, 40, 50, 60, 70, 80, 90].map((p) => (
          <GridLine key={`h${p}`} orientation="h" position={p} />
        ))}
        {[10, 20, 30, 40, 50, 60, 70, 80, 90].map((p) => (
          <GridLine key={`v${p}`} orientation="v" position={p} />
        ))}
      </div>

      {/* Particles */}
      {particles.map((p, i) => (
        <Particle key={i} {...p} />
      ))}

      {/* Radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-primary/5 blur-[120px]" />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel neon-border-green mb-8">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse-glow" />
            <span className="text-sm text-muted-foreground font-body">Real-Time AI Infrastructure</span>
          </div>
        </motion.div>

        <motion.h1
          className="text-5xl md:text-7xl lg:text-8xl font-heading font-bold leading-[1.05] tracking-tight mb-6"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
        >
          AI That Thinks in{" "}
          <span className="text-gradient">Real-Time</span>.{" "}
          <br className="hidden md:block" />
          Cities That Act in{" "}
          <span className="text-gradient">Real-Time</span>.
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-10 font-body leading-relaxed"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          GreenStream AI is a real-time streaming intelligence platform that monitors energy,
          predicts carbon emissions, detects anomalies, and provides explainable AI insights
          powered by Pathway.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45 }}
        >
          <Button size="lg" asChild className="bg-primary text-primary-foreground hover:bg-primary/90 font-heading font-semibold text-base px-8 py-6 glow-green">
            <Link to="/dashboard">
              <Rocket className="w-5 h-5 mr-2" />
              View Live Demo
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild className="border-glass-border text-foreground hover:bg-muted font-heading font-semibold text-base px-8 py-6">
            <Link to="/explore-architecture">
              <Brain className="w-5 h-5 mr-2" />
              Explore AI Architecture
            </Link>
          </Button>
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default HeroSection;
