/**
 * Carbon Utilization Simulation
 * Simulates sustainability improvements based on strategy selection
 */

import { SustainabilityStrategy } from "./carbonEngine";

export interface SimulationScenario {
  baseCarbon: number;
  baseSustainabilityScore: number;
  selectedStrategies: string[]; // strategy names
  simulatedCarbon: number;
  simulatedSustainabilityScore: number;
  totalCarbonReduction: number;
  totalCarbonReductionPercent: number;
  timelineMonths: number;
  estimatedCostRupees: number;
}

// Parse cost string to number
const parseCost = (costStr: string): number => {
  if (!costStr) return 0;
  
  const num = parseFloat(costStr.replace(/[^\d.-]/g, ""));
  
  if (costStr.includes("Crore")) return num * 10000000;
  if (costStr.includes("Lakh")) return num * 100000;
  if (costStr.includes("K") || costStr.includes("k")) return num * 1000;
  if (costStr.includes("per")) return num; // per unit
  
  return num;
};

// Estimate timeline from strategy
const estimateTimeline = (strategies: SustainabilityStrategy[]): number => {
  const timelineMap: { [key: string]: number } = {
    "1 week": 0.25,
    "2 weeks": 0.5,
    "1-2 weeks": 0.5,
    "1-2 months": 1.5,
    "2-3 months": 2.5,
    "2-4 weeks": 0.75,
    "3-6 months": 4.5,
    "4-8 months": 6,
    "6-12 months": 9,
  };

  const timelines = strategies.map((s) => {
    for (const [key, value] of Object.entries(timelineMap)) {
      if (s.timeToImplement.includes(key.split("-")[0])) {
        return value;
      }
    }
    return 3; // default
  });

  return Math.max(...timelines, 2);
};

// Calculate total cost estimate
const estimateTotalCost = (strategies: SustainabilityStrategy[]): number => {
  return strategies.reduce((sum, strategy) => {
    const costStr = strategy.estimatedCost;
    
    // Special handling for per-unit costs
    if (costStr.includes("per")) {
      // Generic estimate
      return sum + 500000; // ₹5 lakhs average
    }
    
    return sum + parseCost(costStr);
  }, 0);
};

/**
 * Simulate sustainability improvements
 */
export const simulateScenario = (
  baseCarbon: number,
  baseSustainabilityScore: number,
  selectedStrategies: SustainabilityStrategy[]
): SimulationScenario => {
  // Calculate total carbon reduction percentage
  const totalCarbonReductionPercent = Math.min(
    selectedStrategies.reduce((sum, s) => sum + s.carbonReduction, 0),
    95 // Cap at 95% reduction
  );

  // Simulate reduced carbon
  const simulatedCarbon = Math.max(
    baseCarbon * (1 - totalCarbonReductionPercent / 100),
    5 // Minimum realistic carbon
  );

  // Calculate sustainability score improvement
  // Each 1% carbon reduction = 0.15 sustainability score increase
  const scoreIncrease = Math.min(totalCarbonReductionPercent * 0.15, 40);
  const simulatedSustainabilityScore = Math.min(
    baseSustainabilityScore + scoreIncrease,
    100
  );

  // Calculate timeline and cost
  const timelineMonths = estimateTimeline(selectedStrategies);
  const estimatedCostRupees = estimateTotalCost(selectedStrategies);

  return {
    baseCarbon: Math.round(baseCarbon * 10) / 10,
    baseSustainabilityScore: Math.round(baseSustainabilityScore * 10) / 10,
    selectedStrategies: selectedStrategies.map((s) => s.name),
    simulatedCarbon: Math.round(simulatedCarbon * 10) / 10,
    simulatedSustainabilityScore: Math.round(simulatedSustainabilityScore * 10) / 10,
    totalCarbonReduction: Math.round((baseCarbon - simulatedCarbon) * 10) / 10,
    totalCarbonReductionPercent: totalCarbonReductionPercent,
    timelineMonths,
    estimatedCostRupees,
  };
};

/**
 * Generate chart data for before/after comparison
 */
export interface ComparisonChartData {
  metric: string;
  before: number;
  after: number;
  reduction: number;
}

export const generateComparisonChartData = (
  scenario: SimulationScenario
): ComparisonChartData[] => {
  return [
    {
      metric: "Carbon Emissions",
      before: scenario.baseCarbon,
      after: scenario.simulatedCarbon,
      reduction: scenario.totalCarbonReduction,
    },
    {
      metric: "Sustainability Score",
      before: scenario.baseSustainabilityScore,
      after: scenario.simulatedSustainabilityScore,
      reduction: scenario.simulatedSustainabilityScore - scenario.baseSustainabilityScore,
    },
  ];
};

/**
 * Generate timeline breakdown for strategy implementation
 */
export interface ImplementationPhase {
  phase: number;
  month: string;
  strategies: string[];
  description: string;
}

export const generateImplementationPhases = (
  selectedStrategies: SustainabilityStrategy[]
): ImplementationPhase[] => {
  // Sort by implementation difficulty (Easy first)
  const difficultyOrder = { Easy: 0, Medium: 1, Hard: 2 };
  const sorted = [...selectedStrategies].sort(
    (a, b) => difficultyOrder[a.implementationDifficulty] - difficultyOrder[b.implementationDifficulty]
  );

  const phases: ImplementationPhase[] = [];
  
  sorted.forEach((strategy, idx) => {
    const phaseNum = Math.floor(idx / 2) + 1;
    
    if (!phases[phaseNum - 1]) {
      phases[phaseNum - 1] = {
        phase: phaseNum,
        month: `Month ${phaseNum}-${phaseNum + 1}`,
        strategies: [],
        description: "",
      };
    }
    
    phases[phaseNum - 1].strategies.push(strategy.name);
  });

  // Add descriptions
  phases.forEach((phase) => {
    if (phase.phase === 1) {
      phase.description = "Begin with easy-to-implement solutions";
    } else if (phase.phase === 2) {
      phase.description = "Execute medium-complexity projects";
    } else {
      phase.description = "Roll out advanced/complex solutions";
    }
  });

  return phases;
};

/**
 * Calculate ROI (Return on Investment) for strategies
 */
export interface ROIAnalysis {
  strategyName: string;
  investmentRupees: number;
  annualCarbonSavings: number;
  paybackPeriodYears: number;
  roi10YearPercent: number;
}

export const calculateROI = (
  strategies: SustainabilityStrategy[],
  baseCarbon: number
): ROIAnalysis[] => {
  return strategies.map((strategy) => {
    const investmentRupees = parseCost(strategy.estimatedCost);
    const annualCarbonSavings =
      (baseCarbon * strategy.carbonReduction) / 100 / 12; // monthly to annual
    
    // Assume ₹1000 per ton CO2 saved (market rate)
    const annualBenefit = annualCarbonSavings * 1000;
    const paybackPeriodYears = investmentRupees / (annualBenefit || 1);
    
    // 10-year ROI calculation
    const totalBenefit10Year = annualBenefit * 10;
    const roi10YearPercent =
      ((totalBenefit10Year - investmentRupees) / investmentRupees) * 100;

    return {
      strategyName: strategy.name,
      investmentRupees,
      annualCarbonSavings,
      paybackPeriodYears: Math.max(paybackPeriodYears, 0.5),
      roi10YearPercent: Math.max(roi10YearPercent, 0),
    };
  });
};
