/**
 * ============================================
 * STOP SELECTION PAGE
 * User picks home location and bus stop
 * ============================================
 */

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { MOCK_STOPS } from "@/data/mockData";
import { Navigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import MapView from "@/components/MapView";
import { MOCK_ROUTES } from "@/data/mockData";
import { useBusSimulation } from "@/hooks/useBusSimulation";
import { MapPin, Home } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function StopSelectionPage() {
  const { user, updateUserLocation, isNewUser, clearNewUser } = useAuth();
  const navigateTo = useNavigate();
  const { buses } = useBusSimulation();

  const [homeLat, setHomeLat] = useState(user?.homeLocation?.lat?.toString() || "40.7138");
  const [homeLng, setHomeLng] = useState(user?.homeLocation?.lng?.toString() || "-74.007");
  const [selectedStopId, setSelectedStopId] = useState(user?.selectedStopId || "stop-1");

  if (!user) return <Navigate to="/login" />;

  const handleSave = () => {
    const lat = parseFloat(homeLat);
    const lng = parseFloat(homeLng);
    if (isNaN(lat) || isNaN(lng)) {
      toast.error("Please enter valid coordinates");
      return;
    }
    updateUserLocation({ lat, lng }, selectedStopId);
    toast.success("Location settings saved!");
    if (isNewUser) {
      clearNewUser();
      navigateTo("/dashboard");
    }
  };

  return (
    <div className="container py-8 space-y-6">
      <h1 className="font-display text-2xl font-bold">Location Setup</h1>
      <p className="text-muted-foreground">Set your home location and select your bus stop.</p>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Settings */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Home className="h-5 w-5" /> Home Location
              </CardTitle>
              <CardDescription>Enter your home coordinates (or click on the map)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Latitude</Label>
                  <Input value={homeLat} onChange={(e) => setHomeLat(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Longitude</Label>
                  <Input value={homeLng} onChange={(e) => setHomeLng(e.target.value)} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <MapPin className="h-5 w-5" /> Select Bus Stop
              </CardTitle>
              <CardDescription>Choose which stop you typically use</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select value={selectedStopId} onValueChange={setSelectedStopId}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MOCK_STOPS.map((stop) => (
                    <SelectItem key={stop.id} value={stop.id}>
                      {stop.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button onClick={handleSave} className="w-full">
                Save Settings
              </Button>
            </CardContent>
          </Card>

          {/* Stops list */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">All Stops</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {MOCK_STOPS.map((stop) => (
                  <div
                    key={stop.id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedStopId === stop.id
                        ? "bg-primary/10 border border-primary/30"
                        : "bg-secondary hover:bg-secondary/80"
                    }`}
                    onClick={() => setSelectedStopId(stop.id)}
                  >
                    <p className="font-medium text-sm">{stop.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {stop.location.lat.toFixed(4)}, {stop.location.lng.toFixed(4)}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Map */}
        <div className="lg:sticky lg:top-20 h-fit">
          <MapView
            buses={buses}
            stops={MOCK_STOPS}
            routes={MOCK_ROUTES}
            homeLocation={{ lat: parseFloat(homeLat) || 40.7138, lng: parseFloat(homeLng) || -74.007 }}
            selectedStopId={selectedStopId}
            height="600px"
          />
        </div>
      </div>
    </div>
  );
}
