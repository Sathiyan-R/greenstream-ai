import { useState, useEffect, useCallback, useRef } from "react";
import {
  fetchWeather,
  fetchAirQuality,
  fetchForecast,
  generateEnergyReading,
  calculateCarbon,
  detectAnomalies,
  generatePrediction,
  type DashboardState,
  type EnergyReading,
} from "@/lib/api";

export function useDashboardData() {
  const [state, setState] = useState<DashboardState>({
    weather: null,
    airQuality: null,
    forecast: null,
    energyReadings: [],
    carbon: null,
    anomalies: [],
    energyHistory: [],
    sustainabilityScore: 0,
    prediction: null,
    rollingAvgUsage: 0,
  });
  const [loading, setLoading] = useState(true);
  const [apiStatus, setApiStatus] = useState({ weather: false, airQuality: false, energy: false, forecast: false });
  const prevReadings = useRef<EnergyReading[]>([]);
  const usageHistory = useRef<number[]>([]);

  const fetchAPIs = useCallback(async () => {
    const newStatus = { weather: false, airQuality: false, energy: true, forecast: false };

    const promises: Promise<void>[] = [];

    // Weather
    promises.push(
      fetchWeather("Chennai")
        .then((weather) => { setState((s) => ({ ...s, weather })); newStatus.weather = true; })
        .catch((e) => console.error("Weather fetch failed:", e))
    );

    // Air quality
    promises.push(
      fetchAirQuality("Chennai", "Tamil Nadu", "India")
        .then((airQuality) => { setState((s) => ({ ...s, airQuality })); newStatus.airQuality = true; })
        .catch((e) => console.error("Air quality fetch failed:", e))
    );

    // Forecast
    promises.push(
      fetchForecast("Chennai")
        .then((forecast) => { setState((s) => ({ ...s, forecast })); newStatus.forecast = true; })
        .catch((e) => console.error("Forecast fetch failed:", e))
    );

    await Promise.allSettled(promises);
    setApiStatus(newStatus);
  }, []);

  const updateEnergy = useCallback(() => {
    const readings = generateEnergyReading();
    const carbon = calculateCarbon(readings);

    const now = new Date();
    const time = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    const totalUsage = readings.reduce((s, r) => s + r.energyUsage, 0);
    const totalSolar = readings.reduce((s, r) => s + r.solarProduction, 0);

    // Rolling 5-minute average (60 readings at 5s intervals)
    usageHistory.current.push(totalUsage);
    if (usageHistory.current.length > 60) usageHistory.current.shift();
    const rollingAvgUsage = usageHistory.current.reduce((a, b) => a + b, 0) / usageHistory.current.length;

    setState((s) => {
      const aqi = s.airQuality?.aqi ?? 0;
      const anomalies = detectAnomalies(readings, prevReadings.current, rollingAvgUsage, aqi);
      const prediction = generatePrediction(s.forecast, rollingAvgUsage, aqi);

      const renewableRatio = totalSolar / (totalUsage || 1);
      const sustainabilityScore = Math.min(100, Math.round(
        renewableRatio * 100 + (anomalies.length === 0 ? 20 : 0)
      ));

      prevReadings.current = readings;

      return {
        ...s,
        energyReadings: readings,
        carbon,
        anomalies,
        sustainabilityScore,
        prediction,
        rollingAvgUsage: Math.round(rollingAvgUsage),
        energyHistory: [
          ...s.energyHistory.slice(-19),
          { time, usage: Math.round(totalUsage), solar: Math.round(totalSolar) },
        ],
      };
    });
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
