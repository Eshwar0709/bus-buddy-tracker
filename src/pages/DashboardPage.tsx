/**
 * ============================================
 * USER DASHBOARD
 * Overview for passengers with ETA, leave time,
 * and quick access to features
 * ============================================
 */

import { useAuth } from "@/context/AuthContext";
import { useBusSimulation } from "@/hooks/useBusSimulation";
import { MOCK_STOPS, MOCK_ROUTES } from "@/data/mockData";
import { getETAResults } from "@/utils/calculations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link, Navigate } from "react-router-dom";
import MapView from "@/components/MapView";
import { Clock, MapPin, Bus, ArrowRight } from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();
  const { buses } = useBusSimulation();

  if (!user) return <Navigate to="/login" />;

  const selectedStop = MOCK_STOPS.find((s) => s.id === user.selectedStopId) || MOCK_STOPS[0];
  const homeLocation = user.homeLocation || { lat: 40.7138, lng: -74.007 };
  const etaResults = getETAResults(buses, selectedStop, homeLocation);
  const bestBus = etaResults[0];

  return (
    <div className="container py-8 space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Welcome, {user.name}</h1>
        <p className="text-muted-foreground">Here's your bus tracking overview</p>
      </div>

      {/* Quick Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <MapPin className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Selected Stop</p>
              <p className="font-semibold text-sm">{selectedStop.name}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent/10">
              <Bus className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Best Bus</p>
              <p className="font-semibold text-sm">{bestBus ? bestBus.busName : "N/A"}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-warning/10">
              <Clock className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">ETA</p>
              <p className="font-semibold text-sm">
                {bestBus ? `${bestBus.etaMinutes.toFixed(1)} min` : "N/A"}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-success/10">
              <ArrowRight className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Leave In</p>
              <p className="font-semibold text-sm">
                {bestBus
                  ? bestBus.leaveInMinutes > 0
                    ? `${bestBus.leaveInMinutes.toFixed(1)} min`
                    : "Leave now!"
                  : "N/A"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Map Preview */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-display">Live Bus Map</CardTitle>
        </CardHeader>
        <CardContent>
          <MapView
            buses={buses}
            stops={MOCK_STOPS}
            routes={MOCK_ROUTES}
            homeLocation={homeLocation}
            selectedStopId={user.selectedStopId}
            height="350px"
          />
        </CardContent>
      </Card>

      {/* Buses at stop */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-display">
              Buses at {selectedStop.name}
            </CardTitle>
            <Link to="/compare">
              <Button variant="outline" size="sm">
                Compare All <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {etaResults.length === 0 ? (
            <p className="text-muted-foreground text-sm">No buses currently serving this stop.</p>
          ) : (
            <div className="space-y-3">
              {etaResults.map((eta, idx) => (
                <div
                  key={eta.busId}
                  className="flex items-center justify-between p-3 rounded-lg bg-secondary"
                >
                  <div className="flex items-center gap-3">
                    <Badge variant={idx === 0 ? "default" : "secondary"}>
                      {idx === 0 ? "Recommended" : `#${idx + 1}`}
                    </Badge>
                    <div>
                      <p className="font-medium text-sm">{eta.busName}</p>
                      <p className="text-xs text-muted-foreground">
                        {eta.distanceKm} km away
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-sm">{eta.etaMinutes.toFixed(1)} min</p>
                    <p className="text-xs text-muted-foreground">
                      Leave in {eta.leaveInMinutes > 0 ? `${eta.leaveInMinutes.toFixed(1)} min` : "now!"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Links */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Link to="/tracking">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4 text-center">
              <MapPin className="h-8 w-8 mx-auto mb-2 text-primary" />
              <p className="font-medium text-sm">Full Map View</p>
            </CardContent>
          </Card>
        </Link>
        <Link to="/leave-time">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4 text-center">
              <Clock className="h-8 w-8 mx-auto mb-2 text-warning" />
              <p className="font-medium text-sm">Leave-Time Planner</p>
            </CardContent>
          </Card>
        </Link>
        <Link to="/stops">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4 text-center">
              <Bus className="h-8 w-8 mx-auto mb-2 text-accent" />
              <p className="font-medium text-sm">Change Stop</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
