/**
 * ============================================
 * BUS TRACKING MAP PAGE
 * Full-screen map showing all buses in real time
 * ============================================
 */

import { useAuth } from "@/context/AuthContext";
import { useBusSimulation } from "@/hooks/useBusSimulation";
import { MOCK_STOPS, MOCK_ROUTES } from "@/data/mockData";
import { calculateETA } from "@/utils/calculations";
import MapView from "@/components/MapView";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function TrackingPage() {
  const { user } = useAuth();
  const { buses } = useBusSimulation();

  return (
    <div className="container py-6 space-y-4">
      <h1 className="font-display text-2xl font-bold">Live Bus Tracking</h1>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Map - takes 2 cols on large screens */}
        <div className="lg:col-span-2">
          <MapView
            buses={buses}
            stops={MOCK_STOPS}
            routes={MOCK_ROUTES}
            homeLocation={user?.homeLocation}
            selectedStopId={user?.selectedStopId}
            height="calc(100vh - 200px)"
          />
        </div>

        {/* Sidebar - bus list */}
        <Card className="h-fit max-h-[calc(100vh-200px)] overflow-auto">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-display">Active Buses</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {buses.map((bus) => {
              const route = MOCK_ROUTES.find((r) => r.id === bus.routeId);
              // Find nearest stop ETA
              const stopsOnRoute = MOCK_STOPS.filter((s) =>
                s.routeIds.includes(bus.routeId)
              );
              const nearestStop = stopsOnRoute.reduce(
                (best, stop) => {
                  const eta = calculateETA(bus, stop);
                  return eta < best.eta ? { stop, eta } : best;
                },
                { stop: stopsOnRoute[0], eta: Infinity }
              );

              return (
                <div
                  key={bus.id}
                  className="p-3 rounded-lg bg-secondary space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{bus.name}</span>
                    <Badge
                      variant={bus.status === "active" ? "default" : "destructive"}
                      className="text-xs capitalize"
                    >
                      {bus.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Route:{" "}
                    <span style={{ color: route?.color }} className="font-medium">
                      {route?.name || "Unknown"}
                    </span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Speed: {bus.speed} km/h
                  </p>
                  {nearestStop.stop && (
                    <p className="text-xs text-muted-foreground">
                      Next: {nearestStop.stop.name} ({nearestStop.eta.toFixed(1)} min)
                    </p>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
