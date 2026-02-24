import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ZoneData } from "@/types/map";
import { RealtimeChannel } from "@supabase/supabase-js";
import { useDashboardData } from "./useDashboardData";

const fallbackZones = [
  {
    id: "zone-1",
    zone_name: "North Chennai",
    zone_region: "Industrial & Port Area",
    latitude: 13.1482,
    longitude: 80.2619,
  },
  {
    id: "zone-2",
    zone_name: "Central Chennai",
    zone_region: "Urban Core & Commercial",
    latitude: 13.0827,
    longitude: 80.2707,
  },
  {
    id: "zone-3",
    zone_name: "South Chennai",
    zone_region: "IT Corridor & Residential",
    latitude: 12.9249,
    longitude: 80.2270,
  },
  {
    id: "zone-4",
    zone_name: "OMR / IT Corridor",
    zone_region: "Technology Hub",
    latitude: 12.9352,
    longitude: 80.2430,
  },
  {
    id: "zone-5",
    zone_name: "Industrial Belt",
    zone_region: "Manufacturing Zone",
    latitude: 13.1143,
    longitude: 80.1548,
  },
];

export function useChennaiEnvironmentStatus() {
  const [zones, setZones] = useState<ZoneData[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isLive, setIsLive] = useState(false);
  const [useSupabase, setUseSupabase] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const { state: dashboardState } = useDashboardData();

  const fetchZones = async () => {
    try {
      const { data, error } = await supabase
        .from("chennai_environment_status" as any)
        .select("*")
        .order("zone_name");

      if (error) throw error;

      if (data && data.length > 0) {
        
        const transformedData: ZoneData[] = data.map((zone: any) => ({
          id: zone.id,
          zone_name: zone.zone_name,
          zone_region: zone.zone_region,
          latitude: zone.latitude,
          longitude: zone.longitude,
          temperature: zone.temperature,
          humidity: zone.humidity || 65,
          aqi: zone.aqi,
          energy_consumption: zone.energy_consumption,
          energy_variance: zone.energy_variance || zone.energy_consumption * 0.15,
          carbon_emission: zone.carbon_emission,
          sustainability_score: zone.sustainability_score,
          wind_speed: zone.wind_speed || 8,
          zone_area: zone.zone_area || 50,
          trend_temperature: zone.trend_temperature,
          trend_aqi: zone.trend_aqi,
          trend_energy: zone.trend_energy,
          prediction_tomorrow: zone.prediction_tomorrow,
          ai_suggestion: zone.ai_suggestion,
          last_updated: zone.last_updated,
          
          name: zone.zone_name,
          lat: zone.latitude,
          lng: zone.longitude,
          energy: zone.energy_consumption,
          carbon: zone.carbon_emission,
          area: zone.zone_region,
        }));

        setZones(transformedData);
        setLastUpdated(new Date());
        setLoading(false);
        setUseSupabase(true);
        setError(null);
      } else {
        
        console.log("No data in Supabase, using fallback with live API data");
        setUseSupabase(false);
        setError(null);
        updateZonesFromAPI();
      }
    } catch (error) {
      console.error("Error fetching from Supabase:", error);
      setError(error as Error);
      
      setUseSupabase(false);
      updateZonesFromAPI();
    }
  };

  const updateZonesFromAPI = () => {
    const totalEnergy = dashboardState.energyReadings.reduce(
      (sum, r) => sum + r.energyUsage,
      0
    );
    const baseTemp = dashboardState.weather?.temperature || 32;
    const baseAqi = dashboardState.airQuality?.aqi || 120;

    const updatedZones: ZoneData[] = fallbackZones.map((baseZone, index) => {
      
      const isIndustrial = baseZone.zone_region.includes("Industrial");
      const isIT = baseZone.zone_region.includes("IT") || baseZone.zone_region.includes("Technology");
      const isCoastal = baseZone.zone_region.includes("Coastal");

      const tempOffset = isIndustrial ? 3 : isIT ? 2.5 : isCoastal ? -1 : 0;
      const aqiMultiplier = isIndustrial ? 1.5 : isIT ? 1.4 : isCoastal ? 0.7 : 1.0;
      const energyBase = isIndustrial ? 2500 : isIT ? 2100 : 850;

      const variation = (Math.random() - 0.5) * 2;
      const temperature = parseFloat((baseTemp + tempOffset + variation).toFixed(2));
      const aqi = Math.round(baseAqi * aqiMultiplier + variation * 10);
      const energyReading = dashboardState.energyReadings[index % dashboardState.energyReadings.length];
      const energy_consumption = energyReading
        ? parseFloat((energyReading.energyUsage * (energyBase / 850)).toFixed(2))
        : energyBase;
      const carbon_emission = parseFloat((energy_consumption * 0.82).toFixed(2));

      const aqiScore = Math.max(0, 100 - aqi / 2);
      const energyScore = Math.max(0, 100 - energy_consumption / 30);
      const tempScore = Math.max(0, 100 - (temperature - 25) * 5);
      const sustainability_score = Math.round(
        aqiScore * 0.5 + energyScore * 0.3 + tempScore * 0.2
      );

      const trends = ["↑", "↓", "→"];
      const trend_temperature = trends[Math.floor(Math.random() * trends.length)];
      const trend_aqi = trends[Math.floor(Math.random() * trends.length)];
      const trend_energy = trends[Math.floor(Math.random() * trends.length)];

      const humidity = isCoastal ? 68 + Math.random() * 10 : 65 + Math.random() * 8;

      const windSpeedBase = isCoastal ? 12 : isIndustrial ? 6 : 9;
      const wind_speed = windSpeedBase + (Math.random() - 0.5) * 4;

      const energy_variance = energy_consumption * (0.12 + Math.random() * 0.08);

      const zone_area = isIndustrial ? 40 : isIT ? 50 : isCoastal ? 55 : 45;

      return {
        ...baseZone,
        temperature,
        humidity: Math.round(humidity * 10) / 10,
        aqi,
        energy_consumption,
        energy_variance,
        carbon_emission,
        wind_speed: Math.round(wind_speed * 10) / 10,
        zone_area,
        sustainability_score,
        trend_temperature,
        trend_aqi,
        trend_energy,
        prediction_tomorrow:
          trend_aqi === "↑"
            ? "Air quality may worsen. Temperature expected to rise."
            : "Stable conditions expected with minor variations.",
        ai_suggestion:
          sustainability_score < 50
            ? "Critical: Immediate intervention required. Increase renewable energy adoption and monitor emissions closely."
            : sustainability_score < 70
            ? "Alert: Consider implementing energy efficiency measures and air quality monitoring."
            : "Continue monitoring current sustainable practices.",
        last_updated: new Date().toISOString(),
        
        name: baseZone.zone_name,
        lat: baseZone.latitude,
        lng: baseZone.longitude,
        energy: energy_consumption,
        carbon: carbon_emission,
        area: baseZone.zone_region,
      };
    });

    setZones(updatedZones);
    setLastUpdated(new Date());
    setLoading(false);
    setIsLive(true);
    setTimeout(() => setIsLive(false), 2000);
  };

  useEffect(() => {
    fetchZones();

    if (useSupabase) {
      const channel = supabase
        .channel("chennai-status")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "chennai_environment_status",
          },
          (payload) => {
            console.log("Real-time update received:", payload);
            setIsLive(true);

            fetchZones();

            setTimeout(() => setIsLive(false), 2000);
          }
        )
        .subscribe((status) => {
          console.log("Real-time subscription status:", status);
        });

      channelRef.current = channel;
    }

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!useSupabase && dashboardState.energyReadings.length > 0 && zones.length === 0) {
      updateZonesFromAPI();
    }
  }, [useSupabase, dashboardState.energyReadings.length]);

  useEffect(() => {
    pollIntervalRef.current = setInterval(() => {
      if (useSupabase) {
        fetchZones();
      } else {
        updateZonesFromAPI();
      }
    }, 60000); 

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, [useSupabase]);

  const refresh = () => {
    setError(null);
    if (useSupabase) {
      fetchZones();
    } else {
      updateZonesFromAPI();
    }
  };

  return { zones, loading, lastUpdated, isLive, error, refresh };
}
