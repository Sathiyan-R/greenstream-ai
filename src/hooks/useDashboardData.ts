import { useState, useEffect, useCallback, useRef } from "react";
import {
  fetchWeather,
  fetchAirQuality,
  generateEnergyReading,
  calculateCarbon,
  detectAnomalies,
  type DashboardState,
  type EnergyReading,
} from "@/lib/api";

export function useDashboardData() {
  const [state, setState] = useState<DashboardState>({
    weather: null,
    airQuality: null,
    energyReadings: [],
    carbon: null,
    anomalies: [],
    energyHistory: [],
    sustainabilityScore: 0,
  });
  const [loading, setLoading] = useState(true);
  const [apiStatus, setApiStatus] = useState({ weather: false, airQuality: false, energy: false });
  const prevReadings = useRef<EnergyReading[]>([]);

  const fetchAPIs = useCallback(async () => {
    const newStatus = { weather: false, airQuality: false, energy: true };

    // Weather
    try {
      const weather = await fetchWeather("London");
      setState((s) => ({ ...s, weather }));
      newStatus.weather = true;
    } catch (e) {
      console.error("Weather fetch failed:", e);
    }

    // Air quality
    try {
      const airQuality = await fetchAirQuality("London", "England", "UK");
      setState((s) => ({ ...s, airQuality }));
      newStatus.airQuality = true;
    } catch (e) {
      console.error("Air quality fetch failed:", e);
    }

    setApiStatus(newStatus);
  }, []);

  const updateEnergy = useCallback(() => {
    const readings = generateEnergyReading();
    const carbon = calculateCarbon(readings);
    const anomalies = detectAnomalies(readings, prevReadings.current);
    prevReadings.current = readings;

    const now = new Date();
    const time = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    const totalUsage = readings.reduce((s, r) => s + r.energyUsage, 0);
    const totalSolar = readings.reduce((s, r) => s + r.solarProduction, 0);

    const renewableRatio = totalSolar / (totalUsage || 1);
    const sustainabilityScore = Math.min(100, Math.round(renewableRatio * 100 + (anomalies.length === 0 ? 20 : 0)));

    setState((s) => ({
      ...s,
      energyReadings: readings,
      carbon,
      anomalies,
      sustainabilityScore,
      energyHistory: [
        ...s.energyHistory.slice(-19),
        { time, usage: Math.round(totalUsage), solar: Math.round(totalSolar) },
      ],
    }));
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAPIs();
    updateEnergy();
    const apiInterval = setInterval(fetchAPIs, 10000);
    const energyInterval = setInterval(updateEnergy, 5000);
    return () => {
      clearInterval(apiInterval);
      clearInterval(energyInterval);
    };
  }, [fetchAPIs, updateEnergy]);

  return { state, loading, apiStatus, refresh: () => { fetchAPIs(); updateEnergy(); } };
}
