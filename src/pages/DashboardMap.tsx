import { useState } from "react";
import { Link } from "react-router-dom";
import { MapMode, ZoneData, AIInsight } from "@/types/map";
import { chennaiZones, generateAIInsight } from "@/lib/mapData";
import { EnvironmentalMap } from "@/components/map/EnvironmentalMap";
import { MapControls } from "@/components/map/MapControls";
import { MapLegend } from "@/components/map/MapLegend";
import { AIInsightPanel } from "@/components/map/AIInsightPanel";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  MapPin, 
  Activity,
  TrendingUp,
  Info
} from "lucide-react";

const DashboardMap = () => {
  const [mode, setMode] = useState<MapMode>("temperature");
  const [selectedInsight, setSelectedInsight] = useState<AIInsight | null>(null);

  const handleZoneClick = (zone: ZoneData) => {
    const insight = generateAIInsight(zone);
    setSelectedInsight(insight);
  };

  const handleCloseInsight = () => {
    setSelectedInsight(null);
  };

  const handleModeChange = (newMode: MapMode) => {
    setMode(newMode);
    // Smooth transition effect
    const mapContainer = document.querySelector('.map-container');
    if (mapContainer) {
      mapContainer.classList.add('opacity-90');
      setTimeout(() => {
        mapContainer.classList.remove('opacity-90');
      }, 300);
    }
  };

  // Calculate statistics
  const stats = {
    temperature: {
      avg: (chennaiZones.reduce((sum, z) => sum + z.temperature, 0) / chennaiZones.length).toFixed(1),
      max: Math.max(...chennaiZones.map(z => z.temperature)),
      min: Math.min(...chennaiZones.map(z => z.temperature)),
    },
    aqi: {
      avg: Math.round(chennaiZones.reduce((sum, z) => sum + z.aqi, 0) / chennaiZones.length),
      max: Math.max(...chennaiZones.map(z => z.aqi)),
      min: Math.min(...chennaiZones.map(z => z.aqi)),
    },
    energy: {
      total: chennaiZones.reduce((sum, z) => sum + z.energy, 0),
      avg: Math.round(chennaiZones.reduce((sum, z) => sum + z.energy, 0) / chennaiZones.length),
      max: Math.max(...chennaiZones.map(z => z.energy)),
    },
  };

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
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                  <MapPin className="w-6 h-6 text-blue-500" />
                  Environmental Map
                </h1>
                <p className="text-sm text-gray-400 mt-0.5">
                  Chennai, Tamil Nadu - Real-time monitoring
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Badge variant="outline" className="gap-1 px-3 py-1">
                <Activity className="w-3 h-3 text-green-500" />
                <span className="text-xs">Live Data</span>
              </Badge>
              <Badge variant="outline" className="gap-1 px-3 py-1">
                <MapPin className="w-3 h-3 text-blue-500" />
                <span className="text-xs">{chennaiZones.length} Zones</span>
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Statistics Sidebar */}
          <div className="lg:col-span-1 space-y-4">
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
                    Click any zone on the map to view detailed AI-powered environmental insights and recommendations.
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
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400">Average</span>
                  <span className="text-sm font-bold text-white">{stats.temperature.avg}°C</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400">Range</span>
                  <span className="text-sm text-gray-300">
                    {stats.temperature.min}°C - {stats.temperature.max}°C
                  </span>
                </div>
              </div>
            </Card>

            {/* AQI Stats */}
            <Card className="p-4 bg-gray-800/50 border-gray-700">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-500 to-violet-500" />
                <h3 className="font-semibold text-white text-sm">Air Quality</h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400">Average AQI</span>
                  <span className="text-sm font-bold text-white">{stats.aqi.avg}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400">Range</span>
                  <span className="text-sm text-gray-300">
                    {stats.aqi.min} - {stats.aqi.max}
                  </span>
                </div>
              </div>
            </Card>

            {/* Energy Stats */}
            <Card className="p-4 bg-gray-800/50 border-gray-700">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-yellow-500 to-amber-500" />
                <h3 className="font-semibold text-white text-sm">Energy</h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400">Total</span>
                  <span className="text-sm font-bold text-white">{stats.energy.total} kWh</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400">Average</span>
                  <span className="text-sm text-gray-300">{stats.energy.avg} kWh</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400">Peak</span>
                  <span className="text-sm text-gray-300">{stats.energy.max} kWh</span>
                </div>
              </div>
            </Card>

            {/* Trend Card */}
            <Card className="p-4 bg-gradient-to-br from-emerald-950/50 to-green-950/50 border-emerald-500/30">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-emerald-500/20 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white text-sm mb-1">
                    Insights Available
                  </h3>
                  <p className="text-xs text-gray-300">
                    AI-powered analysis ready for all {chennaiZones.length} monitored zones
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Map Container */}
          <div className="lg:col-span-3">
            <Card className="overflow-hidden border-gray-700 bg-gray-900">
              <div 
                className="map-container relative w-full transition-opacity duration-300"
                style={{ height: "calc(100vh - 180px)" }}
              >
                <EnvironmentalMap
                  zones={chennaiZones}
                  mode={mode}
                  onZoneClick={handleZoneClick}
                />
                
                <MapControls mode={mode} onModeChange={handleModeChange} />
                <MapLegend mode={mode} />
                
                {selectedInsight && (
                  <AIInsightPanel
                    insight={selectedInsight}
                    onClose={handleCloseInsight}
                  />
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-auto py-4 border-t border-gray-800">
        <div className="container mx-auto px-4">
          <p className="text-center text-xs text-gray-500">
            GreenStream AI - Environmental Monitoring System | Data updates every 5 seconds
          </p>
        </div>
      </footer>
    </div>
  );
};

export default DashboardMap;
