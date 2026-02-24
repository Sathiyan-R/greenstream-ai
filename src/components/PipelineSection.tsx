import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Radio, GitBranch, Cpu, ShieldAlert, Leaf, Bot } from "lucide-react";

const stages = [
  { icon: Radio, label: "IoT Sensors", desc: "Real-time data ingestion" },
  { icon: GitBranch, label: "Pathway Connectors", desc: "Streaming data pipelines" },
  { icon: Cpu, label: "Streaming Engine", desc: "Stateful transformations" },
  { icon: ShieldAlert, label: "ML Anomaly Detection", desc: "Instant spike detection" },
  { icon: Leaf, label: "Carbon Intelligence", desc: "Emission tracking & scoring" },
  { icon: Bot, label: "LLM Assistant", desc: "Explainable AI insights" },
];

const PipelineSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-32 px-6 relative" id="solution">
      <div className="relative z-10 max-w-6xl mx-auto" ref={ref}>
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-6xl font-heading font-bold mb-4">
            Meet <span className="text-gradient">GreenStream AI</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            A real-time streaming pipeline from sensor to insight.
          </p>
        </motion.div>

        {