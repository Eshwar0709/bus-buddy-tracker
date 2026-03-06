/**
 * ============================================
 * BUS COMPARISON PAGE
 * Compare all buses serving a selected stop
 * ============================================
 */

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useBusSimulation } from "@/hooks/useBusSimulation";
import { MOCK_STOPS, MOCK_ROUTES } from "@/data/mockData";
import { getETAResults } from "@/utils/calculations";
import { Navigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trophy, Clock, MapPin } from "lucide-react";

export default function BusComparisonPage() {
  const { user } = useAuth();
  const { buses } = useBusSimulation();
  const [stopId, setStopId] = useState(user?.selectedStopId || "stop-1");

  if (!user) return <Navigate to="/login" />;

  const selectedStop = MOCK_STOPS.find((s) => s.id === stopId) || MOCK_STOPS[0];
  const homeLocation = user.homeLocation || { lat: 40.7138, lng: -74.007 };
  const etaResults = getETAResults(buses, selectedStop, homeLocation);

  return (
    <div className="container py-8 space-y-6 max-w-4xl mx-auto">
      <h1 className="font-display text-2xl font-bold">Bus Comparison</h1>
      <p className="text-muted-foreground">
        Compare all buses for a stop and find the fastest one.
      </p>

      {/* Stop selector */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <MapPin className="h-5 w-5 text-primary" />
            <div className="flex-1">
              <Select value={stopId} onValueChange={setStopId}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MOCK_STOPS.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comparison table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-display flex items-center gap-2">
            <Trophy className="h-5 w-5 text-warning" />
            Comparison Results — {selectedStop.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {etaResults.length === 0 ? (
            <p className="text-muted-foreground text-sm py-4">
              No buses currently serving this stop.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rank</TableHead>
                  <TableHead>Bus</TableHead>
                  <TableHead>Route</TableHead>
                  <TableHead>Distance</TableHead>
                  <TableHead>ETA</TableHead>
                  <TableHead>Leave In</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {etaResults.map((eta, idx) => {
                  const bus = buses.find((b) => b.id === eta.busId);
                  const route = MOCK_ROUTES.find((r) => r.id === bus?.routeId);

                  return (
                    <TableRow key={eta.busId}>
                      <TableCell>
                        {idx === 0 ? (
                          <Badge className="bg-warning text-warning-foreground">
                            🏆 Best
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground">#{idx + 1}</span>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">{eta.busName}</TableCell>
                      <TableCell>
                        <span style={{ color: route?.color }} className="font-medium">
                          {route?.name}
                        </span>
                      </TableCell>
                      <TableCell>{eta.distanceKm} km</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {eta.etaMinutes.toFixed(1)} min
                        </div>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`font-semibold ${
                            eta.leaveInMinutes <= 0
                              ? "text-destructive"
                              : eta.leaveInMinutes <= 2
                              ? "text-warning"
                              : "text-success"
                          }`}
                        >
                          {eta.leaveInMinutes <= 0
                            ? "Now!"
                            : `${eta.leaveInMinutes.toFixed(1)} min`}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={bus?.status === "active" ? "default" : "destructive"}
                          className="capitalize text-xs"
                        >
                          {bus?.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Best bus recommendation card */}
      {etaResults.length > 0 && (
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="p-6 text-center">
            <Trophy className="h-10 w-10 text-warning mx-auto mb-3" />
            <h3 className="font-display text-xl font-bold mb-1">
              Recommended: {etaResults[0].busName}
            </h3>
            <p className="text-muted-foreground">
              Arrives in <strong>{etaResults[0].etaMinutes.toFixed(1)} minutes</strong> •{" "}
              {etaResults[0].leaveInMinutes > 0
                ? `Leave home in ${etaResults[0].leaveInMinutes.toFixed(1)} minutes`
                : "Leave now!"}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
