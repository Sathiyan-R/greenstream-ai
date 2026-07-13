import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { jsPDF } from "jspdf";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Swords, Trophy, Sparkles, AlertCircle, Download } from "lucide-react";
import { ZoneData, MapMode } from "@/types/map";
import { ZoneBattleImpactChart } from "@/components/map/ZoneBattleImpactChart";

interface ZoneBattleProps {
  zones: ZoneData[];
  mode: MapMode;
}

interface ZoneResult {
  tempImprovement: number;
  aqiImprovement: number;
  energyImprovement: number;
  carbonImprovement: number;
  totalScore: number;
}

interface BattleResult {
  zone1: ZoneData;
  zone2: ZoneData;
  zone1Results: ZoneResult;
  zone2Results: ZoneResult;
  winner: 'zone1' | 'zone2' | 'tie';
}

const calculateImprovements = (
  zone: ZoneData,
  trees: number,
  efficiency: number,
  traffic: number
) => {
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
    totalScore,
  };
};

export const ZoneBattle = ({ zones, mode }: ZoneBattleProps) => {
  const { toast } = useToast();
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});

  const [battleZone1Id, setBattleZone1Id] = useLocalStorage('greenstream_battle_zone1', "");
  const [battleZone2Id, setBattleZone2Id] = useLocalStorage('greenstream_battle_zone2', "");
  const [zone1Trees, setZone1Trees] = useLocalStorage('greenstream_z1_trees', 1000);
  const [zone1Efficiency, setZone1Efficiency] = useLocalStorage('greenstream_z1_efficiency', 10);
  const [zone1Traffic, setZone1Traffic] = useLocalStorage('greenstream_z1_traffic', 5);
  const [zone2Trees, setZone2Trees] = useLocalStorage('greenstream_z2_trees', 1000);
  const [zone2Efficiency, setZone2Efficiency] = useLocalStorage('greenstream_z2_efficiency', 10);
  const [zone2Traffic, setZone2Traffic] = useLocalStorage('greenstream_z2_traffic', 5);

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

  const zoneBattle = useMemo(() => {
    const zone1 = zones.find(z => z.id === battleZone1Id);
    const zone2 = zones.find(z => z.id === battleZone2Id);

    if (!zone1 || !zone2) {
      return null;
    }

    const zone1Results = calculateImprovements(zone1, zone1Trees, zone1Efficiency, zone1Traffic);
    const zone2Results = calculateImprovements(zone2, zone2Trees, zone2Efficiency, zone2Traffic);

    const winner = zone1Results.totalScore > zone2Results.totalScore ? 'zone1' :
                   zone2Results.totalScore > zone1Results.totalScore ? 'zone2' : 'tie';

    return {
      zone1,
      zone2,
      zone1Results,
      zone2Results,
      winner,
    } as BattleResult;
  }, [zones, battleZone1Id, battleZone2Id, zone1Trees, zone1Efficiency, zone1Traffic, zone2Trees, zone2Efficiency, zone2Traffic]);

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

    interface ZoneResult {
    newTemp: number;
    newAQI: number;
    newEnergy: number;
    newCarbon: number;
    tempImprovement: number;
    aqiImprovement: number;
    energyImprovement: number;
    carbonImprovement: number;
    totalScore: number;
  }

    const writeZoneSection = (zone: ZoneData, results: ZoneResult, color: string, label: string) => {
      doc.setFillColor(...color.split(",").map(Number));
      doc.rect(10, yPos - 5, pageWidth - 20, 8, "F");
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(255, 255, 255);
      doc.text(`${label}: ${zone.zone_name}`, 15, yPos);
      doc.setTextColor(0, 0, 0);
      yPos += 12;

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(`Region: ${zone.zone_region}`, 15, yPos);
      yPos += 8;

      doc.setFont("helvetica", "bold");
      doc.text("Interventions:", 15, yPos);
      yPos += 6;
      doc.setFont("helvetica", "normal");
      doc.text(`• Trees Planted: ${label === "Zone 1" ? zone1Trees : zone2Trees}`, 20, yPos);
      yPos += 5;
      doc.text(`• Energy Efficiency: ${label === "Zone 1" ? zone1Efficiency : zone2Efficiency}%`, 20, yPos);
      yPos += 5;
      doc.text(`• Traffic Reduction: ${label === "Zone 1" ? zone1Traffic : zone2Traffic}%`, 20, yPos);
      yPos += 8;

      doc.setFont("helvetica", "bold");
      doc.text("Environmental Impact:", 15, yPos);
      yPos += 6;
      doc.setFont("helvetica", "normal");
      doc.text(`• Temperature Reduction: ${results.tempImprovement.toFixed(1)}%`, 20, yPos);
      yPos += 5;
      doc.text(`• AQI Reduction: ${results.aqiImprovement.toFixed(1)}%`, 20, yPos);
      yPos += 5;
      doc.text(`• Energy Reduction: ${results.energyImprovement.toFixed(1)}%`, 20, yPos);
      yPos += 5;
      doc.text(`• Carbon Reduction: ${results.carbonImprovement.toFixed(1)}%`, 20, yPos);
      yPos += 8;

      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text(`Total Score: ${results.totalScore.toFixed(1)}% improvement`, 15, yPos);
      yPos += 15;
    };

    writeZoneSection(zoneBattle.zone1, zoneBattle.zone1Results, "59,130,246", "Zone 1");
    writeZoneSection(zoneBattle.zone2, zoneBattle.zone2Results, "168,85,247", "Zone 2");

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

  return (
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
            {zones.map((zone) => (
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
            {zones.map((zone) => (
              <option key={zone.id} value={zone.id}>{zone.zone_name}</option>
            ))}
          </select>
        </div>
      </div>

      {zoneBattle && (
        <>
          <div className="grid grid-cols-2 gap-3 mb-3">
            {/* Zone 1 Inputs */}
            <div className="space-y-2 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <p className="text-xs font-semibold text-blue-200 mb-2">{zoneBattle.zone1.zone_name}</p>

              <div>
                <label className="text-[10px] text-gray-400 mb-1 block">Trees</label>
                <Input
                  type="number"
                  min={0}
                  max={5000}
                  value={zone1Trees === 0 ? '' : zone1Trees}
                  onChange={(e) => handleZoneInputChange('zone1Trees', Number(e.target.value) || 0, 5000, setZone1Trees)}
                  placeholder="0"
                  className={`w-full bg-gray-900/70 ${validationErrors['zone1Trees'] ? 'border-red-500/50' : 'border-blue-500/30'} text-blue-100 h-7 text-xs placeholder:text-gray-500`}
                />
                {validationErrors['zone1Trees'] && (
                  <p className="text-[9px] text-red-400 flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3" />
                    {validationErrors['zone1Trees']}
                  </p>
                )}
              </div>

              <div>
                <label className="text-[10px] text-gray-400 mb-1 block">Efficiency</label>
                <div className="flex items-center gap-1">
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    value={zone1Efficiency === 0 ? '' : zone1Efficiency}
                    onChange={(e) => handleZoneInputChange('zone1Efficiency', Number(e.target.value) || 0, 100, setZone1Efficiency)}
                    placeholder="0"
                    className={`w-full bg-gray-900/70 ${validationErrors['zone1Efficiency'] ? 'border-red-500/50' : 'border-blue-500/30'} text-blue-100 h-7 text-xs placeholder:text-gray-500`}
                  />
                  <span className="text-[10px] text-gray-400">%</span>
                </div>
                {validationErrors['zone1Efficiency'] && (
                  <p className="text-[9px] text-red-400 flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3" />
                    {validationErrors['zone1Efficiency']}
                  </p>
                )}
              </div>

              <div>
                <label className="text-[10px] text-gray-400 mb-1 block">Traffic ↓</label>
                <div className="flex items-center gap-1">
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    value={zone1Traffic === 0 ? '' : zone1Traffic}
                    onChange={(e) => handleZoneInputChange('zone1Traffic', Number(e.target.value) || 0, 100, setZone1Traffic)}
                    placeholder="0"
                    className={`w-full bg-gray-900/70 ${validationErrors['zone1Traffic'] ? 'border-red-500/50' : 'border-blue-500/30'} text-blue-100 h-7 text-xs placeholder:text-gray-500`}
                  />
                  <span className="text-[10px] text-gray-400">%</span>
                </div>
                {validationErrors['zone1Traffic'] && (
                  <p className="text-[9px] text-red-400 flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3" />
                    {validationErrors['zone1Traffic']}
                  </p>
                )}
              </div>
            </div>

            {/* Zone 2 Inputs */}
            <div className="space-y-2 p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
              <p className="text-xs font-semibold text-purple-200 mb-2">{zoneBattle.zone2.zone_name}</p>

              <div>
                <label className="text-[10px] text-gray-400 mb-1 block">Trees</label>
                <Input
                  type="number"
                  min={0}
                  max={5000}
                  value={zone2Trees === 0 ? '' : zone2Trees}
                  onChange={(e) => handleZoneInputChange('zone2Trees', Number(e.target.value) || 0, 5000, setZone2Trees)}
                  placeholder="0"
                  className={`w-full bg-gray-900/70 ${validationErrors['zone2Trees'] ? 'border-red-500/50' : 'border-purple-500/30'} text-purple-100 h-7 text-xs placeholder:text-gray-500`}
                />
                {validationErrors['zone2Trees'] && (
                  <p className="text-[9px] text-red-400 flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3" />
                    {validationErrors['zone2Trees']}
                  </p>
                )}
              </div>

              <div>
                <label className="text-[10px] text-gray-400 mb-1 block">Efficiency</label>
                <div className="flex items-center gap-1">
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    value={zone2Efficiency === 0 ? '' : zone2Efficiency}
                    onChange={(e) => handleZoneInputChange('zone2Efficiency', Number(e.target.value) || 0, 100, setZone2Efficiency)}
                    placeholder="0"
                    className={`w-full bg-gray-900/70 ${validationErrors['zone2Efficiency'] ? 'border-red-500/50' : 'border-purple-500/30'} text-purple-100 h-7 text-xs placeholder:text-gray-500`}
                  />
                  <span className="text-[10px] text-gray-400">%</span>
                </div>
                {validationErrors['zone2Efficiency'] && (
                  <p className="text-[9px] text-red-400 flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3" />
                    {validationErrors['zone2Efficiency']}
                  </p>
                )}
              </div>

              <div>
                <label className="text-[10px] text-gray-400 mb-1 block">Traffic ↓</label>
                <div className="flex items-center gap-1">
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    value={zone2Traffic === 0 ? '' : zone2Traffic}
                    onChange={(e) => handleZoneInputChange('zone2Traffic', Number(e.target.value) || 0, 100, setZone2Traffic)}
                    placeholder="0"
                    className={`w-full bg-gray-900/70 ${validationErrors['zone2Traffic'] ? 'border-red-500/50' : 'border-purple-500/30'} text-purple-100 h-7 text-xs placeholder:text-gray-500`}
                  />
                  <span className="text-[10px] text-gray-400">%</span>
                </div>
                {validationErrors['zone2Traffic'] && (
                  <p className="text-[9px] text-red-400 flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3" />
                    {validationErrors['zone2Traffic']}
                  </p>
                )}
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
                  {zoneBattle.zone1Results[row.key].toFixed(1)}{row.unit}
                </span>
                <span className="text-center text-purple-200">
                  {zoneBattle.zone2Results[row.key].toFixed(1)}{row.unit}
                </span>
              </div>
            ))}
          </div>

          {/* Winner - Animated Display */}
          <AnimatePresence>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
              className="mt-4 p-4 rounded-lg bg-gradient-to-r from-yellow-500/30 to-orange-500/30 border-2 border-yellow-400/50 overflow-hidden relative"
            >
              {/* Animated background sparkles */}
              <div className="absolute inset-0 opacity-50">
                <motion.div
                  animate={{ opacity: [0.3, 0.8, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute top-2 right-4"
                >
                  <Sparkles className="w-4 h-4 text-yellow-300" />
                </motion.div>
                <motion.div
                  animate={{ opacity: [0.3, 0.8, 0.3] }}
                  transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
                  className="absolute bottom-2 left-4"
                >
                  <Sparkles className="w-4 h-4 text-yellow-300" />
                </motion.div>
              </div>

              {/* Winner Content */}
              <div className="relative z-10">
                <motion.div
                  animate={{ y: [-2, 2, -2] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="flex items-center justify-center gap-2 mb-2"
                >
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Trophy className="w-5 h-5 text-yellow-300" />
                  </motion.div>
                  <p className="text-sm font-bold text-yellow-100">
                    {zoneBattle.winner === 'tie'
                      ? "🎯 It's a Perfect Tie!"
                      : `🏆 ${zoneBattle.winner === 'zone1' ? zoneBattle.zone1.zone_name : zoneBattle.zone2.zone_name} Wins!`}
                  </p>
                  <motion.div
                    animate={{ rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Trophy className="w-5 h-5 text-yellow-300" />
                  </motion.div>
                </motion.div>
                <motion.p
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="text-center text-[11px] text-yellow-100 font-semibold"
                >
                  Score: {Math.max(zoneBattle.zone1Results.totalScore, zoneBattle.zone2Results.totalScore).toFixed(1)}% improvement
                </motion.p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Real-Time Impact Visualization */}
          <div className="mt-4">
            <ZoneBattleImpactChart
              zone1Name={zoneBattle.zone1.zone_name}
              zone1BaseTemp={zoneBattle.zone1.temperature}
              zone1BaseAQI={zoneBattle.zone1.aqi}
              zone1BaseEnergy={zoneBattle.zone1.energy_consumption}
              zone1BaseCarbon={zoneBattle.zone1.carbon_emission}
              zone1Trees={zone1Trees}
              zone1Efficiency={zone1Efficiency}
              zone1Traffic={zone1Traffic}

              zone2Name={zoneBattle.zone2.zone_name}
              zone2BaseTemp={zoneBattle.zone2.temperature}
              zone2BaseAQI={zoneBattle.zone2.aqi}
              zone2BaseEnergy={zoneBattle.zone2.energy_consumption}
              zone2BaseCarbon={zoneBattle.zone2.carbon_emission}
              zone2Trees={zone2Trees}
              zone2Efficiency={zone2Efficiency}
              zone2Traffic={zone2Traffic}
            />
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
  );
};