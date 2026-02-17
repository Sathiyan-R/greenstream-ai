import { useState, memo } from "react";
import { MapContainer, TileLayer, Circle, Popup } from "react-leaflet";
import { motion } from "framer-motion";
import { MapMode, ZoneData } from "@/types/map";
import { getColorByMode, getCircleRadius } from "@/lib/mapColors";
import "leaflet/dist/leaflet.css";

interface EnvironmentalMapProps {
  zones: ZoneData[];
  mode: MapMode;
  onZoneClick: (zone: ZoneData) => void;
}

const mapContainerStyle = {
  width: "100%",
  height: "100%",
  minHeight: "500px",
};

const center: [number, number] = [13.0827, 80.2707]; // Chennai

export const EnvironmentalMap = memo(({ zones, mode, onZoneClick }: EnvironmentalMapProps) => {
  const [, setSelectedZone] = useState<ZoneData | null>(null);

  const handleCircleClick = (zone: ZoneData) => {
    setSelectedZone(zone);
    onZoneClick(zone);
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
                <div className="min-w-[200px]">
                  <h3 className="font-bold text-sm mb-2 text-blue-600">
                    {zone.zone_name || zone.name}
                  </h3>
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-gray-600">Area:</span>
                      <span className="text-gray-900 font-medium">{zone.zone_region || zone.area}</span>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-gray-600">Temperature:</span>
                      <span className="text-orange-600 font-medium">
                        {zone.temperature}°C {zone.trend_temperature || ""}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-gray-600">AQI:</span>
                      <span className="text-purple-600 font-medium">
                        {zone.aqi} {zone.trend_aqi || ""}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-gray-600">Energy:</span>
                      <span className="text-yellow-600 font-medium">
                        {Math.round(zone.energy_consumption || zone.energy || 0)} kWh{" "}
                        {zone.trend_energy || ""}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-gray-600">Carbon:</span>
                      <span className="text-green-600 font-medium">
                        {Math.round(zone.carbon_emission || zone.carbon || 0)} kg
                      </span>
                    </div>
                    {zone.sustainability_score !== undefined && (
                      <div className="flex items-center justify-between gap-4 pt-1 border-t">
                        <span className="text-gray-600">Sustainability:</span>
                        <span className="text-green-600 font-bold">
                          {zone.sustainability_score}/100
                        </span>
                      </div>
                    )}
                  </div>
                  <p className="text-[10px] text-gray-500 mt-2 italic">
                    Click circle for detailed insights
                  </p>
                </div>
              </Popup>
            </Circle>
          );
        })}
      </MapContainer>
    </div>
  );
});

EnvironmentalMap.displayName = "EnvironmentalMap";
