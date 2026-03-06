/**
 * ============================================
 * LEAVE-TIME RECOMMENDATION PAGE
 * Shows when user should leave home to catch bus
 * Formula: Leave Time = Bus ETA – User Travel Time
 * ============================================
 */

import { useAuth } from "@/context/AuthContext";
import { useBusSimulation } from "@/hooks/useBusSimulation";
import { MOCK_STOPS, WALKING_SPEED_KMH } from "@/data/mockData";
import { getETAResults, calculateDistance } from "@/utils/calculations";
import { Navigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Clock, Home, MapPin, ArrowRight, AlertTriangle } from "lucide-react";
import { useEffect, useRef } from "react";
import { useNotifications } from "@/context/NotificationContext";

export default function LeaveTimePage() {
  const { user } = useAuth();
  const { buses } = useBusSimulation();
  const { addNotification } = useNotifications();
  const lastNotifiedBus = useRef<string | null>(null);

  // Must call all hooks before conditional returns
  const selectedStop = user
    ? MOCK_STOPS.find((s) => s.id === user.selectedStopId) || MOCK_STOPS[0]
    : MOCK_STOPS[0];
  const homeLocation = user?.homeLocation || { lat: 40.7138, lng: -74.007 };
  const etaResults = getETAResults(buses, selectedStop, homeLocation);
  const distanceToStop = calculateDistance(homeLocation, selectedStop.location);
  const walkTimeMinutes = (distanceToStop / WALKING_SPEED_KMH) * 60;

  // Trigger notification when bus is very close
  useEffect(() => {
    const best = etaResults[0];
    if (best && best.leaveInMinutes <= 2 && best.leaveInMinutes > 0 && lastNotifiedBus.current !== best.busId) {
      lastNotifiedBus.current = best.busId;
      addNotification(
        "🚌 Time to leave!",
        `${best.busName} arrives in ${best.etaMinutes.toFixed(1)} min. Leave now!`,
        "warning"
      );
    }
  }, [etaResults, addNotification]);

  if (!user) return <Navigate to="/login" />;

  return (
    <div className="container py-8 space-y-6 max-w-3xl mx-auto">
      <h1 className="font-display text-2xl font-bold">Leave-Time Recommendation</h1>
      <p className="text-muted-foreground">
        Smart alerts based on bus ETA and your walking distance to the stop.
      </p>

      {/* Info cards */}
      <div className="grid sm:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Home className="h-8 w-8 text-warning" />
            <div>
              <p className="text-xs text-muted-foreground">Distance to Stop</p>
              <p className="font-semibold">{distanceToStop.toFixed(2)} km</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Clock className="h-8 w-8 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Walking Time</p>
              <p className="font-semibold">{walkTimeMinutes.toFixed(1)} min</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Formula explanation */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-display">📐 How It Works</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p><strong>ETA</strong> = Distance(Bus → Stop) ÷ Bus Speed</p>
          <p><strong>Leave Time</strong> = Bus ETA − Walking Time(Home → Stop)</p>
          <p><strong>Walking Speed</strong> = {WALKING_SPEED_KMH} km/h (average)</p>
        </CardContent>
      </Card>

      {/* Recommendations per bus */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-display flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Recommendations for {selectedStop.name}
          </CardTitle>
          <CardDescription>Sorted by earliest arrival</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {etaResults.length === 0 ? (
            <p className="text-muted-foreground text-sm">No buses serving this stop currently.</p>
          ) : (
            etaResults.map((eta, idx) => {
              const urgencyPercent = Math.max(0, Math.min(100, 100 - eta.leaveInMinutes * 10));
              const isUrgent = eta.leaveInMinutes <= 2;
              const shouldLeaveNow = eta.leaveInMinutes <= 0;

              return (
                <div
                  key={eta.busId}
                  className={`p-4 rounded-lg border ${
                    isUrgent ? "border-warning bg-warning/5" : "border-border"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{eta.busName}</span>
                      {idx === 0 && <Badge>Fastest</Badge>}
                      {isUrgent && (
                        <Badge variant="destructive" className="flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" /> Urgent
                        </Badge>
                      )}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {eta.distanceKm} km away
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-3 text-center">
                    <div>
                      <p className="text-xs text-muted-foreground">Bus ETA</p>
                      <p className="font-bold text-lg">{eta.etaMinutes.toFixed(1)}</p>
                      <p className="text-xs text-muted-foreground">minutes</p>
                    </div>
                    <div className="flex items-center justify-center">
                      <ArrowRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Leave In</p>
                      <p className={`font-bold text-lg ${shouldLeaveNow ? "text-destructive" : isUrgent ? "text-warning" : "text-success"}`}>
                        {shouldLeaveNow ? "NOW!" : eta.leaveInMinutes.toFixed(1)}
                      </p>
                      {!shouldLeaveNow && <p className="text-xs text-muted-foreground">minutes</p>}
                    </div>
                  </div>

                  <Progress value={urgencyPercent} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">
                    {shouldLeaveNow
                      ? "⚠️ You should have already left! Run!"
                      : isUrgent
                      ? "⏰ Leave soon to catch this bus"
                      : "✅ You have time, no rush"}
                  </p>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>
    </div>
  );
}
