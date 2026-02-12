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

        {/* Pipeline */}
        <div className="relative">
          {/* Connection line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-primary/20 via-secondary/40 to-primary/20 -translate-y-1/2" />

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {stages.map((stage, i) => (
              <motion.div
                key={i}
                className="relative group"
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.12 }}
              >
                <div className="glass-panel p-5 text-center cursor-pointer transition-all duration-500 group-hover:glow-green group-hover:neon-border-green group-hover:scale-105">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <stage.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-sm font-heading font-semibold mb-1">{stage.label}</h3>
                  <p className="text-xs text-muted-foreground">{stage.desc}</p>
                </div>
                {/* Arrow */}
                {i < stages.length - 1 && (
                  <div className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 z-20">
                    <motion.div
                      className="w-3 h-3 border-t-2 border-r-2 border-primary/40 rotate-45"
                      animate={{ x: [0, 4, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                    />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PipelineSection;
