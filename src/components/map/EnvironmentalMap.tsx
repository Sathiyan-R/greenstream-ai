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

const center: [number, number] = [13.0827, 80.2707]; // Chennai

export const EnvironmentalMap = memo(({ zones, mode, onZoneClick, onAlertMarkerClick }: EnvironmentalMapProps) => {
  const [, setSelectedZone] = useState<ZoneData | null>(null);

  // Detect anomalies for alert markers
  const anomalousZones = useMemo(() => {
    return zones.filter(zone => {
      // Calculate z-score for various metrics to detect anomalies
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

      // Calculate z-scores (anomaly if |z| > 1.5)
      const zAQI = Math.abs((zone.aqi - avgAQI) / (stdDevAQI || 1));
      const zTemp = Math.abs((zone.temperature - avgTemp) / (stdDevTemp || 1));
      const zEnergy = Math.abs(((zone.energy_consumption || 0) - avgEnergy) / (stdDevEnergy || 1));

      return zAQI > 1.5 || zTemp > 1.5 || zEnergy > 1.5;
    });
  }, [zones]);

  // Create alert marker icon
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

  // Get risk level based on anomaly severity
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

        {/* Regular zone circles */}
        {zones.map((zone) => {
          const lat = zone.latitude || zone.lat || 0;
          const lng = zone.longitude || zone.lng || 0;
          const color = getColorByMode(mode, zone);
          const radius = getCircleRadius(mode, zone);

          return (
            <Circle
              key={zone.id}
              center={[lat, lng]}
              radius={radius}
              pathOptions={{
                fillColor: color,
                fillOpacity: 0.4,
                color: color,
                weight: 2,
                opacity: 0.8,
              }}
              eventHandlers={{
                click: () => handleCircleClick(zone),
              }}
            >
              <Popup>
                <div className="min-w-[200px] bg-gray-800/80 backdrop-blur-sm rounded-lg p-4 border border-gray-600/50">
                  <h3 className="font-bold text-sm mb-2 text-cyan-400">
                    {zone.zone_name || zone.name}
                  </h3>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-gray-300">Area:</span>
                      <span className="text-gray-100 font-medium">{zone.zone_region || zone.area}</span>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-gray-300">Temperature:</span>
                      <span className="text-orange-400 font-medium">
                        {zone.temperature}°C {zone.trend_temperature || ""}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-gray-300">AQI:</span>
                      <span className="text-purple-400 font-medium">
                        {zone.aqi} {zone.trend_aqi || ""}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-gray-300">Energy:</span>
                      <span className="text-yellow-400 font-medium">
                        {Math.round(zone.energy_consumption || zone.energy || 0)} kWh{" "}
                        {zone.trend_energy || ""}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-gray-300">Carbon:</span>
                      <span className="text-green-400 font-medium">
                        {Math.round(zone.carbon_emission || zone.carbon || 0)} kg
                      </span>
                    </div>
                    {zone.sustainability_score !== undefined && (
                      <div className="flex items-center justify-between gap-4 pt-1.5 border-t border-gray-600/50 mt-1.5">
                        <span className="text-gray-300">Sustainability:</span>
                        <span className="text-emerald-400 font-bold">
                          {zone.sustainability_score}/100
                        </span>
                      </div>
                    )}
                  </div>
                  <p className="text-[10px] text-gray-400 mt-3 italic">
                    Click circle for detailed insights
                  </p>
                </div>
              </Popup>
            </Circle>
          );
        })}

        {/* Alert markers for anomalous zones */}
        {anomalousZones.map((zone) => {
          const lat = zone.latitude || zone.lat || 0;
          const lng = zone.longitude || zone.lng || 0;
          const riskLevel = getAlertRiskLevel(zone);
          const icon = createAlertIcon(riskLevel);

          return (
            <Marker
              key={`alert-${zone.id}`}
              position={[lat, lng]}
              icon={icon}
              eventHandlers={{
                click: () => handleAlertClick(zone),
              }}
            >
              <Popup>
                <div className="min-w-[200px] bg-gray-800/80 backdrop-blur-sm rounded-lg p-4 border border-gray-600/50">
                  <h3 className="font-bold text-sm mb-2 text-red-400">
                    ⚠️ {zone.zone_name || zone.name}
                  </h3>
                  <p className="text-xs text-red-300 mb-2 font-semibold bg-red-900/30 px-2 py-1 rounded">
                    Anomaly Detected - Risk Level: {riskLevel.toUpperCase()}
                  </p>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-gray-300">AQI:</span>
                      <span className="text-red-400 font-bold">{zone.aqi}</span>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-gray-300">Temperature:</span>
                      <span className="text-orange-400 font-bold">{zone.temperature}°C</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleAlertClick(zone)}
                    className="mt-3 w-full px-3 py-1.5 bg-red-600/80 hover:bg-red-600 text-white text-xs font-semibold rounded transition-colors backdrop-blur-sm border border-red-500/50"
                  >
                    View Environmental DNA
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
});

EnvironmentalMap.displayName = "EnvironmentalMap";
