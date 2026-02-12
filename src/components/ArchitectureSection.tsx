import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Radio, GitBranch, Cpu, Database, Brain, LayoutDashboard } from "lucide-react";

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
          {/* Connecting line */}
          <div className="hidden md:block absolute top-1/2 left-[8%] right-[8%] h-px -translate-y-1/2">
            <div className="w-full h-full bg-gradient-to-r from-primary/30 via-secondary/30 to-primary/30 relative overflow-hidden">
              <motion.div
                className="absolute inset-y-0 w-20 bg-gradient-to-r from-transparent via-primary/60 to-transparent"
                animate={{ x: ["-80px", "calc(100% + 80px)"] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 relative z-10">
            {nodes.map((node, i) => (
              <motion.div
                key={i}
                className="flex flex-col items-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div className={`w-20 h-20 rounded-2xl glass-panel flex items-center justify-center mb-3 ${
                  node.color === "primary" ? "glow-green" : "glow-blue"
                }`}>
                  <node.icon className={`w-8 h-8 ${node.color === "primary" ? "text-primary" : "text-secondary"}`} />
                </div>
                <p className="text-xs font-heading font-semibold text-center">{node.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ArchitectureSection;
