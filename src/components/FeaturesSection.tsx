import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { RefreshCw, BarChart3, Leaf, ShieldAlert, MessageSquare, TrendingUp } from "lucide-react";

const features = [
  { icon: RefreshCw, title: "Live Streaming Intelligence", desc: "Processes energy, traffic, and weather data in milliseconds with zero latency.", color: "primary" },
  { icon: BarChart3, title: "Rolling Window Analytics", desc: "Stateful real-time aggregations and trend detection across time windows.", color: "secondary" },
  { icon: Leaf, title: "Carbon Footprint Calculator", desc: "Live carbon emission tracking per building, zone, or entire city grid.", color: "primary" },
  { icon: ShieldAlert, title: "AI Anomaly Detection", desc: "Detects abnormal energy spikes instantly using ML models on streaming data.", color: "secondary" },
  { icon: MessageSquare, title: "RAG-Powered AI Assistant", desc: "Ask 'Why did emissions spike?' and get explainable, contextual insights.", color: "primary" },
  { icon: TrendingUp, title: "Predictive Load Forecasting", desc: "Forecast peak load and recommend optimization strategies in real-time.", color: "secondary" },
];

const FeaturesSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-32 px-6 relative" id="features">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-[hsl(150_20%_4%)] to-background" />
      <div className="relative z-10 max-w-6xl mx-auto" ref={ref}>
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-6xl font-heading font-bold mb-4">
            Core <span className="text-gradient">Features</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Enterprise-grade capabilities built for the real-time era.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={i}
              className={`glass-panel p-8 group cursor-pointer transition-all duration-500 hover:scale-[1.02] ${
                f.color === "primary" ? "hover:glow-green" : "hover:glow-blue"
              }`}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 ${
                f.color === "primary" ? "bg-primary/10" : "bg-secondary/10"
              } group-hover:${f.color === "primary" ? "bg-primary/20" : "bg-secondary/20"} transition-colors`}>
                <f.icon className={`w-7 h-7 ${f.color === "primary" ? "text-primary" : "text-secondary"}`} />
              </div>
              <h3 className="text-xl font-heading font-semibold mb-3">{f.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
