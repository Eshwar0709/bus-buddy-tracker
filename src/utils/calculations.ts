/**
 * ============================================
 * CALCULATION UTILITIES
 * Distance, ETA, and leave-time formulas
 * ============================================
 */

import { LatLng, Bus, BusStop, ETAResult } from "@/types";
import { WALKING_SPEED_KMH } from "@/data/mockData";

/**
 * Calculate distance between two points using Haversine formula
 * Returns distance in kilometers
 */
export function calculateDistance(point1: LatLng, point2: LatLng): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRadians(point2.lat - point1.lat);
  const dLng = toRadians(point2.lng - point1.lng);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(point1.lat)) *
      Math.cos(toRadians(point2.lat)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Calculate ETA for a bus to reach a stop
 * Formula: ETA = Distance / Speed
 * Returns time in minutes
 */
export function calculateETA(bus: Bus, stop: BusStop): number {
  const distanceKm = calculateDistance(bus.currentLocation, stop.location);
  if (bus.speed <= 0) return Infinity;
  const timeHours = distanceKm / bus.speed;
  return timeHours * 60; // convert to minutes
}

/**
 * Calculate when user should leave home to catch the bus
 * Formula: Leave Time = Bus ETA - User Travel Time to Stop
 */
export function calculateLeaveTime(
  homeLocation: LatLng,
  stop: BusStop,
  busEtaMinutes: number
): number {
  const distanceToStop = calculateDistance(homeLocation, stop.location);
  const walkTimeMinutes = (distanceToStop / WALKING_SPEED_KMH) * 60;
  return busEtaMinutes - walkTimeMinutes;
}

/**
 * Get full ETA results for all buses serving a stop
 * Sorted by ETA (fastest first)
 */
export function getETAResults(
  buses: Bus[],
  stop: BusStop,
  homeLocation: LatLng
): ETAResult[] {
  return buses
    .filter((bus) => bus.status !== "inactive")
    .filter((bus) => stop.routeIds.includes(bus.routeId))
    .map((bus) => {
      const distanceKm = calculateDistance(bus.currentLocation, stop.location);
      const etaMinutes = calculateETA(bus, stop);
      const leaveInMinutes = calculateLeaveTime(homeLocation, stop, etaMinutes);

      return {
        busId: bus.id,
        busName: bus.name,
        distanceKm: Math.round(distanceKm * 100) / 100,
        etaMinutes: Math.round(etaMinutes * 10) / 10,
        leaveInMinutes: Math.round(leaveInMinutes * 10) / 10,
      };
    })
    .sort((a, b) => a.etaMinutes - b.etaMinutes);
}
