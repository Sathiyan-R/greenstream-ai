import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { jsPDF } from "jspdf";
import { MapMode, ZoneData } from "@/types/map";
import { useChennaiEnvironmentStatus } from "@/hooks/useChennaiEnvironmentStatus";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useToast } from "@/hooks/use-toast";
import { EnvironmentalMap } from "@/components/map/EnvironmentalMap";
import { MapControls } from "@/components/map/MapControls";
import { FloatingLegend } from "@/components/map/FloatingLegend";
import { AnimatedZonePopup } from "@/components/map/AnimatedZonePopup";
import { AlertDNAPanel } from "@/components/map/AlertDNAPanel";
import { CarbonUtilizationPanel } from "@/components/carbon/CarbonUtilizationPanel";
import { MapSkeleton } from "@/components/map/MapSkeleton";
import { MapError } from "@/components/map/MapError";
import { generateCarbonRecommendation } from "@/lib/carbonEngine";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  ArrowLeft, 
  MapPin, 
  Activity,
  TrendingUp,
  Info,
  RefreshCw,
  Search,
  Download,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const DashboardMap = () => {
  const { zones, loading, lastUpdated, isLive, refresh, error } = useChennaiEnvironmentStatus();
  const { toast } = useToast();
  const [mode, setMode] = useState<MapMode>("sustainability");
  const [selectedZone, setSelectedZone] = useState<ZoneData | null>(null);
  const [selectedAlertZone, setSelectedAlertZone] = useState<ZoneData | null>(null);
  const [isDNAPanelOpen, setIsDNAPanelOpen] = useState(false);
  const [isCarbonPanelOpen, setIsCarbonPanelOpen] = useState(false);
  const [carbonRecommendation, setCarbonRecommendation] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarCollapsed, setSidebarCollapsed] = useLocalStorage('greenstream_sidebar_collapsed', false);

  // Filter zones based on search query
  const filteredZones = useMemo(() => {
    if (!searchQuery.trim()) return zones;
    
    const query = searchQuery.toLowerCase();
    return zones.filter(zone => 
      zone.zone_name.toLowerCase().includes(query) ||
      zone.zone_region.toLowerCase().includes(query)
    );
  }, [zones, searchQuery]);

  // Calculate statistics from zones
  const stats = filteredZones.length > 0 ? {
    avgSustainability: Math.round(
      filteredZones.reduce((sum, z) => sum + z.sustainability_score, 0) / filteredZones.length
    ),
    avgTemperature: (
      filteredZones.reduce((sum, z) => sum + z.temperature, 0) / filteredZones.length
    ),
    avgAQI: Math.round(
      filteredZones.reduce((sum, z) => sum + z.aqi, 0) / filteredZones.length
    ),
    totalEnergy: Math.round(
      filteredZones.reduce((sum, z) => sum + (z.energy_consumption || 0), 0)
    ),
  } : {
    avgSustainability: 0,
    avgTemperature: 0,
    avgAQI: 0,
    totalEnergy: 0,
  };

  const totalCarbon = useMemo(() => (
    filteredZones.reduce((sum, z) => sum + (z.carbon_emission || 0), 0)
  ), [filteredZones]);

  const handleZoneClick = (zone: ZoneData) => {
    setSelectedZone(zone);
  };

  const handleAlertMarkerClick = (zone: ZoneData) => {
    setSelectedAlertZone(zone);
    setIsDNAPanelOpen(true);
  };

  const handleCloseDNAPanel = () => {
    setIsDNAPanelOpen(false);
    setSelectedAlertZone(null);
  };

  const handleZoneClickForCarbon = (zone: ZoneData) => {
    const recommendation = generateCarbonRecommendation(
      zone.id,
      zone.zone_name,
      zone.carbon_emission,
      zone.energy_consumption,
      zone.sustainability_score
    );
    setCarbonRecommendation(recommendation);
    setIsCarbonPanelOpen(true);
  };

  const handleCloseCarbonPanel = () => {
    setIsCarbonPanelOpen(false);
    setCarbonRecommendation(null);
  };

  const handleCloseZonePopup = () => {
    setSelectedZone(null);
  };

  const handleModeChange = (newMode: MapMode) => {
    setMode(newMode);
  };

  // Export zone data as PDF
  const handleExportData = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let yPos = 20;

    // Title
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("Chennai Environmental Status Report", pageWidth / 2, yPos, { align: "center" });
    yPos += 10;

    // Date and Time
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth / 2, yPos, { align: "center" });
    yPos += 15;

    // Summary Statistics
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Summary Statistics", 15, yPos);
    yPos += 8;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Average Sustainability Score: ${stats.avgSustainability}/100`, 15, yPos);
    yPos += 6;
    doc.text(`Average Temperature: ${stats.avgTemperature.toFixed(1)}°C`, 15, yPos);
    yPos += 6;
    doc.text(`Average AQI: ${stats.avgAQI}`, 15, yPos);
    yPos += 6;
    doc.text(`Total Energy Consumption: ${stats.totalEnergy} kWh`, 15, yPos);
    yPos += 6;
    doc.text(`Total Carbon Emissions: ${Math.round(totalCarbon)} kg CO₂`, 15, yPos);
    yPos += 6;
    doc.text(`Total Zones: ${filteredZones.length}`, 15, yPos);
    yPos += 12;

    // Zone Details
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Zone Details", 15, yPos);
    yPos += 8;

    filteredZones.forEach((zone, index) => {
      // Check if we need a new page
      if (yPos > pageHeight - 40) {
        doc.addPage();
        yPos = 20;
      }

      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text(`${index + 1}. ${zone.zone_name}`, 15, yPos);
      yPos += 6;

      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.text(`Region: ${zone.zone_region}`, 20, yPos);
      yPos += 5;
      doc.text(`Sustainability Score: ${zone.sustainability_score}/100`, 20, yPos);
      yPos += 5;
      doc.text(`Temperature: ${zone.temperature.toFixed(1)}°C`, 20, yPos);
      yPos += 5;
      doc.text(`AQI: ${zone.aqi}`, 20, yPos);
      yPos += 5;
      doc.text(`Energy Consumption: ${zone.energy_consumption} kWh`, 20, yPos);
      yPos += 5;
      doc.text(`Carbon Emission: ${zone.carbon_emission} kg CO₂`, 20, yPos);
      yPos += 5;
      if (zone.humidity !== undefined) {
        doc.text(`Humidity: ${zone.humidity}%`, 20, yPos);
        yPos += 5;
      }
      if (zone.wind_speed !== undefined) {
        doc.text(`Wind Speed: ${zone.wind_speed} km/h`, 20, yPos);
        yPos += 5;
      }
      yPos += 3;
    });

    // Save PDF
    doc.save(`chennai-environmental-report-${new Date().toISOString().split('T')[0]}.pdf`);
    
    // Show success toast
    toast({
      title: "Export Successful! ✅",
      description: "Your environmental report has been downloaded.",
      duration: 3000,
    });
  };

  // Show error state
  if (error && zones.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <header className="bg-gray-900/50 backdrop-blur-md border-b border-gray-700 sticky top-0 z-30">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-4">
              <Link to="/dashboard">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </header>
        <div className="container mx-auto px-4 py-6">
          <div className="h-[600px]">
            <MapError error={error} onRetry={refresh} />
          </div>
        </div>
      </div>
    );
  }

  if (loading && zones.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <header className="bg-gray-900/50 backdrop-blur-md border-b border-gray-700 sticky top-0 z-30">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-4">
              <Link to="/dashboard">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </header>
        <div className="container mx-auto px-4 py-6">
          <div className="h-[600px]">
            <MapSkeleton />
          </div>
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
                <span className="text-xs">{filteredZones.length} Zone{filteredZones.length !== 1 ? 's' : ''}</span>
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportData}
                className="gap-2"
                title="Export zone data as PDF"
              >
                <Download className="w-4 h-4" />
                Export
              </Button>
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
        <div className="relative">
          {/* Sidebar Toggle Button (Mobile) */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="lg:hidden fixed top-20 left-4 z-50 bg-gray-800 border-gray-700"
          >
            {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Statistics Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ 
                opacity: sidebarCollapsed ? 0 : 1, 
                x: sidebarCollapsed ? -20 : 0,
                display: sidebarCollapsed ? 'none' : 'block'
              }}
              className="lg:col-span-1 space-y-4 lg:block"
            >
              {/* Search Box */}
              <Card className="p-4 bg-gray-800/50 border-gray-700">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search zones..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-gray-900/50 border-gray-600 text-white placeholder:text-gray-500 focus:border-blue-500"
                  />
                </div>
                {searchQuery && (
                  <p className="text-xs text-gray-400 mt-2">
                    {filteredZones.length === 0 
                      ? "No zones found" 
                      : `Showing ${filteredZones.length} zone${filteredZones.length !== 1 ? 's' : ''}`}
                  </p>
                )}
              </Card>

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
                  <span className="text-lg font-bold text-white">{stats.avgTemperature.toFixed(1)}°C</span>
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

              {/* Carbon Stats */}
              <Card className="p-4 bg-gray-800/50 border-gray-700">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-3 h-3 rounded-full bg-gradient-to-r from-red-500 to-pink-500" />
                  <h3 className="font-semibold text-white text-sm">Carbon Emissions</h3>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400">Total</span>
                  <span className="text-lg font-bold text-white">{Math.round(totalCarbon)} kg CO₂</span>
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
                      Click zones for insights. Press <kbd className="px-1.5 py-0.5 bg-gray-700 rounded text-[10px] font-mono">ESC</kbd> to close panels.
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
                    zones={filteredZones}
                    mode={mode}
                    onZoneClick={handleZoneClick}
                    onAlertMarkerClick={handleAlertMarkerClick}
                  />
                  
                  <MapControls mode={mode} onModeChange={handleModeChange} />
                  <FloatingLegend mode={mode} lastUpdated={lastUpdated} isLive={isLive} />
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Animated Zone Popup */}
      <AnimatePresence>
        {selectedZone && (
          <AnimatedZonePopup
            zone={selectedZone}
            onClose={handleCloseZonePopup}
            onCarbonAnalysis={handleZoneClickForCarbon}
          />
        )}
      </AnimatePresence>

      {/* Environmental DNA Panel */}
      <AlertDNAPanel
        zone={selectedAlertZone}
        isOpen={isDNAPanelOpen}
        onClose={handleCloseDNAPanel}
      />

      {/* Carbon Utilization Panel */}
      <AnimatePresence>
        {isCarbonPanelOpen && carbonRecommendation && (
          <CarbonUtilizationPanel
            recommendation={carbonRecommendation}
            onClose={handleCloseCarbonPanel}
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