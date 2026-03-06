/**
 * ============================================
 * MAP VIEW COMPONENT
 * Renders Leaflet map with bus markers, stops,
 * and route lines
 * ============================================
 */

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import { Bus, BusStop, BusRoute, LatLng } from "@/types";

// Fix default marker icons for Leaflet in Vite
const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// Bus icon (colored circle)
function createBusIcon(color: string) {
  return L.divIcon({
    className: "custom-bus-icon",
    html: `<div style="
      width: 24px; height: 24px; border-radius: 50%;
      background: ${color}; border: 3px solid white;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      display: flex; align-items: center; justify-content: center;
    ">
      <span style="color:white;font-size:10px;font-weight:bold;">🚌</span>
    </div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
}

// Stop icon
const stopIcon = L.divIcon({
  className: "custom-stop-icon",
  html: `<div style="
    width: 16px; height: 16px; border-radius: 50%;
    background: hsl(217, 91%, 50%); border: 2px solid white;
    box-shadow: 0 2px 6px rgba(0,0,0,0.2);
  "></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

// Home icon
const homeIcon = L.divIcon({
  className: "custom-home-icon",
  html: `<div style="
    width: 20px; height: 20px; border-radius: 50%;
    background: hsl(38, 92%, 50%); border: 2px solid white;
    box-shadow: 0 2px 6px rgba(0,0,0,0.2);
    display: flex; align-items: center; justify-content: center;
  ">
    <span style="font-size:11px;">🏠</span>
  </div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

// Component to auto-fit bounds
function FitBounds({ bounds }: { bounds: L.LatLngBoundsExpression }) {
  const map = useMap();
  useEffect(() => {
    map.fitBounds(bounds, { padding: [30, 30] });
  }, [map, bounds]);
  return null;
}

interface MapViewProps {
  buses: Bus[];
  stops: BusStop[];
  routes: BusRoute[];
  homeLocation?: LatLng | null;
  selectedStopId?: string | null;
  height?: string;
  onStopClick?: (stop: BusStop) => void;
}

export default function MapView({
  buses,
  stops,
  routes,
  homeLocation,
  selectedStopId,
  height = "500px",
  onStopClick,
}: MapViewProps) {
  const center: [number, number] = [40.7128, -74.006];

  // Build bounds from all markers
  const allPoints: [number, number][] = [
    ...buses.map((b) => [b.currentLocation.lat, b.currentLocation.lng] as [number, number]),
    ...stops.map((s) => [s.location.lat, s.location.lng] as [number, number]),
  ];
  if (homeLocation) allPoints.push([homeLocation.lat, homeLocation.lng]);

  const bounds: L.LatLngBoundsExpression =
    allPoints.length > 1
      ? allPoints as L.LatLngBoundsExpression
      : [[center[0] - 0.01, center[1] - 0.01], [center[0] + 0.01, center[1] + 0.01]];

  // Map route colors
  const routeColorMap = new Map(routes.map((r) => [r.id, r.color]));

  return (
    <MapContainer
      center={center}
      zoom={14}
      style={{ height, width: "100%", borderRadius: "var(--radius)" }}
      className="z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FitBounds bounds={bounds} />

      {/* Route lines */}
      {routes.map((route) => (
        <Polyline
          key={route.id}
          positions={route.path.map((p) => [p.lat, p.lng] as [number, number])}
          color={route.color}
          weight={4}
          opacity={0.7}
        />
      ))}

      {/* Bus markers */}
      {buses.map((bus) => (
        <Marker
          key={bus.id}
          position={[bus.currentLocation.lat, bus.currentLocation.lng]}
          icon={createBusIcon(routeColorMap.get(bus.routeId) || "#3b82f6")}
        >
          <Popup>
            <div className="text-sm">
              <strong>{bus.name}</strong>
              <br />
              Speed: {bus.speed} km/h
              <br />
              Status: <span className="capitalize">{bus.status}</span>
            </div>
          </Popup>
        </Marker>
      ))}

      {/* Stop markers */}
      {stops.map((stop) => (
        <Marker
          key={stop.id}
          position={[stop.location.lat, stop.location.lng]}
          icon={stopIcon}
          eventHandlers={{
            click: () => onStopClick?.(stop),
          }}
        >
          <Popup>
            <strong>{stop.name}</strong>
          </Popup>
        </Marker>
      ))}

      {/* Home marker */}
      {homeLocation && (
        <Marker
          position={[homeLocation.lat, homeLocation.lng]}
          icon={homeIcon}
        >
          <Popup>Your Home</Popup>
        </Marker>
      )}
    </MapContainer>
  );
}
