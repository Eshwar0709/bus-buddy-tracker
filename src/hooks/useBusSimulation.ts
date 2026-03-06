/**
 * ============================================
 * BUS SIMULATION HOOK
 * Simulates real-time bus movement along routes
 * Updates bus positions every 2 seconds
 * ============================================
 */

import { useState, useEffect, useCallback } from "react";
import { Bus } from "@/types";
import { MOCK_BUSES, MOCK_ROUTES } from "@/data/mockData";

/**
 * Move a bus along its route path
 * Each tick moves the bus slightly toward the next waypoint
 */
function moveBusAlongRoute(bus: Bus): Bus {
  const route = MOCK_ROUTES.find((r) => r.id === bus.routeId);
  if (!route || route.path.length < 2) return bus;

  // Find closest path segment
  let closestIdx = 0;
  let closestDist = Infinity;

  for (let i = 0; i < route.path.length; i++) {
    const dx = route.path[i].lat - bus.currentLocation.lat;
    const dy = route.path[i].lng - bus.currentLocation.lng;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < closestDist) {
      closestDist = dist;
      closestIdx = i;
    }
  }

  // Target the next waypoint (loop back to start)
  const targetIdx = (closestIdx + 1) % route.path.length;
  const target = route.path[targetIdx];

  // Move toward target (small step based on speed)
  const step = 0.0003 * (bus.speed / 30); // scale step by speed
  const dx = target.lat - bus.currentLocation.lat;
  const dy = target.lng - bus.currentLocation.lng;
  const dist = Math.sqrt(dx * dx + dy * dy);

  if (dist < step) {
    // Reached waypoint, snap to it
    return { ...bus, currentLocation: { ...target } };
  }

  // Move toward target
  const ratio = step / dist;
  return {
    ...bus,
    currentLocation: {
      lat: bus.currentLocation.lat + dx * ratio,
      lng: bus.currentLocation.lng + dy * ratio,
    },
  };
}

export function useBusSimulation() {
  const [buses, setBuses] = useState<Bus[]>(MOCK_BUSES);

  // Simulation tick: move all active buses
  const tick = useCallback(() => {
    setBuses((prev) =>
      prev.map((bus) => {
        if (bus.status === "inactive") return bus;
        return moveBusAlongRoute(bus);
      })
    );
  }, []);

  // Run simulation every 2 seconds
  useEffect(() => {
    const interval = setInterval(tick, 2000);
    return () => clearInterval(interval);
  }, [tick]);

  // Admin: update a bus
  const updateBus = useCallback((busId: string, updates: Partial<Bus>) => {
    setBuses((prev) =>
      prev.map((b) => (b.id === busId ? { ...b, ...updates } : b))
    );
  }, []);

  // Admin: add a bus
  const addBus = useCallback((bus: Bus) => {
    setBuses((prev) => [...prev, bus]);
  }, []);

  return { buses, updateBus, addBus };
}
