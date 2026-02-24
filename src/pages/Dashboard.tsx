import { useDashboardData } from "@/hooks/useDashboardData";
import { motion } from "framer-motion";
import { useEffect } from "react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  BarChart, Bar,
} from "recharts";
import {
  AlertTriangle, RefreshCw, Cloud, Wind, Droplets, Thermometer,
  Leaf, Zap, Sun, Activity, CheckCircle2, XCircle, TrendingUp,
  Brain, ShieldAlert, Calendar, MapPin,
} from "lucide-react";
import DashboardAIChat from "@/components/dashboard/DashboardAIChat";
import { Link } from "react-router-dom";

const MetricCard = ({ label, value, unit, icon: Icon, color = "primary" }: {
  label: string; value: string | number; unit: string; icon: any; color?: string;
}) => (
  <div className="glass-panel p-4">
    <div className="flex items-center gap-2 mb-2">
      <Icon className={`w-4 h-4 text-${color}`} />
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
    <div className="flex items-baseline gap-1">
      <span className="text-2xl font-heading font-bold">{value}</span>
      <span className="text-xs text-muted-foreground">{unit}</span>
    </div>
  </div>
);

const StatusDot = ({ connected, label }: { connected: boolean; label: string }) => (
  <div className="flex items-center gap-1.5">
    {connected ? (
      <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
    ) : (
      <XCircle className="w-3.5 h-3.5 text-destructive" />
    )}
    <span className="text-xs text-muted-foreground">{label}</span>
  </div>
);

const LiveDashboard = () => {
  const { state, loading, apiStatus, refresh } = useDashboardData();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const aqiLevel = (aqi: number) => {
    if (aqi <= 50) return { label: "Good", color: "text-primary" };
    if (aqi <= 100) return { label: "Moderate", color: "text-yellow-400" };
    if (aqi <= 150) return { label: "Unhealthy (Sensitive)", color: "text-orange-400" };
    return { label: "Unhealthy", color: "text-destructive" };
  };

  const aqi = state.airQuality?.aqi ?? 0;
  const aqiInfo = aqiLevel(aqi);

  const riskColor = state.prediction?.riskLevel === "High"
    ? "text-destructive" : state.prediction?.riskLevel === "Medium"
    ? "text-yellow-400" : "text-primary";

  return (
    <div className="min-h-screen bg-background text-foreground">
      {