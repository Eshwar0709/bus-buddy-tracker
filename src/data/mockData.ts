/**
 * ============================================
 * MOCK DATA
 * Sample buses, routes, and stops for simulation
 * City: Sample city centered around coordinates
 * ============================================
 */

import { Bus, BusRoute, BusStop } from "@/types";

// ---- BUS STOPS ----
export const MOCK_STOPS: BusStop[] = [
  {
    id: "stop-1",
    name: "Central Station",
    location: { lat: 40.7128, lng: -74.006 },
    routeIds: ["route-1", "route-2"],
  },
  {
    id: "stop-2",
    name: "Market Square",
    location: { lat: 40.7158, lng: -74.0015 },
    routeIds: ["route-1"],
  },
  {
    id: "stop-3",
    name: "University Campus",
    location: { lat: 40.7195, lng: -73.9975 },
    routeIds: ["route-1", "route-3"],
  },
  {
    id: "stop-4",
    name: "City Park",
    location: { lat: 40.7225, lng: -74.004 },
    routeIds: ["route-2"],
  },
  {
    id: "stop-5",
    name: "Hospital",
    location: { lat: 40.7105, lng: -74.0105 },
    routeIds: ["route-2", "route-3"],
  },
  {
    id: "stop-6",
    name: "Shopping Mall",
    location: { lat: 40.718, lng: -74.009 },
    routeIds: ["route-3"],
  },
];

// ---- BUS ROUTES ----
export const MOCK_ROUTES: BusRoute[] = [
  {
    id: "route-1",
    name: "Blue Line",
    color: "#3b82f6",
    stops: ["stop-1", "stop-2", "stop-3"],
    path: [
      { lat: 40.71, lng: -74.01 },
      { lat: 40.7128, lng: -74.006 },
      { lat: 40.7145, lng: -74.003 },
      { lat: 40.7158, lng: -74.0015 },
      { lat: 40.7175, lng: -73.999 },
      { lat: 40.7195, lng: -73.9975 },
    ],
  },
  {
    id: "route-2",
    name: "Green Line",
    color: "#22c55e",
    stops: ["stop-1", "stop-4", "stop-5"],
    path: [
      { lat: 40.7085, lng: -74.012 },
      { lat: 40.7105, lng: -74.0105 },
      { lat: 40.7128, lng: -74.006 },
      { lat: 40.716, lng: -74.005 },
      { lat: 40.72, lng: -74.0045 },
      { lat: 40.7225, lng: -74.004 },
    ],
  },
  {
    id: "route-3",
    name: "Red Line",
    color: "#ef4444",
    stops: ["stop-5", "stop-6", "stop-3"],
    path: [
      { lat: 40.7105, lng: -74.0105 },
      { lat: 40.714, lng: -74.01 },
      { lat: 40.718, lng: -74.009 },
      { lat: 40.719, lng: -74.005 },
      { lat: 40.7195, lng: -73.9975 },
    ],
  },
];

// ---- BUSES ----
export const MOCK_BUSES: Bus[] = [
  {
    id: "bus-1",
    name: "Bus A1",
    routeId: "route-1",
    speed: 30,
    currentLocation: { lat: 40.711, lng: -74.009 },
    status: "active",
    driverId: "driver-1",
  },
  {
    id: "bus-2",
    name: "Bus A2",
    routeId: "route-1",
    speed: 25,
    currentLocation: { lat: 40.716, lng: -74.002 },
    status: "active",
    driverId: "driver-2",
  },
  {
    id: "bus-3",
    name: "Bus B1",
    routeId: "route-2",
    speed: 35,
    currentLocation: { lat: 40.709, lng: -74.011 },
    status: "active",
    driverId: null,
  },
  {
    id: "bus-4",
    name: "Bus C1",
    routeId: "route-3",
    speed: 28,
    currentLocation: { lat: 40.712, lng: -74.01 },
    status: "active",
    driverId: null,
  },
  {
    id: "bus-5",
    name: "Bus B2",
    routeId: "route-2",
    speed: 20,
    currentLocation: { lat: 40.721, lng: -74.0042 },
    status: "delayed",
    driverId: null,
  },
];

// Default user home location
export const DEFAULT_HOME: { lat: number; lng: number } = {
  lat: 40.7138,
  lng: -74.0070,
};

// Walking speed in km/h (average person)
export const WALKING_SPEED_KMH = 5;
