import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  BarChart, Bar, AreaChart, Area,
} from "recharts";
import { AlertTriangle, TrendingDown } from "lucide-react";

const energyData = [
  { time: "00:00", usage: 42, renewable: 28 },
  { time: "04:00", usage: 35, renewable: 30 },
  { time: "08:00", usage: 68, renewable: 45 },
  { time: "12:00", usage: 82, renewable: 60 },
  { time: "16:00", usage: 95, renewable: 38 },
  { time: "20:00", usage: 72, renewable: 32 },
  { time: "23:00", usage: 48, renewable: 25 },
];

const barData = [
  { zone: "Zone A", solar: 85, wind: 42 },
  { zone: "Zone B", solar: 65, wind: 58 },
  { zone: "Zone C", solar: 45, wind: 72 },
  { zone: "Zone D", solar: 92, wind: 35 },
];

const DashboardSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-32 px-6 relative" id="dashboard">
      <div className="relative z-10 max-w-6xl mx-auto" ref={ref}>
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-6xl font-heading font-bold mb-4">
            Live <span className="text-gradient">Dashboard</span> Preview
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Enterprise-grade analytics at a glance.
          </p>
        </motion.div>

        <motion.div
          className="glass-panel p-6 md:p-8 glow-green"
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          {