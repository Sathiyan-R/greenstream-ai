/**
 * Carbon Impact Analysis and Utilization Engine
 * Analyzes carbon emissions and recommends sustainability strategies
 */

export type CarbonLevel = "Low" | "Moderate" | "High" | "Critical";
export type ZoneType = "Residential" | "Commercial" | "Industrial" | "Mixed";

export interface CarbonAnalysis {
  carbonLevel: CarbonLevel;
  carbonEmission: number;
  energyConsumption: number;
  zoneType: ZoneType;
}

export interface CarbonUtilization {
  treesNeeded: number;
  solarKWRequired: number;
  evShiftEquivalent: number;
  concreteInjectionOffset: number;
  syntheticFuelPotential: number;
}

export interface SustainabilityStrategy {
  name: string;
  description: string;
  carbonReduction: number; // percentage
  implementationDifficulty: "Easy" | "Medium" | "Hard";
  estimatedCost: string;
  timeToImplement: string;
  icon: string;
}

export interface CarbonRecommendation {
  zoneId: string;
  zoneName: string;
  carbonAnalysis: CarbonAnalysis;
  carbonUtilization: CarbonUtilization;
  recommendedStrategies: SustainabilityStrategy[];
  projectedImprovements: {
    carbonReduction: number;
    sustainabilityScoreIncrease: number;
    newSustainabilityScore: number;
  };
  aiRecommendationText: string;
}

// 1. CARBON LEVEL CLASSIFICATION
export const analyzeCarbonLevel = (carbonEmission: number): CarbonLevel => {
  if (carbonEmission < 50) return "Low";
  if (carbonEmission < 120) return "Moderate";
  if (carbonEmission < 200) return "High";
  return "Critical";
};

// Get color for carbon level
export const getCarbonLevelColor = (level: CarbonLevel): string => {
  const colors = {
    Low: "#10b981",
    Moderate: "#f59e0b",
    High: "#ef4444",
    Critical: "#b91c1c",
  };
  return colors[level];
};

export const getCarbonLevelBgColor = (level: CarbonLevel): string => {
  const colors = {
    Low: "bg-green-500/10 border-green-500/20",
    Moderate: "bg-yellow-500/10 border-yellow-500/20",
    High: "bg-red-500/10 border-red-500/20",
    Critical: "bg-red-900/20 border-red-600/30",
  };
  return colors[level];
};

// 2. INFER ZONE TYPE (can be improved with actual zone metadata)
export const inferZoneType = (zoneName: string): ZoneType => {
  const nameUpper = zoneName.toUpperCase();
  
  if (
    nameUpper.includes("INDUSTRIAL") ||
    nameUpper.includes("FACTORY") ||
    nameUpper.includes("MILL")
  ) {
    return "Industrial";
  }
  
  if (
    nameUpper.includes("COMMERCIAL") ||
    nameUpper.includes("MARKET") ||
    nameUpper.includes("BUSINESS")
  ) {
    return "Commercial";
  }
  
  if (
    nameUpper.includes("RESIDENTIAL") ||
    nameUpper.includes("COLONY") ||
    nameUpper.includes("SUBURB")
  ) {
    return "Residential";
  }
  
  return "Mixed";
};

// 3. CARBON UTILIZATION CALCULATION
export const calculateCarbonUtilization = (
  carbonEmission: number,
  energyConsumption: number
): CarbonUtilization => {
  return {
    treesNeeded: Math.ceil(carbonEmission / 21),
    solarKWRequired: Math.ceil(carbonEmission / 1400),
    evShiftEquivalent: Math.ceil(carbonEmission / 120),
    concreteInjectionOffset: Math.round((carbonEmission * 0.3) * 10) / 10,
    syntheticFuelPotential: Math.round((carbonEmission * 0.4) * 10) / 10,
  };
};

// 4. GENERATE ZONE-SPECIFIC RECOMMENDATIONS
const generateResidentialStrategies = (
  utilization: CarbonUtilization,
  carbonEmission: number
): SustainabilityStrategy[] => {
  return [
    {
      name: "Rooftop Solar Installation",
      description: `Install ${utilization.solarKWRequired} kW rooftop solar system to offset 30% of carbon emissions through renewable energy generation.`,
      carbonReduction: 30,
      implementationDifficulty: "Medium",
      estimatedCost: "₹5-8 Lakhs per kW",
      timeToImplement: "2-3 months",
      icon: "☀️",
    },
    {
      name: "Community Tree Plantation",
      description: `Plant ${utilization.treesNeeded} trees in community areas. Each tree absorbs ~21 kg CO₂ annually over its lifetime.`,
      carbonReduction: 15,
      implementationDifficulty: "Easy",
      estimatedCost: "₹500-1000 per tree",
      timeToImplement: "1-2 weeks",
      icon: "🌱",
    },
    {
      name: "Smart AC Automation",
      description: "Implement smart thermostats and IoT-based AC controls to reduce energy consumption by 15-25%.",
      carbonReduction: 20,
      implementationDifficulty: "Easy",
      estimatedCost: "₹50,000-100,000",
      timeToImplement: "1 week",
      icon: "💨",
    },
    {
      name: "EV Adoption Program",
      description: `Incentivize adoption of ${utilization.evShiftEquivalent} electric vehicles to replace fossil fuel-based transport.`,
      carbonReduction: 25,
      implementationDifficulty: "Hard",
      estimatedCost: "Subsidy programs",
      timeToImplement: "6-12 months",
      icon: "⚡",
    },
  ];
};

const generateCommercialStrategies = (
  utilization: CarbonUtilization,
  carbonEmission: number
): SustainabilityStrategy[] => {
  return [
    {
      name: "Energy Efficiency Retrofit",
      description: "Upgrade to LED lighting, improve insulation, and install energy-efficient HVAC systems.",
      carbonReduction: 35,
      implementationDifficulty: "Medium",
      estimatedCost: "₹10-20 Lakhs",
      timeToImplement: "2-4 weeks",
      icon: "💡",
    },
    {
      name: "Smart Grid Integration",
      description: "Implement smart metering and demand response systems to optimize energy usage patterns.",
      carbonReduction: 25,
      implementationDifficulty: "Hard",
      estimatedCost: "₹20-30 Lakhs",
      timeToImplement: "3-6 months",
      icon: "🔌",
    },
    {
      name: "Renewable Energy Power Purchase",
      description: `Procure ${utilization.solarKWRequired} kW from renewable energy providers via power purchase agreements.`,
      carbonReduction: 40,
      implementationDifficulty: "Medium",
      estimatedCost: "₹3-5 per unit",
      timeToImplement: "1-3 months",
      icon: "🌍",
    },
    {
      name: "Waste Heat Recovery",
      description: "Install heat recovery systems to reuse waste heat from operations, reducing energy needs.",
      carbonReduction: 20,
      implementationDifficulty: "Hard",
      estimatedCost: "₹15-25 Lakhs",
      timeToImplement: "2-3 months",
      icon: "♻️",
    },
  ];
};

const generateIndustrialStrategies = (
  utilization: CarbonUtilization,
  carbonEmission: number
): SustainabilityStrategy[] => {
  return [
    {
      name: "CO₂ Concrete Injection",
      description: `Utilize ${utilization.concreteInjectionOffset.toFixed(1)} kg CO₂ in concrete replacement, reducing carbon while strengthening materials.`,
      carbonReduction: 30,
      implementationDifficulty: "Medium",
      estimatedCost: "₹500-800 per ton",
      timeToImplement: "1-2 months",
      icon: "🏗️",
    },
    {
      name: "Carbon-to-Methanol Conversion",
      description: `Convert ${utilization.syntheticFuelPotential.toFixed(1)} kg CO₂ into methanol for industrial use and fuel applications.`,
      carbonReduction: 40,
      implementationDifficulty: "Hard",
      estimatedCost: "₹50-100 Lakhs",
      timeToImplement: "6-12 months",
      icon: "🧪",
    },
    {
      name: "Industrial Carbon Capture",
      description: "Install point-source carbon capture technology to capture emissions before they reach atmosphere.",
      carbonReduction: 45,
      implementationDifficulty: "Hard",
      estimatedCost: "₹2-5 Crores",
      timeToImplement: "4-8 months",
      icon: "🌫️",
    },
    {
      name: "Process Optimization",
      description: "Implement advanced automation and optimization in manufacturing processes to reduce energy intensity.",
      carbonReduction: 25,
      implementationDifficulty: "Medium",
      estimatedCost: "₹30-50 Lakhs",
      timeToImplement: "3-6 months",
      icon: "⚙️",
    },
  ];
};

export const getZoneStrategies = (
  zoneType: ZoneType,
  utilization: CarbonUtilization,
  carbonEmission: number
): SustainabilityStrategy[] => {
  switch (zoneType) {
    case "Residential":
      return generateResidentialStrategies(utilization, carbonEmission);
    case "Commercial":
      return generateCommercialStrategies(utilization, carbonEmission);
    case "Industrial":
      return generateIndustrialStrategies(utilization, carbonEmission);
    default:
      return [
        ...generateResidentialStrategies(utilization, carbonEmission).slice(0, 2),
        ...generateCommercialStrategies(utilization, carbonEmission).slice(0, 1),
      ];
  }
};

// 5. SUSTAINABILITY SCORE IMPROVEMENT CALCULATION
export const calculateSustainabilityImprovement = (
  currentScore: number,
  selectedStrategies: SustainabilityStrategy[]
): { scoreIncrease: number; newScore: number } => {
  const totalCarbonReduction = selectedStrategies.reduce(
    (sum, strategy) => sum + strategy.carbonReduction,
    0
  );
  
  // Each 1% carbon reduction ≈ 0.15 sustainability score increase
  const scoreIncrease = Math.min(totalCarbonReduction * 0.15, 40);
  const newScore = Math.min(currentScore + scoreIncrease, 100);

  return {
    scoreIncrease: Math.round(scoreIncrease * 10) / 10,
    newScore: Math.round(newScore * 10) / 10,
  };
};

// 6. AI RECOMMENDATION TEXT GENERATION
export const generateAIRecommendation = (
  zoneName: string,
  carbonEmission: number,
  utilization: CarbonUtilization,
  strategies: SustainabilityStrategy[],
  improvement: { scoreIncrease: number; newScore: number }
): string => {
  const topStrategies = strategies.slice(0, 3);
  const carbonLevel = analyzeCarbonLevel(carbonEmission);
  
  let recommendation = `🌍 **${zoneName} - Carbon Intelligence Report**\n\n`;
  recommendation += `**Current Status:** This zone emits ${carbonEmission.toFixed(1)} kg CO₂ (${carbonLevel} level)\n\n`;
  
  recommendation += `**Carbon Offset Equivalents:**\n`;
  recommendation += `• 🌱 Plant ${utilization.treesNeeded} trees (absorb long-term carbon)\n`;
  recommendation += `• ☀️ Install ${utilization.solarKWRequired} kW solar (offset 30% emissions)\n`;
  recommendation += `• ⚡ Switch ${utilization.evShiftEquivalent} vehicles to EV (reduce transport carbon)\n\n`;
  
  recommendation += `**Recommended Actions:**\n`;
  topStrategies.forEach((strategy, idx) => {
    recommendation += `${idx + 1}. ${strategy.icon} ${strategy.name}\n   → ${strategy.carbonReduction}% carbon reduction\n`;
  });
  
  recommendation += `\n**Projected Impact:**\n`;
  recommendation += `• Sustainability Score: ${improvement.scoreIncrease.toFixed(1)} point improvement\n`;
  recommendation += `• New Score: ${improvement.newScore.toFixed(1)}/100\n`;
  recommendation += `• Estimated Timeline: 2-6 months for full implementation\n\n`;
  recommendation += `💡 **Tip:** Start with easy wins (tree plantation, smart AC) then move to complex solutions.`;
  
  return recommendation;
};

// 7. GENERATE COMPLETE CARBON RECOMMENDATION
export const generateCarbonRecommendation = (
  zoneId: string,
  zoneName: string,
  carbonEmission: number,
  energyConsumption: number,
  currentSustainabilityScore: number
): CarbonRecommendation => {
  const carbonLevel = analyzeCarbonLevel(carbonEmission);
  const zoneType = inferZoneType(zoneName);
  const utilization = calculateCarbonUtilization(carbonEmission, energyConsumption);
  const strategies = getZoneStrategies(zoneType, utilization, carbonEmission);
  const improvement = calculateSustainabilityImprovement(
    currentSustainabilityScore,
    strategies
  );

  return {
    zoneId,
    zoneName,
    carbonAnalysis: {
      carbonLevel,
      carbonEmission,
      energyConsumption,
      zoneType,
    },
    carbonUtilization: utilization,
    recommendedStrategies: strategies,
    projectedImprovements: {
      carbonReduction: strategies.reduce((sum, s) => sum + s.carbonReduction, 0),
      sustainabilityScoreIncrease: improvement.scoreIncrease,
      newSustainabilityScore: improvement.newScore,
    },
    aiRecommendationText: generateAIRecommendation(
      zoneName,
      carbonEmission,
      utilization,
      strategies,
      improvement
    ),
  };
};
