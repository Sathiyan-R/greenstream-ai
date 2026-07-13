import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, TrendingUp, Sparkles, MapPin, Trophy, Users, AlertCircle, CheckCircle, ArrowLeft, RefreshCw, Activity, X, Swords, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { useChennaiEnvironmentStatus } from "@/hooks/useChennaiEnvironmentStatus";
import { ZoneData, MapMode } from "@/types/map";
import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { GreenCredits } from "@/components/environmental/GreenCredits";
import { ZoneBattle } from "@/components/environmental/ZoneBattle";
import { WhatIfSimulator } from "@/components/environmental/WhatIfSimulator";
import { CityComparison } from "@/components/environmental/CityComparison";

const defaultMode: MapMode = "sustainability";

const EnvironmentalInsights = () => {
  const { zones, loading, lastUpdated, isLive, refresh, error } = useChennaiEnvironmentStatus();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredZones = useMemo(() => {
    if (!searchQuery.trim()) return zones;
    const query = searchQuery.toLowerCase();
    return zones.filter(zone =>
      zone.zone_name.toLowerCase().includes(query) ||
      zone.zone_region.toLowerCase().includes(query)
    );
  }, [zones, searchQuery]);

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
          <div className="h-[600px] flex items-center justify-center">
            <div className="text-center">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Unable to Load Data</h2>
              <p className="text-gray-400 mb-6">{error}</p>
              <Button onClick={refresh} className="gap-2">
                <RefreshCw className="w-4 h-4" />
                Retry
              </Button>
            </div>
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
          <div className="h-[600px] flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-400">Loading environmental insights...</p>
            </div>
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
                  <Globe className="w-6 h-6 text-blue-500" />
                  Environmental Insights
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="text-sm text-gray-400 mt-0.5"
                >
                  Deep dive into green credits, zone battles, simulations & city comparisons
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
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card className="bg-gray-800/50 border-gray-700">
            <div className="p-4">
              <div className="relative max-w-xl">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search zones by name or region..."
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
            </div>
          </Card>
        </motion.div>

        <div className="space-y-8">
          {/* Section 1: Green Credits */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Green Credits</h2>
                <p className="text-sm text-gray-400">Community rewards for sustainable actions across zones</p>
              </div>
            </div>
            <GreenCredits zones={filteredZones} mode={defaultMode} />
          </motion.section>

          {/* Section 2: Zone Battle */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl">
                <Swords className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Zone Battle</h2>
                <p className="text-sm text-gray-400">Compare environmental interventions between two zones</p>
              </div>
            </div>
            <ZoneBattle zones={filteredZones} mode={defaultMode} />
          </motion.section>

          {/* Section 3: What-If Simulator */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">What-If Simulator</h2>
                <p className="text-sm text-gray-400">Model the impact of green interventions on Chennai's environment</p>
              </div>
            </div>
            <WhatIfSimulator zones={filteredZones} mode={defaultMode} />
          </motion.section>

          {/* Section 4: City Comparison */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">City Comparison</h2>
                <p className="text-sm text-gray-400">Compare Chennai's live metrics with other major Indian cities</p>
              </div>
            </div>
            <CityComparison zones={filteredZones} mode={defaultMode} />
          </motion.section>
        </div>
      </div>
    </div>
  );
};

export default EnvironmentalInsights;