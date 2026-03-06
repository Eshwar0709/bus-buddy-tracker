/**
 * ============================================
 * TYPE DEFINITIONS
 * All data models for the Bus Tracking System
 * ============================================
 */

// Geographic coordinates
export interface LatLng {
  lat: number;
  lng: number;
}

// User roles in the system
export type UserRole = "passenger" | "admin" | "driver";

// User model
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  homeLocation: LatLng | null;
  selectedStopId: string | null;
}

// Bus model
export interface Bus {
  id: string;
  name: string;
  routeId: string;
  speed: number; // km/h
  currentLocation: LatLng;
  status: "active" | "inactive" | "delayed";
  driverId: string | null;
}

// Bus Stop model
export interface BusStop {
  id: string;
  name: string;
  location: LatLng;
  routeIds: string[];
}

// Route model
export interface BusRoute {
  id: string;
  name: string;
  color: string;
  stops: string[]; // stop IDs in order
  path: LatLng[]; // coordinates for the route line
}

// ETA calculation result
export interface ETAResult {
  busId: string;
  busName: string;
  distanceKm: number;
  etaMinutes: number;
  leaveInMinutes: number; // when user should leave home
}

// Notification model
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "success";
  timestamp: Date;
  read: boolean;
}
