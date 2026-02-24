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
import { ZoneBattleImpactChart } from "@/components/map/ZoneBattleImpactChart";
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
  Trophy,
  Users,
  Swords,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  AlertCircle,
  CheckCircle
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
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});
  const [simTrees, setSimTrees] = useLocalStorage('greenstream_sim_trees', 2500);
  const [simEfficiency, setSimEfficiency] = useLocalStorage('greenstream_sim_efficiency', 12);
  const [simTraffic, setSimTraffic] = useLocalStorage('greenstream_sim_traffic', 8);
  const [credits, setCredits] = useLocalStorage('greenstream_credits', 1280);
  const [creditDelta, setCreditDelta] = useState(0);
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

  const validateBattleInput = (fieldName: string, value: number, max: number): string => {
    if (value < 0) return "Value cannot be negative";
    if (value > max) return `Value cannot exceed ${max}`;
    return "";
  };

  const handleZoneInputChange = (fieldName: string, value: number, max: number, setter: (val: number) => void) => {
    setter(value);
    const error = validateBattleInput(fieldName, value, max);
    setValidationErrors(prev => ({
      ...prev,
      [fieldName]: error
    }));
  };

  const filteredZones = useMemo(() => {
    if (!searchQuery.trim()) return zones;
    
    const query = searchQuery.toLowerCase();
    return zones.filter(zone => 
      zone.zone_name.toLowerCase().includes(query) ||
      zone.zone_region.toLowerCase().includes(query)
    );
  }, [zones, searchQuery]);

  const handleExportData = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let yPos = 20;

    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("Chennai Environmental Status Report", pageWidth / 2, yPos, { align: "center" });
    yPos += 10;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth / 2, yPos, { align: "center" });
    yPos += 15;

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

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Zone Details", 15, yPos);
    yPos += 8;

    filteredZones.forEach((zone, index) => {
      
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

    doc.save(`chennai-environmental-report-${new Date().toISOString().split('T')[0]}.pdf`);

    toast({
      title: "Export Successful! ✅",
      description: "Your environmental report has been downloaded.",
      duration: 3000,
    });
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

  const handleExportBattle = () => {
    if (!zoneBattle) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    let yPos = 20;

    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("Zone Battle Comparison Report", pageWidth / 2, yPos, { align: "center" });
    yPos += 15;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth / 2, yPos, { align: "center" });
    yPos += 15;

    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    const winnerText = zoneBattle.winner === 'tie' ? "Result: It's a Tie!" : 
                       `Winner: ${zoneBattle.winner === 'zone1' ? zoneBattle.zone1.zone_name : zoneBattle.zone2.zone_name}`;
    doc.setTextColor(255, 140, 0); 
    doc.text(winnerText, pageWidth / 2, yPos, { align: "center" });
    doc.setTextColor(0, 0, 0); 
    yPos += 12;

    yPos += 5;
    doc.setFillColor(59, 130, 246); 
    doc.rect(10, yPos - 5, pageWidth - 20, 8, "F");
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255); 
    doc.text(`Zone 1: ${zoneBattle.zone1.zone_name}`, 15, yPos);
    doc.setTextColor(0, 0, 0); 
    yPos += 12;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Region: ${zoneBattle.zone1.zone_region}`, 15, yPos);
    yPos += 8;

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

    doc.setFillColor(168, 85, 247); 
    doc.rect(10, yPos - 5, pageWidth - 20, 8, "F");
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255); 
    doc.text(`Zone 2: ${zoneBattle.zone2.zone_name}`, 15, yPos);
    doc.setTextColor(0, 0, 0); 
    yPos += 12;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Region: ${zoneBattle.zone2.zone_region}`, 15, yPos);
    yPos += 8;

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

    doc.setFontSize(8);
    doc.setFont("helvetica", "italic");
    doc.text("GreenStream AI - Environmental Monitoring System", pageWidth / 2, yPos + 10, { align: "center" });

    doc.save(`zone-battle-${zoneBattle.zone1.zone_name}-vs-${zoneBattle.zone2.zone_name}-${new Date().toISOString().split('T')[0]}.pdf`);

    toast({
      title: "Battle Report Exported! ✅",
      description: `${zoneBattle.zone1.zone_name} vs ${zoneBattle.zone2.zone_name} comparison downloaded.`,
      duration: 3000,
    });
  };

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
      {