/**
 * ============================================
 * DRIVER DASHBOARD
 * Update bus location, send delay notifications
 * ============================================
 */

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useBusSimulation } from "@/hooks/useBusSimulation";
import { useNotifications } from "@/context/NotificationContext";
import { MOCK_ROUTES } from "@/data/mockData";
import { Navigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Truck, MapPin, AlertTriangle, Send } from "lucide-react";
import { toast } from "sonner";

export default function DriverDashboard() {
  const { user } = useAuth();
  const { buses, updateBus } = useBusSimulation();
  const { addNotification } = useNotifications();

  const [selectedBusId, setSelectedBusId] = useState(buses[0]?.id || "");
  const [manualLat, setManualLat] = useState("");
  const [manualLng, setManualLng] = useState("");
  const [delayMessage, setDelayMessage] = useState("");

  if (!user || user.role !== "driver") return <Navigate to="/login" />;

  const selectedBus = buses.find((b) => b.id === selectedBusId);

  const handleUpdateLocation = () => {
    const lat = parseFloat(manualLat);
    const lng = parseFloat(manualLng);
    if (isNaN(lat) || isNaN(lng)) {
      toast.error("Enter valid coordinates");
      return;
    }
    updateBus(selectedBusId, { currentLocation: { lat, lng } });
    toast.success("Bus location updated!");
    setManualLat("");
    setManualLng("");
  };

  const handleSendDelay = () => {
    if (!delayMessage.trim()) {
      toast.error("Enter a delay message");
      return;
    }
    updateBus(selectedBusId, { status: "delayed" });
    addNotification(
      `🚌 ${selectedBus?.name} Delay`,
      delayMessage,
      "warning"
    );
    toast.success("Delay notification sent to passengers!");
    setDelayMessage("");
  };

  return (
    <div className="container py-8 space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-3">
        <Truck className="h-6 w-6 text-primary" />
        <h1 className="font-display text-2xl font-bold">Driver Dashboard</h1>
      </div>

      {/* Select bus */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Select Your Bus</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedBusId} onValueChange={setSelectedBusId}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a bus" />
            </SelectTrigger>
            <SelectContent>
              {buses.map((b) => (
                <SelectItem key={b.id} value={b.id}>
                  {b.name} ({MOCK_ROUTES.find((r) => r.id === b.routeId)?.name})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedBus && (
            <div className="mt-4 p-3 bg-secondary rounded-lg space-y-1">
              <p className="text-sm"><strong>Bus:</strong> {selectedBus.name}</p>
              <p className="text-sm"><strong>Route:</strong> {MOCK_ROUTES.find((r) => r.id === selectedBus.routeId)?.name}</p>
              <p className="text-sm"><strong>Speed:</strong> {selectedBus.speed} km/h</p>
              <p className="text-sm">
                <strong>Status: </strong>
                <Badge variant={selectedBus.status === "active" ? "default" : "destructive"} className="capitalize">
                  {selectedBus.status}
                </Badge>
              </p>
              <p className="text-sm"><strong>Location:</strong> {selectedBus.currentLocation.lat.toFixed(4)}, {selectedBus.currentLocation.lng.toFixed(4)}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Update Location */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <MapPin className="h-5 w-5" /> Update Location Manually
          </CardTitle>
          <CardDescription>Enter GPS coordinates to update bus position</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>Latitude</Label>
              <Input
                placeholder="40.7128"
                value={manualLat}
                onChange={(e) => setManualLat(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label>Longitude</Label>
              <Input
                placeholder="-74.006"
                value={manualLng}
                onChange={(e) => setManualLng(e.target.value)}
              />
            </div>
          </div>
          <Button onClick={handleUpdateLocation} className="w-full">
            <MapPin className="h-4 w-4 mr-2" /> Update Location
          </Button>
        </CardContent>
      </Card>

      {/* Send Delay */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-warning" /> Send Delay Notification
          </CardTitle>
          <CardDescription>Notify passengers about delays</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="e.g. Bus delayed by 10 minutes due to traffic"
            value={delayMessage}
            onChange={(e) => setDelayMessage(e.target.value)}
          />
          <Button onClick={handleSendDelay} variant="destructive" className="w-full">
            <Send className="h-4 w-4 mr-2" /> Send Notification
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
