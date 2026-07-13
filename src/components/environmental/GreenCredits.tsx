import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Trophy, Users, TrendingUp, Target } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { ZoneData, MapMode } from "@/types/map";

interface GreenCreditsProps {
  zones: ZoneData[];
  mode: MapMode;
}

export const GreenCredits = ({ zones, mode }: GreenCreditsProps) => {
  const [credits, setCredits] = useLocalStorage('greenstream_credits', 1280);
  const [creditDelta, setCreditDelta] = useState(0);

  const handleCreditsUpdate = () => {
    if (!creditDelta || creditDelta <= 0) return;
    setCredits((prev) => prev + creditDelta);
    setCreditDelta(0);
  };

  const leaderboard = useMemo(() => (
    [...zones]
      .sort((a, b) => b.sustainability_score - a.sustainability_score)
      .slice(0, 5)
  ), [zones]);

  return (
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
            value={creditDelta === 0 ? '' : creditDelta}
            onChange={(e) => setCreditDelta(Number(e.target.value) || 0)}
            placeholder="0"
            className="h-8 bg-gray-900/70 border-gray-700 text-gray-200 text-xs placeholder:text-gray-500"
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

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-4 p-3 bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-500/20 rounded-lg"
      >
        <div className="flex items-center gap-2 mb-2">
          <Target className="w-4 h-4 text-purple-400" />
          <p className="text-xs font-semibold text-purple-300">Progress to Next Tier</p>
        </div>
        <div className="h-2 rounded-full bg-gray-800 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, (credits % 2000) / 20)}%` }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="h-full bg-gradient-to-r from-purple-400 to-blue-400"
          />
        </div>
        <p className="text-[10px] text-gray-400 mt-1 text-right">
          {credits} / 2000 credits for Gold Tier
        </p>
      </motion.div>
    </Card>
  );
};