import { useState, memo } from "react";
import { MapContainer, TileLayer, Circle, Popup } from "react-leaflet";
import { MapMode, ZoneData } from "@/types/map";
import { getColorByMode, getCircleRadius } from "@/lib/mapData";
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

  const getValue = (zone: ZoneData): number => {
    switch (mode) {
      case "temperature":
        return zone.temperature;
      case "aqi":
        return zone.aqi;
      case "energy":
        return zone.energy;
      default:
        return 0;
    }
  };

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
          const value = getValue(zone);
          const color = getColorByMode(mode, value);
          const radius = getCircleRadius(mode, value);

          return (
            <Circle
              key={zone.id}
              center={[zone.lat, zone.lng]}
              radius={radius}
              pathOptions={{
                fillColor: color,
                fillOpacity: 0.35,
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
                    {zone.name}
                  </h3>
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-gray-600">Area:</span>
                      <span className="text-gray-900 font-medium">{zone.area}</span>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-gray-600">Temperature:</span>
                      <span className="text-orange-600 font-medium">{zone.temperature}°C</span>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-gray-600">AQI:</span>
                      <span className="text-purple-600 font-medium">{zone.aqi}</span>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-gray-600">Energy:</span>
                      <span className="text-yellow-600 font-medium">{zone.energy} kWh</span>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-gray-600">Carbon:</span>
                      <span className="text-green-600 font-medium">{zone.carbon} kg</span>
                    </div>
                  </div>
                  <p className="text-[10px] text-gray-500 mt-2 italic">
                    Click circle for AI insights
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
