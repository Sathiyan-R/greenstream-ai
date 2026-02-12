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
          {/* Top bar */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-primary animate-pulse-glow" />
              <span className="text-sm font-heading font-semibold text-primary">LIVE</span>
              <span className="text-xs text-muted-foreground">GreenStream Dashboard v2.4</span>
            </div>
            <div className="flex items-center gap-2">
              <motion.div
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-destructive/10 border border-destructive/20"
                animate={{ opacity: [1, 0.6, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <AlertTriangle className="w-3.5 h-3.5 text-destructive" />
                <span className="text-xs text-destructive font-medium">Anomaly: Zone C spike +22%</span>
              </motion.div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {[
              { label: "Carbon Score", value: "73.2", unit: "tCO₂e", trend: "-4.2%", good: true },
              { label: "Energy Usage", value: "842", unit: "MWh", trend: "+1.8%", good: false },
              { label: "Renewable %", value: "67.3", unit: "%", trend: "+5.1%", good: true },
              { label: "Anomalies", value: "3", unit: "active", trend: "-2", good: true },
            ].map((m, i) => (
              <div key={i} className="bg-muted/30 rounded-xl p-4 border border-border">
                <p className="text-xs text-muted-foreground mb-1">{m.label}</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-heading font-bold">{m.value}</span>
                  <span className="text-xs text-muted-foreground">{m.unit}</span>
                </div>
                <div className={`flex items-center gap-1 mt-1 text-xs ${m.good ? "text-primary" : "text-destructive"}`}>
                  <TrendingDown className={`w-3 h-3 ${!m.good ? "rotate-180" : ""}`} />
                  {m.trend}
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Energy Usage Chart */}
            <div className="bg-muted/20 rounded-xl p-4 border border-border">
              <p className="text-xs text-muted-foreground mb-4 font-heading font-semibold">Energy Usage vs Renewable (MWh)</p>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={energyData}>
                  <defs>
                    <linearGradient id="usageGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00FF88" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#00FF88" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(150 10% 14%)" />
                  <XAxis dataKey="time" tick={{ fill: "hsl(150 10% 55%)", fontSize: 11 }} />
                  <YAxis tick={{ fill: "hsl(150 10% 55%)", fontSize: 11 }} />
                  <Tooltip contentStyle={{ background: "hsl(150 15% 6%)", border: "1px solid hsl(150 10% 18%)", borderRadius: "8px", fontSize: 12 }} />
                  <Area type="monotone" dataKey="usage" stroke="#00FF88" fill="url(#usageGrad)" strokeWidth={2} />
                  <Line type="monotone" dataKey="renewable" stroke="#00D4FF" strokeWidth={2} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Renewable Production */}
            <div className="bg-muted/20 rounded-xl p-4 border border-border">
              <p className="text-xs text-muted-foreground mb-4 font-heading font-semibold">Renewable Production by Zone</p>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(150 10% 14%)" />
                  <XAxis dataKey="zone" tick={{ fill: "hsl(150 10% 55%)", fontSize: 11 }} />
                  <YAxis tick={{ fill: "hsl(150 10% 55%)", fontSize: 11 }} />
                  <Tooltip contentStyle={{ background: "hsl(150 15% 6%)", border: "1px solid hsl(150 10% 18%)", borderRadius: "8px", fontSize: 12 }} />
                  <Bar dataKey="solar" fill="#00FF88" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="wind" fill="#00D4FF" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default DashboardSection;
