import { useMemo } from "react";
import { motion } from "framer-motion";
import { MapPin, TrendingUp, Leaf, Cloud, Wind, Users, Activity, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { ZoneData, MapMode } from "@/types/map";
import { useChennaiEnvironmentStatus } from "@/hooks/useChennaiEnvironmentStatus";
import { useLocalStorage } from "@/hooks/useLocalStorage";

interface CityData {
  name: string;
  avgTemperature: number;
  avgAQI: number;
  avgSustainability: number;
  totalEnergy: number;
  totalCarbon: number;
  greenCredits: number;
}

interface CitySeed {
  name: string;
  baseTemp: number;
  baseAQI: number;
  baseSustainability: number;
  baseEnergy: number;
  baseCarbon: number;
  baseCredits: number;
}

const cityData: Record<string, CitySeed> = {
  Chennai: {
    name: "Chennai",
    baseTemp: 29.5,
    baseAQI: 110,
    baseSustainability: 68,
    baseEnergy: 22400,
    baseCarbon: 4280,
    baseCredits: 1280
  },
  Bengaluru: {
    name: "Bengaluru",
    baseTemp: 27.4,
    baseAQI: 92,
    baseSustainability: 71,
    baseEnergy: 21200,
    baseCarbon: 4120,
    baseCredits: 960
  },
  Hyderabad: {
    name: "Hyderabad",
    baseTemp: 29.2,
    baseAQI: 104,
    baseSustainability: 66,
    baseEnergy: 23800,
    baseCarbon: 4680,
    baseCredits: 880
  },
  Mumbai: {
    name: "Mumbai",
    baseTemp: 28.8,
    baseAQI: 118,
    baseSustainability: 62,
    baseEnergy: 28500,
    baseCarbon: 5200,
    baseCredits: 1100
  },
  Delhi: {
    name: "Delhi",
    baseTemp: 30.1,
    baseAQI: 165,
    baseSustainability: 54,
    baseEnergy: 32000,
    baseCarbon: 6800,
    baseCredits: 720
  },
  Kolkata: {
    name: "Kolkata",
    baseTemp: 29.8,
    baseAQI: 142,
    baseSustainability: 58,
    baseEnergy: 25600,
    baseCarbon: 5100,
    baseCredits: 800
  }
};

interface CityComparisonProps {
  zones: ZoneData[];
  mode: MapMode;
}

export const CityComparison = ({ zones, mode }: CityComparisonProps) => {
  const { stats, totalCarbon } = useChennaiEnvironmentStatus();
  const [compareCityA, setCompareCityA] = useLocalStorage('greenstream_city_a', "Chennai");
  const [compareCityB, setCompareCityB] = useLocalStorage('greenstream_city_b', "Bengaluru");
  const [credits] = useLocalStorage('greenstream_credits', 1280);

  function normalizeCity(city: CitySeed): CityData {
    return {
      name: city.name,
      avgTemperature: city.baseTemp,
      avgAQI: city.baseAQI,
      avgSustainability: city.baseSustainability,
      totalEnergy: city.baseEnergy,
      totalCarbon: city.baseCarbon,
      greenCredits: city.baseCredits,
    };
  }

  const chennaiLive = useMemo(() => ({
    name: "Chennai (Live)",
    avgTemperature: stats.avgTemperature || cityData.Chennai.baseTemp,
    avgAQI: stats.avgAQI || cityData.Chennai.baseAQI,
    avgSustainability: stats.avgSustainability || cityData.Chennai.baseSustainability,
    totalEnergy: stats.totalEnergy || cityData.Chennai.baseEnergy,
    totalCarbon: Math.round(totalCarbon || cityData.Chennai.baseCarbon),
    greenCredits: credits
  }), [stats.avgTemperature, stats.avgAQI, stats.avgSustainability, stats.totalEnergy, totalCarbon, credits]);

  const comparisonCities = useMemo(() => ({
    "Chennai (Live)": chennaiLive,
    Bengaluru: normalizeCity(cityData.Bengaluru),
    Hyderabad: normalizeCity(cityData.Hyderabad),
    Mumbai: normalizeCity(cityData.Mumbai),
    Delhi: normalizeCity(cityData.Delhi),
    Kolkata: normalizeCity(cityData.Kolkata)
  }), [chennaiLive]);

  const comparisonA = comparisonCities[compareCityA as keyof typeof comparisonCities];
  const comparisonB = comparisonCities[compareCityB as keyof typeof comparisonCities];
  const activeComparisonA = comparisonA ?? chennaiLive;
  const activeComparisonB = comparisonB ?? normalizeCity(cityData.Bengaluru);

  const getMetricValue = (city: CityData, key: keyof CityData) => city[key] ?? 0;

  const metrics = [
    { label: "Avg Temp", key: "avgTemperature", unit: "°C", icon: Activity },
    { label: "Avg AQI", key: "avgAQI", unit: "", icon: Wind },
    { label: "Sustainability", key: "avgSustainability", unit: "/100", icon: Leaf },
    { label: "Energy", key: "totalEnergy", unit: "kWh", icon: TrendingUp },
    { label: "Carbon", key: "totalCarbon", unit: "kg CO2", icon: Cloud },
    { label: "Green Credits", key: "greenCredits", unit: "", icon: Users }
  ];

  const getColorForMetric = (key: string, valueA: number, valueB: number) => {
    if (key === "avgTemperature" || key === "avgAQI" || key === "totalCarbon" || key === "totalEnergy") {
      return valueA < valueB ? "text-green-400" : valueA > valueB ? "text-red-400" : "text-gray-300";
    }
    return valueA > valueB ? "text-green-400" : valueA < valueB ? "text-red-400" : "text-gray-300";
  };

  return (
    <Card className="p-4 bg-gradient-to-br from-slate-900/70 to-blue-950/40 border-blue-500/30">
      <div className="flex items-start gap-3 mb-3">
        <div className="p-2 bg-blue-500/20 rounded-lg">
          <MapPin className="w-5 h-5 text-blue-300" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-white text-sm mb-1">City Comparison</h3>
          <p className="text-xs text-gray-300">Compare live Chennai with other major cities.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="space-y-1">
          <label className="text-[10px] text-gray-400">City A</label>
          <Select
            value={compareCityA}
            onValueChange={setCompareCityA}
            options={Object.keys(comparisonCities).map(city => ({ value: city, label: city }))}
            className="w-full bg-gray-900/70 border border-gray-700 text-gray-200 rounded-md px-2 py-1 text-xs"
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] text-gray-400">City B</label>
          <Select
            value={compareCityB}
            onValueChange={setCompareCityB}
            options={Object.keys(comparisonCities).map(city => ({ value: city, label: city }))}
            className="w-full bg-gray-900/70 border border-gray-700 text-gray-200 rounded-md px-2 py-1 text-xs"
          />
        </div>
      </div>

      <div className="space-y-2">
        {metrics.map((row) => (
          <div key={row.key} className="grid grid-cols-3 gap-2 text-xs text-gray-300">
            <div className="flex items-center gap-1">
              <row.icon className="w-3 h-3 text-gray-400" />
              <span className="text-gray-400">{row.label}</span>
            </div>
            <span className={`text-right font-semibold text-blue-200 ${getColorForMetric(row.key, getMetricValue(activeComparisonA, row.key as keyof CityData), getMetricValue(activeComparisonB, row.key as keyof CityData))}`}>
              {`${getMetricValue(activeComparisonA, row.key as keyof CityData).toLocaleString()}${row.unit}`}
            </span>
            <span className={`text-right font-semibold text-blue-200 ${getColorForMetric(row.key, getMetricValue(activeComparisonB, row.key as keyof CityData), getMetricValue(activeComparisonA, row.key as keyof CityData))}`}>
              {`${getMetricValue(activeComparisonB, row.key as keyof CityData).toLocaleString()}${row.unit}`}
            </span>
          </div>
        ))}
      </div>

      {activeComparisonA && activeComparisonB && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-4 p-3 bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-500/20 rounded-lg"
        >
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <p className="text-xs font-semibold text-blue-300">AI Summary</p>
          </div>
          <p className="text-xs text-gray-300">
            {activeComparisonA.name} shows{" "}
            <span className={getColorForMetric("avgAQI", activeComparisonA.avgAQI, activeComparisonB.avgAQI)}>
              {activeComparisonA.avgAQI < activeComparisonB.avgAQI ? "better" : activeComparisonA.avgAQI > activeComparisonB.avgAQI ? "higher" : "similar"}
            </span>{" "}
            AQI ({activeComparisonA.avgAQI} vs {activeComparisonB.avgAQI}){" "}
            and{" "}
            <span className={getColorForMetric("avgSustainability", activeComparisonA.avgSustainability, activeComparisonB.avgSustainability)}>
              {activeComparisonA.avgSustainability > activeComparisonB.avgSustainability ? "higher" : activeComparisonA.avgSustainability < activeComparisonB.avgSustainability ? "lower" : "similar"}
            </span>{" "}
            sustainability ({activeComparisonA.avgSustainability} vs {activeComparisonB.avgSustainability}).
            Carbon emissions are{" "}
            <span className={getColorForMetric("totalCarbon", activeComparisonA.totalCarbon, activeComparisonB.totalCarbon)}>
              {activeComparisonA.totalCarbon < activeComparisonB.totalCarbon ? "lower" : "higher"}
            </span>
            .
          </p>
        </motion.div>
      )}
    </Card>
  );
};