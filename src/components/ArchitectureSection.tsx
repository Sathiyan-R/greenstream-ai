import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Radio, GitBranch, Cpu, Database, Brain, LayoutDashboard, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const nodes = [
  { icon: Radio, label: "IoT Devices", color: "primary" },
  { icon: GitBranch, label: "Pathway Streaming", color: "secondary" },
  { icon: Cpu, label: "Stateful Transforms", color: "primary" },
  { icon: Database, label: "Live Vector Index", color: "secondary" },
  { icon: Brain, label: "LLM xPack", color: "primary" },
  { icon: LayoutDashboard, label: "Dashboard & APIs", color: "secondary" },
];

const ArchitectureSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-32 px-6 relative" id="architecture">
      <div className="relative z-10 max-w-6xl mx-auto" ref={ref}>
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-6xl font-heading font-bold mb-4">
            Enterprise <span className="text-gradient">Architecture</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Production-grade infrastructure designed for scale.
          </p>
        </motion.div>

        <div className="relative">
          {