import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { AlertTriangle, Building2, Thermometer, Plug } from "lucide-react";

const stats = [
  { icon: AlertTriangle, value: 30, suffix: "%", label: "Urban energy wasted due to inefficiencies", color: "text-primary" },
  { icon: Building2, value: 72, suffix: "h", label: "Average delay in batch system decisions", color: "text-secondary" },
  { icon: Thermometer, value: 40, suffix: "%", label: "Carbon spikes from HVAC & traffic", color: "text-primary" },
  { icon: Plug, value: 60, suffix: "%", label: "Renewable energy underutilized globally", color: "text-secondary" },
];

const CountUp = ({ target, suffix }: { target: number; suffix: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 2000;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target]);

  return <span ref={ref}>{count}{suffix}</span>;
};

const ProblemSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-32 px-6 relative" id="problem">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-[hsl(150_20%_4%)] to-background" />
      <div className="relative z-10 max-w-6xl mx-auto" ref={ref}>
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-6xl font-heading font-bold mb-4">
            The <span className="text-gradient">Invisible</span> Energy Crisis
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Cities waste billions in energy while batch systems lag behind reality.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              className="glass-panel p-6 text-center group hover:glow-green transition-all duration-500"
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.15 }}
            >
              <stat.icon className={`w-8 h-8 mx-auto mb-4 ${stat.color}`} />
              <div className={`text-4xl md:text-5xl font-heading font-bold mb-2 ${stat.color}`}>
                <CountUp target={stat.value} suffix={stat.suffix} />
              </div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
