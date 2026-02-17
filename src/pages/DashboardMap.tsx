import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MapMode, ZoneData } from "@/types/map";
import { useChennaiEnvironmentStatus } from "@/hooks/useChennaiEnvironmentStatus";
import { EnvironmentalMap } from "@/components/map/EnvironmentalMap";
import { MapControls } from "@/components/map/MapControls";
import { FloatingLegend } from "@/components/map/FloatingLegend";
import { AnimatedZonePopup } from "@/components/map/AnimatedZonePopup";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  MapPin, 
  Activity,
  TrendingUp,
  Info,
  RefreshCw
} from "lucide-react";

const DashboardMap = () => {
  const { zones, loading, lastUpdated, isLive, refresh } = useChennaiEnvironmentStatus();
  const [mode, setMode] = useState<MapMode>("sustainability");
  const [selectedZone, setSelectedZone] = useState<ZoneData | null>(null);

  const handleZoneClick = (zone: ZoneData) => {
    setSelectedZone(zone);
  };

  const handleCloseZonePopup = () => {
    setSelectedZone(null);
  };

  const handleModeChange = (newMode: MapMode) => {
    setMode(newMode);
  };

  // Calculate statistics from zones
  const stats = zones.length > 0 ? {
    avgSustainability: Math.round(
      zones.reduce((sum, z) => sum + z.sustainability_score, 0) / zones.length
    ),
    avgTemperature: (
      zones.reduce((sum, z) => sum + z.temperature, 0) / zones.length
    ).toFixed(1),
    avgAQI: Math.round(
      zones.reduce((sum, z) => sum + z.aqi, 0) / zones.length
    ),
    totalEnergy: Math.round(
      zones.reduce((sum, z) => sum + (z.energy_consumption || 0), 0)
    ),
  } : {
    avgSustainability: 0,
    avgTemperature: "0",
    avgAQI: 0,
    totalEnergy: 0,
  };

  if (loading && zones.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="mb-4"
          >
            <RefreshCw className="w-12 h-12 text-blue-500 mx-auto" />
          </motion.div>
          <p className="text-gray-400">Loading Chennai environmental data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <header className="bg-gray-900/50 backdrop-blur-md border-b border-gray-700 sticky top-0 z-30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/dashboard">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Dashboard
                </Button>
              </Link>
              <div className="h-8 w-px bg-gray-700" />
              <div>
                <motion.h1
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-2xl font-bold text-white flex items-center gap-2"
                >
                  <MapPin className="w-6 h-6 text-blue-500" />
                  Chennai Environmental Status
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="text-sm text-gray-400 mt-0.5"
                >
                  Real-time monitoring • Auto-refresh every 1 minute
                </motion.p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <AnimatePresence>
                {isLive && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                  >
                    <Badge className="gap-1 px-3 py-1 bg-green-500/20 text-green-400 border-green-500/50">
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        <Activity className="w-3 h-3" />
                      </motion.div>
                      <span className="text-xs font-semibold">🟢 Live Update</span>
                    </Badge>
                  </motion.div>
                )}
              </AnimatePresence>
              <Badge variant="outline" className="gap-1 px-3 py-1">
                <MapPin className="w-3 h-3 text-blue-500" />
                <span className="text-xs">{zones.length} Zones</span>
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={refresh}
                className="gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Statistics Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1 space-y-4"
          >
            {/* Sustainability Score */}
            <Card className="p-4 bg-gradient-to-br from-emerald-950/50 to-green-950/50 border-emerald-500/30">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-emerald-500/20 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white text-sm mb-1">
                    Avg Sustainability
                  </h3>
                  <p className="text-2xl font-bold text-emerald-400">
                    {stats.avgSustainability}/100
                  </p>
                </div>
              </div>
            </Card>

            {/* Temperature Stats */}
            <Card className="p-4 bg-gray-800/50 border-gray-700">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-orange-500 to-red-500" />
                <h3 className="font-semibold text-white text-sm">Temperature</h3>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400">Average</span>
                <span className="text-lg font-bold text-white">{stats.avgTemperature}°C</span>
              </div>
            </Card>

            {/* AQI Stats */}
            <Card className="p-4 bg-gray-800/50 border-gray-700">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-500 to-violet-500" />
                <h3 className="font-semibold text-white text-sm">Air Quality</h3>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400">Average AQI</span>
                <span className="text-lg font-bold text-white">{stats.avgAQI}</span>
              </div>
            </Card>

            {/* Energy Stats */}
            <Card className="p-4 bg-gray-800/50 border-gray-700">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-yellow-500 to-amber-500" />
                <h3 className="font-semibold text-white text-sm">Total Energy</h3>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400">Consumption</span>
                <span className="text-lg font-bold text-white">{stats.totalEnergy} kWh</span>
              </div>
            </Card>

            {/* Info Card */}
            <Card className="p-4 bg-gradient-to-br from-blue-950/50 to-purple-950/50 border-blue-500/30">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Info className="w-5 h-5 text-blue-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white text-sm mb-1">
                    How to Use
                  </h3>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    Click any zone to view detailed insights, predictions, and AI-powered recommendations.
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Map Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-3"
          >
            <Card className="overflow-hidden border-gray-700 bg-gray-900">
              <div 
                className="relative w-full"
                style={{ height: "calc(100vh - 180px)" }}
              >
                <EnvironmentalMap
                  zones={zones}
                  mode={mode}
                  onZoneClick={handleZoneClick}
                />
                
                <MapControls mode={mode} onModeChange={handleModeChange} />
                <FloatingLegend mode={mode} lastUpdated={lastUpdated} isLive={isLive} />
              </div>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Animated Zone Popup */}
      <AnimatePresence>
        {selectedZone && (
          <AnimatedZonePopup
            zone={selectedZone}
            onClose={handleCloseZonePopup}
          />
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="mt-auto py-4 border-t border-gray-800">
        <div className="container mx-auto px-4">
          <p className="text-center text-xs text-gray-500">
            GreenStream AI - Real-time Chennai Environmental Monitoring | Powered by Supabase
          </p>
        </div>
      </footer>
    </div>
  );
};

export default DashboardMap;
