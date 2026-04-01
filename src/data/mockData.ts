/**
 * ============================================
 * MOCK DATA
 * Sample buses, routes, and stops for simulation
 * City: Hyderabad, Telangana, India (Uppal area)
 * ============================================
 */

import { Bus, BusRoute, BusStop } from "@/types";

// ---- BUS STOPS (Uppal area, Hyderabad) ----
export const MOCK_STOPS: BusStop[] = [
  {
    id: "stop-1",
    name: "Uppal Bus Stand",
    location: { lat: 17.3950, lng: 78.5594 },
    routeIds: ["route-1", "route-2"],
  },
  {
    id: "stop-2",
    name: "Uppal Metro Station",
    location: { lat: 17.3988, lng: 78.5565 },
    routeIds: ["route-1"],
  },
  {
    id: "stop-3",
    name: "Habsiguda",
    location: { lat: 17.4060, lng: 78.5340 },
    routeIds: ["route-1", "route-3"],
  },
  {
    id: "stop-4",
    name: "Nacharam",
    location: { lat: 17.4110, lng: 78.5480 },
    routeIds: ["route-2"],
  },
  {
    id: "stop-5",
    name: "Mallapur",
    location: { lat: 17.4180, lng: 78.5620 },
    routeIds: ["route-2", "route-3"],
  },
  {
    id: "stop-6",
    name: "Tarnaka",
    location: { lat: 17.4190, lng: 78.5210 },
    routeIds: ["route-3"],
  },
  {
    id: "stop-7",
    name: "Afzalgunj",
    location: { lat: 17.3616, lng: 78.4727 },
    routeIds: ["route-1", "route-4"],
  },
];

// ---- BUS ROUTES (Hyderabad / Uppal area) ----
export const MOCK_ROUTES: BusRoute[] = [
  {
    id: "route-1",
    name: "Blue Line - Uppal to Habsiguda",
    color: "#3b82f6",
    stops: ["stop-1", "stop-2", "stop-3"],
    path: [
      { lat: 17.3920, lng: 78.5620 },
      { lat: 17.3950, lng: 78.5594 },
      { lat: 17.3970, lng: 78.5580 },
      { lat: 17.3988, lng: 78.5565 },
      { lat: 17.4010, lng: 78.5500 },
      { lat: 17.4030, lng: 78.5440 },
      { lat: 17.4060, lng: 78.5340 },
    ],
  },
  {
    id: "route-2",
    name: "Green Line - Uppal to Mallapur",
    color: "#22c55e",
    stops: ["stop-1", "stop-4", "stop-5"],
    path: [
      { lat: 17.3950, lng: 78.5594 },
      { lat: 17.3980, lng: 78.5590 },
      { lat: 17.4020, lng: 78.5540 },
      { lat: 17.4060, lng: 78.5500 },
      { lat: 17.4110, lng: 78.5480 },
      { lat: 17.4150, lng: 78.5550 },
      { lat: 17.4180, lng: 78.5620 },
    ],
  },
  {
    id: "route-3",
    name: "Red Line - Mallapur to Tarnaka",
    color: "#ef4444",
    stops: ["stop-5", "stop-6", "stop-3"],
    path: [
      { lat: 17.4180, lng: 78.5620 },
      { lat: 17.4170, lng: 78.5550 },
      { lat: 17.4160, lng: 78.5450 },
      { lat: 17.4180, lng: 78.5350 },
      { lat: 17.4190, lng: 78.5210 },
      { lat: 17.4130, lng: 78.5280 },
      { lat: 17.4060, lng: 78.5340 },
    ],
  },
  {
    id: "route-4",
    name: "Yellow Line - Afzalgunj to Uppal",
    color: "#eab308",
    stops: ["stop-7", "stop-3", "stop-1"],
    path: [
      { lat: 17.3616, lng: 78.4727 },
      { lat: 17.3700, lng: 78.4850 },
      { lat: 17.3780, lng: 78.5000 },
      { lat: 17.3860, lng: 78.5150 },
      { lat: 17.4060, lng: 78.5340 },
      { lat: 17.4010, lng: 78.5450 },
      { lat: 17.3950, lng: 78.5594 },
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
    currentLocation: { lat: 17.3940, lng: 78.5600 },
    status: "active",
    driverId: "driver-1",
  },
  {
    id: "bus-2",
    name: "Bus A2",
    routeId: "route-1",
    speed: 25,
    currentLocation: { lat: 17.4020, lng: 78.5480 },
    status: "active",
    driverId: "driver-2",
  },
  {
    id: "bus-3",
    name: "Bus B1",
    routeId: "route-2",
    speed: 35,
    currentLocation: { lat: 17.3960, lng: 78.5590 },
    status: "active",
    driverId: null,
  },
  {
    id: "bus-4",
    name: "Bus C1",
    routeId: "route-3",
    speed: 28,
    currentLocation: { lat: 17.4175, lng: 78.5600 },
    status: "active",
    driverId: null,
  },
  {
    id: "bus-5",
    name: "Bus B2",
    routeId: "route-2",
    speed: 20,
    currentLocation: { lat: 17.4140, lng: 78.5530 },
    status: "delayed",
    driverId: null,
  },
];

// Default user home location (near Afzalgunj, Hyderabad)
export const DEFAULT_HOME: { lat: number; lng: number } = {
  lat: 17.3620,
  lng: 78.4735,
};

// Walking speed in km/h (average person)
export const WALKING_SPEED_KMH = 5;
