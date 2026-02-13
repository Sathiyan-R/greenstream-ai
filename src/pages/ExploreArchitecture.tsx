import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Cloud,
  Zap,
  GitBranch,
  Brain,
  Radio,
  Gauge,
  AlertTriangle,
  TrendingUp,
  MessageSquare,
  CheckCircle2,
  Database,
  Cpu,
  Code2,
  Clock,
  Activity,
  Lightbulb,
} from "lucide-react";
import { ArchitectureNode } from "@/components/architecture/ArchitectureNode";
import { AnimatedConnector } from "@/components/architecture/AnimatedConnector";
import { GlowCard } from "@/components/architecture/GlowCard";

// Data flow animation particles
const FloatingParticles = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-green-400 rounded-full"
          animate={{
            x: [Math.random() * 400, Math.random() * 400],
            y: [Math.random() * 400, Math.random() * 400],
            opacity: [0.5, 0.1],
          }}
          transition={{
            duration: Math.random() * 3 + 2,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        />
      ))}
    </div>
  );
};

// Hero Section with animated background
const HeroSection = () => {
  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden pt-20 pb-12">
      {/* Animated background gradient */}
      <div className="absolute inset-0">
        <motion.div
          animate={{
            background: [
              "radial-gradient(circle at 20% 50%, rgba(34, 197, 94, 0.15) 0%, transparent 50%)",
              "radial-gradient(circle at 80% 50%, rgba(34, 197, 94, 0.15) 0%, transparent 50%)",
              "radial-gradient(circle at 20% 50%, rgba(34, 197, 94, 0.15) 0%, transparent 50%)",
            ],
          }}
          transition={{ duration: 5, repeat: Infinity }}
          className="absolute inset-0"
        />

        {/* Animated grid lines */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-gradient-to-b from-green-500 to-transparent" />
          <motion.div
            animate={{ y: [-1000, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 bg-[linear-gradient(0deg,transparent_24%,rgba(34,197,94,.1)_25%,rgba(34,197,94,.1)_26%,transparent_27%,transparent_74%,rgba(34,197,94,.1)_75%,rgba(34,197,94,.1)_76%,transparent_77%,transparent)] bg-[size:50px_50px]"
          />
        </div>

        {/* Floating particles - reduced for cleaner look */}
        <div className="absolute inset-0">
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-green-500 rounded-full"
              animate={{
                y: [0, -800],
                opacity: [0, 0.8, 0],
              }}
              transition={{
                duration: Math.random() * 3 + 3,
                repeat: Infinity,
                delay: i * 0.3,
              }}
              style={{
                left: `${Math.random() * 100}%`,
                filter: `blur(${Math.random()}px)`,
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 text-center px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-cyan-400 to-blue-400">
            GreenStream AI Architecture
          </h1>

          <motion.p
            className="text-xl md:text-2xl text-gray-300 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Real-Time Streaming + Prediction + RAG-Powered Intelligence
          </motion.p>

          <motion.div
            className="h-1 w-24 bg-gradient-to-r from-green-400 via-cyan-400 to-blue-400 mx-auto mb-12 rounded-full"
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          />
        </motion.div>
      </div>
    </section>
  );
};

// Main Architecture Diagram
const ArchitectureDiagram = () => {
  const layers = [
    {
      title: "External APIs",
      description: "Data Sources",
      details: [
        "OpenWeather API - Real-time weather data",
        "Air Pollution API - Emissions data",
        "Forecast API - Future predictions",
        "Simulated Energy Stream - Test data",
      ],
      icon: Cloud,
      color: "green" as const,
    },
    {
      title: "Data Processing Engine",
      description: "Transform & Aggregate",
      details: [
        "Carbon Calculation - CO2 metrics",
        "Rolling Window Aggregation - Time-series data",
        "Anomaly Detection - Outlier identification",
      ],
      icon: Cpu,
      color: "blue" as const,
    },
    {
      title: "Prediction Engine",
      description: "Forecast Models",
      details: [
        "Tomorrow Energy Forecast - 24h prediction",
        "Carbon Forecast - Emission estimates",
        "Risk Assessment Module - Threat analysis",
      ],
      icon: TrendingUp,
      color: "green" as const,
    },
    {
      title: "AI Intelligence Layer",
      description: "RAG + LLM",
      details: [
        "Context Builder - Data collection",
        "Real-Time Data Injection - Live metrics",
        "OpenAI LLM - Language processing",
        "RAG Engine - Knowledge retrieval",
      ],
      icon: Brain,
      color: "cyan" as const,
    },
    {
      title: "Output Layer",
      description: "User Interfaces",
      details: [
        "Interactive Dashboard - Data visualization",
        "Smart Alerts - Notifications",
        "AI Assistant - Chat interface",
        "Sustainability Suggestions - Recommendations",
      ],
      icon: Radio,
      color: "blue" as const,
    },
  ];

  return (
    <section className="py-24 px-4 relative">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-cyan-400">
              Complete System Flow
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Click any layer to explore detailed information
          </p>
        </motion.div>

        {/* Vertical Architecture Flow */}
        <div className="space-y-8">
          {layers.map((layer, idx) => (
            <div key={idx}>
              <div className="grid grid-cols-1 gap-4">
                <ArchitectureNode
                  title={layer.title}
                  description={layer.description}
                  details={layer.details}
                  icon={layer.icon}
                  color={layer.color}
                  index={idx}
                />
              </div>

              {idx < layers.length - 1 && (
                <div className="flex justify-center py-4">
                  <AnimatedConnector color={layer.color} vertical delay={idx * 0.1} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Real-Time Data Flow Visualization
const DataFlowSection = () => {
  const indicators = [
    { label: "Streaming Active", color: "bg-green-500", status: true },
    { label: "Prediction Engine Running", color: "bg-blue-500", status: true },
    { label: "AI Model Connected", color: "bg-cyan-500", status: true },
  ];

  return (
    <section className="py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-cyan-400">
              Real-Time Data Flow
            </span>
          </h2>
          <p className="text-gray-400 text-lg">
            Live system status and data streaming indicators
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {indicators.map((indicator, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
            >
              <GlowCard variant="primary">
                <div className="flex items-center gap-4">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className={`w-12 h-12 rounded-full ${indicator.color} flex items-center justify-center flex-shrink-0`}
                  >
                    <motion.div
                      animate={{ opacity: [1, 0.5, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-6 h-6 rounded-full bg-white/20"
                    />
                  </motion.div>
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {indicator.label}
                    </p>
                    <p
                      className={`text-xs ${indicator.status ? "text-green-400" : "text-red-400"}`}
                    >
                      {indicator.status ? "● Online" : "● Offline"}
                    </p>
                  </div>
                </div>
              </GlowCard>
            </motion.div>
          ))}
        </div>

        {/* Animated data flow visualization */}
        <motion.div
          className="relative h-72 rounded-xl overflow-hidden border border-green-500/30 bg-gradient-to-br from-green-500/5 to-blue-500/5 p-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <FloatingParticles />

          <div className="relative z-10 flex flex-col justify-between h-full">
            <div className="text-center">
              <motion.p
                className="text-green-400 font-mono text-sm"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {">"} Streaming data from sources...
              </motion.p>
            </div>

            <div className="grid grid-cols-9 gap-2 h-32">
              {[...Array(9)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ height: ["20%", "100%", "20%"] }}
                  transition={{
                    duration: Math.random() * 2 + 1,
                    repeat: Infinity,
                    delay: i * 0.1,
                  }}
                  className="bg-gradient-to-t from-green-400 to-cyan-400 opacity-70 rounded"
                />
              ))}
            </div>

            <div className="text-center">
              <motion.p
                className="text-cyan-400 font-mono text-sm"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              >
                {">"} Processing 1,234 events/sec
              </motion.p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// Prediction Logic Section
const PredictionLogicSection = () => {
  const [expanded, setExpanded] = useState(false);

  const steps = [
    {
      icon: Zap,
      title: "Temperature Factor",
      description: "Adjusts energy demand based on forecast",
    },
    {
      icon: Gauge,
      title: "Energy Demand",
      description: "Calculates consumption predictions",
    },
    {
      icon: TrendingUp,
      title: "Carbon Emission",
      description: "Estimates environmental impact",
    },
    {
      icon: AlertTriangle,
      title: "Risk Assessment",
      description: "Identifies potential issues",
    },
  ];

  return (
    <section className="py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-cyan-400">
              Prediction Logic
            </span>
          </h2>
          <p className="text-gray-400 text-lg">
            How tomorrow's energy and carbon forecasts are calculated
          </p>
        </motion.div>

        {/* Formula Card */}
        <motion.div
          onClick={() => setExpanded(!expanded)}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <GlowCard variant="accent" isExpanded={expanded}>
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-sm text-gray-400 mb-4 font-semibold">Click to expand • Prediction Formula</p>
                <div className="bg-black/40 p-8 rounded-lg border border-cyan-500/20 font-mono text-cyan-400 text-lg">
                  <motion.span
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    predicted_energy = current_energy × temperature_factor
                  </motion.span>
                </div>
              </div>

              {expanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="pt-6 border-t border-cyan-500/20 space-y-4"
                >
                  <div className="grid grid-cols-1 gap-4">
                    {[
                      {
                        label: "current_energy",
                        value: "Last 24h average consumption",
                      },
                      {
                        label: "temperature_factor",
                        value: "1.0 + ((forecast_temp - avg_temp) × 0.05)",
                      },
                      {
                        label: "carbon_emission",
                        value: "predicted_energy × grid_carbon_intensity",
                      },
                    ].map((item) => (
                      <div key={item.label} className="flex justify-between items-center text-sm p-3 bg-white/5 rounded border border-cyan-500/10">
                        <span className="text-cyan-400 font-mono">
                          {item.label}:
                        </span>
                        <span className="text-gray-300 text-right">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </GlowCard>
        </motion.div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
            >
              <GlowCard variant="primary">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-green-500/20 rounded-lg text-green-400 flex-shrink-0">
                    <step.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-2">{step.title}</h4>
                    <p className="text-sm text-gray-400">{step.description}</p>
                  </div>
                </div>
              </GlowCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// RAG Explanation Flow
const RAGFlowSection = () => {
  const ragSteps = [
    {
      step: "1. User Question",
      description: 'e.g. "How is my energy consumption trending?"',
      icon: MessageSquare,
    },
    {
      step: "2. Context Builder",
      description: "Collects relevant metrics and history",
      icon: Database,
    },
    {
      step: "3. Live Metrics Injection",
      description: "Inserts real-time data into the prompt",
      icon: Activity,
    },
    {
      step: "4. LLM Processing",
      description: "OpenAI GPT processes enriched context",
      icon: Lightbulb,
    },
    {
      step: "5. Structured Response",
      description: "Returns AI-generated insights with data",
      icon: CheckCircle2,
    },
  ];

  return (
    <section className="py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-cyan-400">
              RAG Intelligence Flow
            </span>
          </h2>
          <p className="text-gray-400 text-lg">
            How real-time data enhances AI explanations
          </p>
        </motion.div>

        {/* Flow Diagram */}
        <div className="relative mb-16">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-5 gap-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
            }}
          >
            {ragSteps.map((item, idx) => (
              <motion.div
                key={idx}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
              >
                <GlowCard variant={idx % 2 === 0 ? "primary" : "secondary"}>
                  <div className="text-center space-y-4">
                    <div
                      className={`p-4 rounded-lg w-fit mx-auto ${
                        idx % 2 === 0
                          ? "bg-green-500/20 text-green-400"
                          : "bg-blue-500/20 text-blue-400"
                      }`}
                    >
                      <item.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-bold text-white text-sm mb-2">
                        {item.step}
                      </p>
                      <p className="text-xs text-gray-400">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </GlowCard>

                {idx < ragSteps.length - 1 && (
                  <div className="hidden md:flex justify-center py-4">
                    <AnimatedConnector
                      color={idx % 2 === 0 ? "green" : "blue"}
                      vertical={false}
                      delay={idx * 0.1}
                    />
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* RAG Details Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          viewport={{ once: true }}
        >
          <GlowCard variant="accent">
            <h3 className="text-2xl font-bold text-white mb-6">
              How Real-Time Data Enhances AI Responses
            </h3>
            <ul className="space-y-4">
              {[
                "Current energy consumption figures injected into prompt",
                "Carbon intensity levels included for context",
                "Recent anomalies flagged for attention",
                "Forecast data integrated for predictions",
                "Historical patterns analyzed for trends",
              ].map((item, idx) => (
                <motion.li
                  key={idx}
                  className="flex items-start gap-3 text-gray-300 p-3 bg-white/5 rounded border border-cyan-500/10 hover:border-cyan-500/30 transition-colors"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  viewport={{ once: true }}
                >
                  <span className="text-cyan-400 mt-1 font-bold flex-shrink-0">→</span>
                  <span>{item}</span>
                </motion.li>
              ))}
            </ul>
          </GlowCard>
        </motion.div>
      </div>
    </section>
  );
};

// Tech Stack Section
const TechStackSection = () => {
  const techStack = [
    {
      name: "Node.js",
      icon: Code2,
      description: "Runtime for backend services",
      color: "green",
    },
    {
      name: "OpenAI API",
      icon: Brain,
      description: "LLM and intelligence layer",
      color: "green",
    },
    {
      name: "OpenWeather API",
      icon: Cloud,
      description: "Weather data source",
      color: "blue",
    },
    {
      name: "React",
      icon: Radio,
      description: "Frontend UI framework",
      color: "blue",
    },
    {
      name: "Tailwind CSS",
      icon: Zap,
      description: "Styling and design system",
      color: "cyan",
    },
    {
      name: "Framer Motion",
      icon: GitBranch,
      description: "Animation library",
      color: "cyan",
    },
  ];

  return (
    <section className="py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-cyan-400">
              Technology Stack
            </span>
          </h2>
          <p className="text-gray-400 text-lg">
            Enterprise-grade tools and frameworks
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {techStack.map((tech, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -8 }}
            >
              <GlowCard variant="primary">
                <div className="space-y-4">
                  <div
                    className={`p-4 w-fit rounded-lg ${
                      tech.color === "green"
                        ? "bg-green-500/20 text-green-400"
                        : tech.color === "blue"
                          ? "bg-blue-500/20 text-blue-400"
                          : "bg-cyan-500/20 text-cyan-400"
                    }`}
                  >
                    <tech.icon className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg">
                      {tech.name}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {tech.description}
                    </p>
                  </div>
                </div>
              </GlowCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// CTA Section
const CTASection = () => {
  return (
    <section className="py-20 px-4 border-t border-green-500/20">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <GlowCard variant="accent">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-white">
                Return to Dashboard
              </h2>
              <p className="text-gray-300 text-lg">
                Ready to monitor your energy and carbon emissions with real-time
                intelligence? Go back to the dashboard.
              </p>

              <div className="flex justify-center pt-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-green-500/50"
                  onClick={() => window.location.href = "/dashboard"}
                >
                  Back to Dashboard
                </motion.button>
              </div>
            </div>
          </GlowCard>
        </motion.div>
      </div>
    </section>
  );
};

// Main Page Component
const ExploreArchitecture = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden">
      <HeroSection />
      <ArchitectureDiagram />
      <DataFlowSection />
      <PredictionLogicSection />
      <RAGFlowSection />
      <TechStackSection />
      <CTASection />
    </div>
  );
};

export default ExploreArchitecture;
