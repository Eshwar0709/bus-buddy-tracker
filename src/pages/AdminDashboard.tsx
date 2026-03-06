/**
 * ============================================
 * ADMIN DASHBOARD
 * Manage buses, routes, stops, and monitor live
 * ============================================
 */

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useBusSimulation } from "@/hooks/useBusSimulation";
import { MOCK_STOPS, MOCK_ROUTES } from "@/data/mockData";
import { Navigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MapView from "@/components/MapView";
import { Bus as BusType } from "@/types";
import { Settings, Plus, MapPin, Route } from "lucide-react";
import { toast } from "sonner";

export default function AdminDashboard() {
  const { user } = useAuth();
  const { buses, updateBus, addBus } = useBusSimulation();

  // New bus form
  const [newBusName, setNewBusName] = useState("");
  const [newBusRoute, setNewBusRoute] = useState("route-1");
  const [newBusSpeed, setNewBusSpeed] = useState("30");

  if (!user || user.role !== "admin") return <Navigate to="/login" />;

  const handleAddBus = () => {
    if (!newBusName) {
      toast.error("Enter a bus name");
      return;
    }
    const newBus: BusType = {
      id: `bus-${Date.now()}`,
      name: newBusName,
      routeId: newBusRoute,
      speed: parseInt(newBusSpeed) || 30,
      currentLocation: MOCK_ROUTES.find((r) => r.id === newBusRoute)?.path[0] || { lat: 40.7128, lng: -74.006 },
      status: "active",
      driverId: null,
    };
    addBus(newBus);
    setNewBusName("");
    toast.success(`Bus "${newBusName}" added!`);
  };

  const handleToggleStatus = (busId: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    updateBus(busId, { status: newStatus as any });
    toast.success(`Bus status updated to ${newStatus}`);
  };

  const handleSpeedChange = (busId: string, speed: string) => {
    updateBus(busId, { speed: parseInt(speed) || 30 });
  };

  return (
    <div className="container py-8 space-y-6">
      <div className="flex items-center gap-3">
        <Settings className="h-6 w-6 text-primary" />
        <h1 className="font-display text-2xl font-bold">Admin Dashboard</h1>
      </div>

      {/* Stats row */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-primary">{buses.length}</p>
            <p className="text-sm text-muted-foreground">Total Buses</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-accent">{MOCK_ROUTES.length}</p>
            <p className="text-sm text-muted-foreground">Routes</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-warning">{MOCK_STOPS.length}</p>
            <p className="text-sm text-muted-foreground">Stops</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="buses">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="buses">Buses</TabsTrigger>
          <TabsTrigger value="routes">Routes</TabsTrigger>
          <TabsTrigger value="stops">Stops</TabsTrigger>
          <TabsTrigger value="map">Live Map</TabsTrigger>
        </TabsList>

        {/* BUSES TAB */}
        <TabsContent value="buses" className="space-y-4">
          {/* Add Bus Form */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Plus className="h-5 w-5" /> Add New Bus
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <Label>Bus Name</Label>
                  <Input
                    placeholder="Bus D1"
                    value={newBusName}
                    onChange={(e) => setNewBusName(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label>Route</Label>
                  <Select value={newBusRoute} onValueChange={setNewBusRoute}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {MOCK_ROUTES.map((r) => (
                        <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label>Speed (km/h)</Label>
                  <Input
                    type="number"
                    value={newBusSpeed}
                    onChange={(e) => setNewBusSpeed(e.target.value)}
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={handleAddBus} className="w-full">Add Bus</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bus Table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Route</TableHead>
                    <TableHead>Speed</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {buses.map((bus) => {
                    const route = MOCK_ROUTES.find((r) => r.id === bus.routeId);
                    return (
                      <TableRow key={bus.id}>
                        <TableCell className="font-medium">{bus.name}</TableCell>
                        <TableCell>
                          <span style={{ color: route?.color }}>{route?.name}</span>
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            className="w-20 h-8"
                            defaultValue={bus.speed}
                            onBlur={(e) => handleSpeedChange(bus.id, e.target.value)}
                          />
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {bus.currentLocation.lat.toFixed(4)}, {bus.currentLocation.lng.toFixed(4)}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={bus.status === "active" ? "default" : "destructive"}
                            className="capitalize"
                          >
                            {bus.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleToggleStatus(bus.id, bus.status)}
                          >
                            Toggle
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ROUTES TAB */}
        <TabsContent value="routes">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Route className="h-5 w-5" /> Routes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {MOCK_ROUTES.map((route) => (
                <div key={route.id} className="p-4 rounded-lg bg-secondary">
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ background: route.color }}
                    />
                    <span className="font-semibold">{route.name}</span>
                    <Badge variant="secondary">{route.stops.length} stops</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Stops: {route.stops.map((sid) => MOCK_STOPS.find((s) => s.id === sid)?.name).join(" → ")}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* STOPS TAB */}
        <TabsContent value="stops">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MapPin className="h-5 w-5" /> Stops
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Latitude</TableHead>
                    <TableHead>Longitude</TableHead>
                    <TableHead>Routes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MOCK_STOPS.map((stop) => (
                    <TableRow key={stop.id}>
                      <TableCell className="font-medium">{stop.name}</TableCell>
                      <TableCell>{stop.location.lat.toFixed(4)}</TableCell>
                      <TableCell>{stop.location.lng.toFixed(4)}</TableCell>
                      <TableCell>
                        {stop.routeIds.map((rid) => {
                          const r = MOCK_ROUTES.find((r) => r.id === rid);
                          return (
                            <Badge key={rid} variant="secondary" className="mr-1 text-xs" style={{ color: r?.color }}>
                              {r?.name}
                            </Badge>
                          );
                        })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* MAP TAB */}
        <TabsContent value="map">
          <MapView
            buses={buses}
            stops={MOCK_STOPS}
            routes={MOCK_ROUTES}
            height="calc(100vh - 300px)"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
