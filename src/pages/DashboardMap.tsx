import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { jsPDF } from "jspdf";
import { MapMode, ZoneData } from "@/types/map";
import { useChennaiEnvironmentStatus } from "@/hooks/useChennaiEnvironmentStatus";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { EnvironmentalMap } from "@/components/map/EnvironmentalMap";
import { MapControls } from "@/components/map/MapControls";
import { FloatingLegend } from "@/components/map/FloatingLegend";
import { AnimatedZonePopup } from "@/components/map/AnimatedZonePopup";
import { AlertDNAPanel } from "@/components/map/AlertDNAPanel";
import { MapSkeleton } from "@/components/map/MapSkeleton";
import { MapError } from "@/components/map/MapError";
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
  Leaf,
  Trophy,
  Users,
  Swords,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

const DashboardMap = () => {
  const { zones, loading, lastUpdated, isLive, refresh, error } = useChennaiEnvironmentStatus();
  const [mode, setMode] = useState<MapMode>("sustainability");
  const [selectedZone, setSelectedZone] = useState<ZoneData | null>(null);
  const [selectedAlertZone, setSelectedAlertZone] = useState<ZoneData | null>(null);
  const [isDNAPanelOpen, setIsDNAPanelOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [simTrees, setSimTrees] = useLocalStorage('greenstream_sim_trees', 2500);
  const [simEfficiency, setSimEfficiency] = useLocalStorage('greenstream_sim_efficiency', 12);
  const [simTraffic, setSimTraffic] = useLocalStorage('greenstream_sim_traffic', 8);
  const [credits, setCredits] = useLocalStorage('greenstream_credits', 1280);
  const [creditDelta, setCreditDelta] = useState(120);
  const [compareCityA, setCompareCityA] = useLocalStorage('greenstream_city_a', "Chennai");
  const [compareCityB, setCompareCityB] = useLocalStorage('greenstream_city_b', "Bengaluru");
  const [battleZone1Id, setBattleZone1Id] = useLocalStorage('greenstream_battle_zone1', "");
  const [battleZone2Id, setBattleZone2Id] = useLocalStorage('greenstream_battle_zone2', "");
  const [zone1Trees, setZone1Trees] = useLocalStorage('greenstream_z1_trees', 1000);
  const [zone1Efficiency, setZone1Efficiency] = useLocalStorage('greenstream_z1_efficiency', 10);
  const [zone1Traffic, setZone1Traffic] = useLocalStorage('greenstream_z1_traffic', 5);
  const [zone2Trees, setZone2Trees] = useLocalStorage('greenstream_z2_trees', 1000);
  const [zone2Efficiency, setZone2Efficiency] = useLocalStorage('greenstream_z2_efficiency', 10);
  const [zone2Traffic, setZone2Traffic] = useLocalStorage('greenstream_z2_traffic', 5);
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

  // Export zone data as JSON
  const handleExportData = () => {
    const dataStr = JSON.stringify(filteredZones, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `chennai-environmental-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

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

  const handleCloseZonePopup = () => {
    setSelectedZone(null);
  };

  const handleModeChange = (newMode: MapMode) => {
    setMode(newMode);
  };

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

  const cityData = useMemo(() => {
    const chennai = {
      name: "Chennai",
      avgTemperature: stats.avgTemperature,
      avgAQI: stats.avgAQI,
      avgSustainability: stats.avgSustainability,
      totalEnergy: stats.totalEnergy,
      totalCarbon: Math.round(totalCarbon),
      greenCredits: credits
    };

    return {
      Chennai: chennai,
      Bengaluru: {
        name: "Bengaluru",
        avgTemperature: 27.4,
        avgAQI: 92,
        avgSustainability: 71,
        totalEnergy: 21200,
        totalCarbon: 4120,
        greenCredits: 960
      },
      Hyderabad: {
        name: "Hyderabad",
        avgTemperature: 29.2,
        avgAQI: 104,
        avgSustainability: 66,
        totalEnergy: 23800,
        totalCarbon: 4680,
        greenCredits: 880
      }
    };
  }, [stats.avgTemperature, stats.avgAQI, stats.avgSustainability, stats.totalEnergy, totalCarbon, credits]);

  const comparisonA = cityData[compareCityA as keyof typeof cityData];
  const comparisonB = cityData[compareCityB as keyof typeof cityData];

  const simulator = useMemo(() => {
    const baseTemp = stats.avgTemperature;
    const baseAQI = stats.avgAQI;
    const baseEnergy = stats.totalEnergy;
    const baseCarbon = totalCarbon;

    const treeTempReduction = Math.min(2.5, (simTrees / 5000) * 1.4);
    const treeAqiReduction = Math.min(18, (simTrees / 5000) * 10);
    const trafficAqiReduction = Math.min(12, (simTraffic / 30) * 12);
    const energyReduction = Math.min(0.3, simEfficiency / 100);
    const carbonReduction = Math.min(0.35, energyReduction * 0.8 + (simTrees / 20000));

    return {
      predictedTemp: Math.max(0, baseTemp - treeTempReduction),
      predictedAQI: Math.max(0, Math.round(baseAQI - treeAqiReduction - trafficAqiReduction)),
      predictedEnergy: Math.max(0, Math.round(baseEnergy * (1 - energyReduction))),
      predictedCarbon: Math.max(0, Math.round(baseCarbon * (1 - carbonReduction))),
      impactScore: Math.min(100, Math.round((treeTempReduction * 12) + (trafficAqiReduction * 4) + (energyReduction * 120)))
    };
  }, [simTrees, simEfficiency, simTraffic, stats.avgTemperature, stats.avgAQI, stats.totalEnergy, totalCarbon]);

  const leaderboard = useMemo(() => (
    [...filteredZones]
      .sort((a, b) => b.sustainability_score - a.sustainability_score)
      .slice(0, 3)
  ), [filteredZones]);

  const handleCreditsUpdate = () => {
    if (!creditDelta || creditDelta <= 0) return;
    setCredits((prev) => prev + creditDelta);
  };

  // Export Zone Battle results as PDF
  const handleExportBattle = () => {
    if (!zoneBattle) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    let yPos = 20;

    // Title
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("Zone Battle Comparison Report", pageWidth / 2, yPos, { align: "center" });
    yPos += 15;

    // Date
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth / 2, yPos, { align: "center" });
    yPos += 15;

    // Winner Section
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    const winnerText = zoneBattle.winner === 'tie' ? "Result: It's a Tie!" : 
                       `Winner: ${zoneBattle.winner === 'zone1' ? zoneBattle.zone1.zone_name : zoneBattle.zone2.zone_name}`;
    doc.setTextColor(255, 140, 0); // Orange color
    doc.text(winnerText, pageWidth / 2, yPos, { align: "center" });
    doc.setTextColor(0, 0, 0); // Reset to black
    yPos += 12;

    // Zone 1 Section
    yPos += 5;
    doc.setFillColor(59, 130, 246); // Blue
    doc.rect(10, yPos - 5, pageWidth - 20, 8, "F");
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255); // White text
    doc.text(`Zone 1: ${zoneBattle.zone1.zone_name}`, 15, yPos);
    doc.setTextColor(0, 0, 0); // Reset to black
    yPos += 12;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Region: ${zoneBattle.zone1.zone_region}`, 15, yPos);
    yPos += 8;

    // Zone 1 Interventions
    doc.setFont("helvetica", "bold");
    doc.text("Interventions:", 15, yPos);
    yPos += 6;
    doc.setFont("helvetica", "normal");
    doc.text(`• Trees Planted: ${zone1Trees}`, 20, yPos);
    yPos += 5;
    doc.text(`• Energy Efficiency: ${zone1Efficiency}%`, 20, yPos);
    yPos += 5;
    doc.text(`• Traffic Reduction: ${zone1Traffic}%`, 20, yPos);
    yPos += 8;

    // Zone 1 Results
    doc.setFont("helvetica", "bold");
    doc.text("Environmental Impact:", 15, yPos);
    yPos += 6;
    doc.setFont("helvetica", "normal");
    doc.text(`• Temperature Reduction: ${zoneBattle.zone1Results.tempImprovement.toFixed(1)}%`, 20, yPos);
    yPos += 5;
    doc.text(`• AQI Reduction: ${zoneBattle.zone1Results.aqiImprovement.toFixed(1)}%`, 20, yPos);
    yPos += 5;
    doc.text(`• Energy Reduction: ${zoneBattle.zone1Results.energyImprovement.toFixed(1)}%`, 20, yPos);
    yPos += 5;
    doc.text(`• Carbon Reduction: ${zoneBattle.zone1Results.carbonImprovement.toFixed(1)}%`, 20, yPos);
    yPos += 8;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text(`Total Score: ${zoneBattle.zone1Results.totalScore.toFixed(1)}% improvement`, 15, yPos);
    yPos += 15;

    // Zone 2 Section
    doc.setFillColor(168, 85, 247); // Purple
    doc.rect(10, yPos - 5, pageWidth - 20, 8, "F");
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255); // White text
    doc.text(`Zone 2: ${zoneBattle.zone2.zone_name}`, 15, yPos);
    doc.setTextColor(0, 0, 0); // Reset to black
    yPos += 12;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Region: ${zoneBattle.zone2.zone_region}`, 15, yPos);
    yPos += 8;

    // Zone 2 Interventions
    doc.setFont("helvetica", "bold");
    doc.text("Interventions:", 15, yPos);
    yPos += 6;
    doc.setFont("helvetica", "normal");
    doc.text(`• Trees Planted: ${zone2Trees}`, 20, yPos);
    yPos += 5;
    doc.text(`• Energy Efficiency: ${zone2Efficiency}%`, 20, yPos);
    yPos += 5;
    doc.text(`• Traffic Reduction: ${zone2Traffic}%`, 20, yPos);
    yPos += 8;

    // Zone 2 Results
    doc.setFont("helvetica", "bold");
    doc.text("Environmental Impact:", 15, yPos);
    yPos += 6;
    doc.setFont("helvetica", "normal");
    doc.text(`• Temperature Reduction: ${zoneBattle.zone2Results.tempImprovement.toFixed(1)}%`, 20, yPos);
    yPos += 5;
    doc.text(`• AQI Reduction: ${zoneBattle.zone2Results.aqiImprovement.toFixed(1)}%`, 20, yPos);
    yPos += 5;
    doc.text(`• Energy Reduction: ${zoneBattle.zone2Results.energyImprovement.toFixed(1)}%`, 20, yPos);
    yPos += 5;
    doc.text(`• Carbon Reduction: ${zoneBattle.zone2Results.carbonImprovement.toFixed(1)}%`, 20, yPos);
    yPos += 8;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text(`Total Score: ${zoneBattle.zone2Results.totalScore.toFixed(1)}% improvement`, 15, yPos);
    yPos += 15;

    // Footer
    doc.setFontSize(8);
    doc.setFont("helvetica", "italic");
    doc.text("GreenStream AI - Environmental Monitoring System", pageWidth / 2, yPos + 10, { align: "center" });

    // Save PDF
    doc.save(`zone-battle-${zoneBattle.zone1.zone_name}-vs-${zoneBattle.zone2.zone_name}-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  // Zone Battle Calculation
  const zoneBattle = useMemo(() => {
    const zone1 = filteredZones.find(z => z.id === battleZone1Id);
    const zone2 = filteredZones.find(z => z.id === battleZone2Id);

    if (!zone1 || !zone2) {
      return null;
    }

    const calculateImprovements = (zone: ZoneData, trees: number, efficiency: number, traffic: number) => {
      const treeTempReduction = Math.min(2.5, (trees / 5000) * 1.4);
      const treeAqiReduction = Math.min(18, (trees / 5000) * 10);
      const trafficAqiReduction = Math.min(12, (traffic / 30) * 12);
      const energyReduction = Math.min(0.3, efficiency / 100);
      const carbonReduction = Math.min(0.35, energyReduction * 0.8 + (trees / 20000));

      const newTemp = Math.max(0, zone.temperature - treeTempReduction);
      const newAQI = Math.max(0, Math.round(zone.aqi - treeAqiReduction - trafficAqiReduction));
      const newEnergy = Math.max(0, Math.round(zone.energy_consumption * (1 - energyReduction)));
      const newCarbon = Math.max(0, Math.round(zone.carbon_emission * (1 - carbonReduction)));

      const tempImprovement = ((zone.temperature - newTemp) / zone.temperature) * 100;
      const aqiImprovement = ((zone.aqi - newAQI) / zone.aqi) * 100;
      const energyImprovement = ((zone.energy_consumption - newEnergy) / zone.energy_consumption) * 100;
      const carbonImprovement = ((zone.carbon_emission - newCarbon) / zone.carbon_emission) * 100;

      const totalScore = tempImprovement + aqiImprovement + energyImprovement + carbonImprovement;

      return {
        newTemp,
        newAQI,
        newEnergy,
        newCarbon,
        tempImprovement,
        aqiImprovement,
        energyImprovement,
        carbonImprovement,
        totalScore
      };
    };

    const zone1Results = calculateImprovements(zone1, zone1Trees, zone1Efficiency, zone1Traffic);
    const zone2Results = calculateImprovements(zone2, zone2Trees, zone2Efficiency, zone2Traffic);

    const winner = zone1Results.totalScore > zone2Results.totalScore ? 'zone1' : 
                   zone2Results.totalScore > zone1Results.totalScore ? 'zone2' : 'tie';

    return {
      zone1,
      zone2,
      zone1Results,
      zone2Results,
      winner
    };
  }, [filteredZones, battleZone1Id, battleZone2Id, zone1Trees, zone1Efficiency, zone1Traffic, zone2Trees, zone2Efficiency, zone2Traffic]);

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
                title="Export zone data as JSON"
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
                    : `Showing ${filteredZones.length} zone${filteredZones.length !== 1 ? 's' : ''}`
                  }
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

            {/* City Comparison */}
            <Card className="p-4 bg-gradient-to-br from-slate-900/70 to-blue-950/40 border-blue-500/30">
              <div className="flex items-start gap-3 mb-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <MapPin className="w-5 h-5 text-blue-300" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white text-sm mb-1">City Comparison</h3>
                  <p className="text-xs text-gray-300">Compare live Chennai with other cities.</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400">City A</label>
                  <select
                    value={compareCityA}
                    onChange={(e) => setCompareCityA(e.target.value)}
                    className="w-full bg-gray-900/70 border border-gray-700 text-gray-200 rounded-md px-2 py-1 text-xs"
                  >
                    {Object.keys(cityData).map((city) => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400">City B</label>
                  <select
                    value={compareCityB}
                    onChange={(e) => setCompareCityB(e.target.value)}
                    className="w-full bg-gray-900/70 border border-gray-700 text-gray-200 rounded-md px-2 py-1 text-xs"
                  >
                    {Object.keys(cityData).map((city) => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                {[
                  { label: "Avg Temp", key: "avgTemperature", unit: "°C" },
                  { label: "Avg AQI", key: "avgAQI", unit: "" },
                  { label: "Sustainability", key: "avgSustainability", unit: "/100" },
                  { label: "Energy", key: "totalEnergy", unit: "kWh" },
                  { label: "Carbon", key: "totalCarbon", unit: "kg CO2" },
                  { label: "Green Credits", key: "greenCredits", unit: "" }
                ].map((row) => (
                  <div key={row.key} className="grid grid-cols-3 gap-2 text-xs text-gray-300">
                    <span className="text-gray-400">{row.label}</span>
                    <span className="text-right font-semibold text-blue-200">
                      {comparisonA ? `${(comparisonA as any)[row.key].toLocaleString()}${row.unit}` : "--"}
                    </span>
                    <span className="text-right font-semibold text-blue-200">
                      {comparisonB ? `${(comparisonB as any)[row.key].toLocaleString()}${row.unit}` : "--"}
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            {/* What-If Simulator */}
            <Card className="p-4 bg-gradient-to-br from-slate-950/70 to-emerald-950/40 border-emerald-500/30">
              <div className="flex items-start gap-3 mb-4">
                <div className="p-2 bg-emerald-500/20 rounded-lg">
                  <Leaf className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white text-sm mb-1">What-If Simulator</h3>
                  <p className="text-xs text-gray-300">Model the impact of green interventions.</p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-400">Tree Planting</span>
                    <span className="text-xs font-semibold text-emerald-300">{simTrees.toLocaleString()} trees</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={10000}
                    step={250}
                    value={simTrees}
                    onChange={(e) => setSimTrees(Number(e.target.value))}
                    className="w-full accent-emerald-500"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-400">Energy Efficiency</span>
                    <span className="text-xs font-semibold text-emerald-300">{simEfficiency}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={30}
                    step={1}
                    value={simEfficiency}
                    onChange={(e) => setSimEfficiency(Number(e.target.value))}
                    className="w-full accent-emerald-500"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-400">Traffic Reduction</span>
                    <span className="text-xs font-semibold text-emerald-300">{simTraffic}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={30}
                    step={1}
                    value={simTraffic}
                    onChange={(e) => setSimTraffic(Number(e.target.value))}
                    className="w-full accent-emerald-500"
                  />
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-3">
                  <p className="text-[10px] text-gray-400">Projected Temp</p>
                  <p className="text-lg font-bold text-emerald-300">{simulator.predictedTemp.toFixed(1)}°C</p>
                </div>
                <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-3">
                  <p className="text-[10px] text-gray-400">Projected AQI</p>
                  <p className="text-lg font-bold text-emerald-300">{simulator.predictedAQI}</p>
                </div>
                <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-3">
                  <p className="text-[10px] text-gray-400">Projected Energy</p>
                  <p className="text-lg font-bold text-emerald-300">{simulator.predictedEnergy} kWh</p>
                </div>
                <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-3">
                  <p className="text-[10px] text-gray-400">Projected Carbon</p>
                  <p className="text-lg font-bold text-emerald-300">{simulator.predictedCarbon} kg CO2</p>
                </div>
              </div>

              <div className="mt-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">Impact Score</span>
                  <span className="text-xs font-semibold text-emerald-300">{simulator.impactScore}/100</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-gray-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400"
                    style={{ width: `${simulator.impactScore}%` }}
                  />
                </div>
              </div>
            </Card>

            {/* Green Credits */}
            <Card className="p-4 bg-gradient-to-br from-blue-950/40 to-purple-950/40 border-blue-500/30">
              <div className="flex items-start gap-3 mb-4">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Trophy className="w-5 h-5 text-blue-300" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white text-sm mb-1">Green Credits</h3>
                  <p className="text-xs text-gray-300">Reward sustainable actions across zones.</p>
                </div>
              </div>

              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-xs text-gray-400">Community Balance</p>
                  <p className="text-2xl font-bold text-blue-300">{credits.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">Weekly Streak</p>
                  <p className="text-lg font-semibold text-blue-200">12 days</p>
                </div>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg px-3 py-3">
                <p className="text-xs text-gray-300 mb-2">Update credits in one step</p>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min={1}
                    value={creditDelta}
                    onChange={(e) => setCreditDelta(Number(e.target.value))}
                    className="h-8 bg-gray-900/70 border-gray-700 text-gray-200 text-xs"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 text-[10px] px-3"
                    onClick={handleCreditsUpdate}
                  >
                    Update
                  </Button>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-4 h-4 text-blue-300" />
                  <p className="text-xs text-gray-300">Top Zones</p>
                </div>
                <div className="space-y-2">
                  {leaderboard.map((zone, index) => (
                    <div key={zone.id} className="flex items-center justify-between text-xs text-gray-300">
                      <span className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-200 flex items-center justify-center text-[10px]">
                          {index + 1}
                        </span>
                        {zone.zone_name}
                      </span>
                      <span className="text-blue-200 font-semibold">{zone.sustainability_score}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Zone Battle */}
            <Card className="p-4 bg-gradient-to-br from-red-950/40 to-orange-950/40 border-orange-500/30">
              <div className="flex items-start gap-3 mb-4">
                <div className="p-2 bg-orange-500/20 rounded-lg">
                  <Swords className="w-5 h-5 text-orange-300" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white text-sm mb-1">Zone Battle</h3>
                  <p className="text-xs text-gray-300">Compare interventions between two zones.</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400">Zone 1</label>
                  <select
                    value={battleZone1Id}
                    onChange={(e) => setBattleZone1Id(e.target.value)}
                    className="w-full bg-gray-900/70 border border-gray-700 text-gray-200 rounded-md px-2 py-1 text-xs"
                  >
                    <option value="">Select...</option>
                    {filteredZones.map((zone) => (
                      <option key={zone.id} value={zone.id}>{zone.zone_name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400">Zone 2</label>
                  <select
                    value={battleZone2Id}
                    onChange={(e) => setBattleZone2Id(e.target.value)}
                    className="w-full bg-gray-900/70 border border-gray-700 text-gray-200 rounded-md px-2 py-1 text-xs"
                  >
                    <option value="">Select...</option>
                    {filteredZones.map((zone) => (
                      <option key={zone.id} value={zone.id}>{zone.zone_name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {zoneBattle && (
                <>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    {/* Zone 1 Inputs */}
                    <div className="space-y-2 p-2 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                      <p className="text-[10px] font-semibold text-blue-200">{zoneBattle.zone1.zone_name}</p>
                      <div>
                        <div className="flex justify-between text-[9px] text-gray-400 mb-1">
                          <span>Trees</span>
                          <span>{zone1Trees}</span>
                        </div>
                        <input
                          type="range"
                          min={0}
                          max={5000}
                          step={100}
                          value={zone1Trees}
                          onChange={(e) => setZone1Trees(Number(e.target.value))}
                          className="w-full accent-blue-500"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between text-[9px] text-gray-400 mb-1">
                          <span>Efficiency</span>
                          <span>{zone1Efficiency}%</span>
                        </div>
                        <input
                          type="range"
                          min={0}
                          max={30}
                          step={1}
                          value={zone1Efficiency}
                          onChange={(e) => setZone1Efficiency(Number(e.target.value))}
                          className="w-full accent-blue-500"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between text-[9px] text-gray-400 mb-1">
                          <span>Traffic ↓</span>
                          <span>{zone1Traffic}%</span>
                        </div>
                        <input
                          type="range"
                          min={0}
                          max={30}
                          step={1}
                          value={zone1Traffic}
                          onChange={(e) => setZone1Traffic(Number(e.target.value))}
                          className="w-full accent-blue-500"
                        />
                      </div>
                    </div>

                    {/* Zone 2 Inputs */}
                    <div className="space-y-2 p-2 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                      <p className="text-[10px] font-semibold text-purple-200">{zoneBattle.zone2.zone_name}</p>
                      <div>
                        <div className="flex justify-between text-[9px] text-gray-400 mb-1">
                          <span>Trees</span>
                          <span>{zone2Trees}</span>
                        </div>
                        <input
                          type="range"
                          min={0}
                          max={5000}
                          step={100}
                          value={zone2Trees}
                          onChange={(e) => setZone2Trees(Number(e.target.value))}
                          className="w-full accent-purple-500"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between text-[9px] text-gray-400 mb-1">
                          <span>Efficiency</span>
                          <span>{zone2Efficiency}%</span>
                        </div>
                        <input
                          type="range"
                          min={0}
                          max={30}
                          step={1}
                          value={zone2Efficiency}
                          onChange={(e) => setZone2Efficiency(Number(e.target.value))}
                          className="w-full accent-purple-500"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between text-[9px] text-gray-400 mb-1">
                          <span>Traffic ↓</span>
                          <span>{zone2Traffic}%</span>
                        </div>
                        <input
                          type="range"
                          min={0}
                          max={30}
                          step={1}
                          value={zone2Traffic}
                          onChange={(e) => setZone2Traffic(Number(e.target.value))}
                          className="w-full accent-purple-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Results */}
                  <div className="space-y-2">
                    <div className="grid grid-cols-3 gap-2 text-[10px] font-semibold text-gray-400">
                      <span>Metric</span>
                      <span className="text-center text-blue-200">{zoneBattle.zone1.zone_name}</span>
                      <span className="text-center text-purple-200">{zoneBattle.zone2.zone_name}</span>
                    </div>
                    {[
                      { label: "Temp ↓", key: "tempImprovement", unit: "%" },
                      { label: "AQI ↓", key: "aqiImprovement", unit: "%" },
                      { label: "Energy ↓", key: "energyImprovement", unit: "%" },
                      { label: "Carbon ↓", key: "carbonImprovement", unit: "%" }
                    ].map((row) => (
                      <div key={row.key} className="grid grid-cols-3 gap-2 text-[10px] text-gray-300">
                        <span className="text-gray-400">{row.label}</span>
                        <span className="text-center text-blue-200">
                          {(zoneBattle.zone1Results as any)[row.key].toFixed(1)}{row.unit}
                        </span>
                        <span className="text-center text-purple-200">
                          {(zoneBattle.zone2Results as any)[row.key].toFixed(1)}{row.unit}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Winner */}
                  <div className="mt-4 p-3 rounded-lg bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30">
                    <div className="flex items-center justify-center gap-2">
                      <Trophy className="w-4 h-4 text-yellow-300" />
                      <p className="text-sm font-bold text-yellow-200">
                        {zoneBattle.winner === 'tie' 
                          ? "It's a Tie!" 
                          : `Winner: ${zoneBattle.winner === 'zone1' ? zoneBattle.zone1.zone_name : zoneBattle.zone2.zone_name}`}
                      </p>
                    </div>
                    <p className="text-center text-[10px] text-gray-300 mt-1">
                      Score: {zoneBattle.winner === 'zone1' 
                        ? zoneBattle.zone1Results.totalScore.toFixed(1) 
                        : zoneBattle.zone2Results.totalScore.toFixed(1)}% improvement
                    </p>
                  </div>

                  {/* Export Button */}
                  <Button
                    onClick={handleExportBattle}
                    className="w-full mt-3 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white gap-2"
                    size="sm"
                  >
                    <Download className="w-4 h-4" />
                    Export Battle Results
                  </Button>
                </>
              )}
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
          />
        )}
      </AnimatePresence>

      {/* Environmental DNA Panel */}
      <AlertDNAPanel
        zone={selectedAlertZone}
        isOpen={isDNAPanelOpen}
        onClose={handleCloseDNAPanel}
      />

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
