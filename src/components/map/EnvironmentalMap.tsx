import { useState, memo, useMemo } from "react";
import { MapContainer, TileLayer, Circle, Popup, Marker } from "react-leaflet";
import { motion } from "framer-motion";
import { MapMode, ZoneData } from "@/types/map";
import { getColorByMode, getCircleRadius } from "@/lib/mapColors";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface EnvironmentalMapProps {
  zones: ZoneData[];
  mode: MapMode;
  onZoneClick: (zone: ZoneData) => void;
  onAlertMarkerClick?: (zone: ZoneData) => void;
}

const mapContainerStyle = {
  width: "100%",
  height: "100%",
  minHeight: "500px",
};

const center: [number, number] = [13.0827, 80.2707]; 

export const EnvironmentalMap = memo(({ zones, mode, onZoneClick, onAlertMarkerClick }: EnvironmentalMapProps) => {
  const [, setSelectedZone] = useState<ZoneData | null>(null);

  const anomalousZones = useMemo(() => {
    return zones.filter(zone => {
      
      const avgAQI = zones.reduce((sum, z) => sum + z.aqi, 0) / zones.length;
      const avgTemp = zones.reduce((sum, z) => sum + z.temperature, 0) / zones.length;
      const avgEnergy = zones.reduce((sum, z) => sum + (z.energy_consumption || 0), 0) / zones.length;
      
      const stdDevAQI = Math.sqrt(
        zones.reduce((sum, z) => sum + Math.pow(z.aqi - avgAQI, 2), 0) / zones.length
      );
      const stdDevTemp = Math.sqrt(
        zones.reduce((sum, z) => sum + Math.pow(z.temperature - avgTemp, 2), 0) / zones.length
      );
      const stdDevEnergy = Math.sqrt(
        zones.reduce((sum, z) => sum + Math.pow((z.energy_consumption || 0) - avgEnergy, 2), 0) / zones.length
      );

      const zAQI = Math.abs((zone.aqi - avgAQI) / (stdDevAQI || 1));
      const zTemp = Math.abs((zone.temperature - avgTemp) / (stdDevTemp || 1));
      const zEnergy = Math.abs(((zone.energy_consumption || 0) - avgEnergy) / (stdDevEnergy || 1));

      return zAQI > 1.5 || zTemp > 1.5 || zEnergy > 1.5;
    });
  }, [zones]);

  const createAlertIcon = (riskLevel: "critical" | "high" | "moderate") => {
    const colors = {
      critical: "#EF4444",
      high: "#F97316",
      moderate: "#EAB308",
    };
    
    return L.divIcon({
      className: "alert-marker",
      html: `
        <div style="
          width: 32px;
          height: 32px;
          background: ${colors[riskLevel]};
          border: 3px solid white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 18px;
          box-shadow: 0 0 10px ${colors[riskLevel]};
          animation: pulse 1.5s infinite;
        ">
          ⚠️
        </div>
        <style>
          @keyframes pulse {
            0%, 100% { box-shadow: 0 0 10px ${colors[riskLevel]}, 0 0 20px ${colors[riskLevel]}; }
            50% { box-shadow: 0 0 5px ${colors[riskLevel]}; }
          }
        </style>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
      popupAnchor: [0, -16],
    });
  };

  const getAlertRiskLevel = (zone: ZoneData): "critical" | "high" | "moderate" => {
    const avgAQI = zones.reduce((sum, z) => sum + z.aqi, 0) / zones.length;
    const zAQI = Math.abs((zone.aqi - avgAQI) / (Math.sqrt(
      zones.reduce((sum, z) => sum + Math.pow(z.aqi - avgAQI, 2), 0) / zones.length
    ) || 1));

    if (zAQI > 3 || zone.aqi > 200) return "critical";
    if (zAQI > 2 || zone.aqi > 150) return "high";
    return "moderate";
  };

  const handleCircleClick = (zone: ZoneData) => {
    setSelectedZone(zone);
    onZoneClick(zone);
  };

  const handleAlertClick = (zone: ZoneData) => {
    if (onAlertMarkerClick) {
      onAlertMarkerClick(zone);
    }
  };

  return (
    <div className="w-full h-full rounded-lg overflow-hidden" style={mapContainerStyle}>
      <MapContainer
        center={center}
        zoom={11}
        scrollWheelZoom={true}
        style={{ width: "100%", height: "100%" }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {