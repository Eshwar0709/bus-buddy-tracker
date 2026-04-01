/**
 * ============================================
 * STOP SELECTION PAGE
 * Two-step onboarding: Step 1 = Home location, Step 2 = Bus stop
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
import { MapPin, Home, ArrowRight, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function StopSelectionPage() {
  const { user, updateUserLocation, isNewUser, clearNewUser } = useAuth();
  const navigateTo = useNavigate();
  const { buses } = useBusSimulation();

  const [step, setStep] = useState(1);
  const [homeLat, setHomeLat] = useState(user?.homeLocation?.lat?.toString() || "17.3616");
  const [homeLng, setHomeLng] = useState(user?.homeLocation?.lng?.toString() || "78.4727");
  const [selectedStopId, setSelectedStopId] = useState(user?.selectedStopId || "stop-7");

  if (!user) return <Navigate to="/login" />;

  const handleNextStep = () => {
    const lat = parseFloat(homeLat);
    const lng = parseFloat(homeLng);
    if (isNaN(lat) || isNaN(lng)) {
      toast.error("Please enter valid coordinates");
      return;
    }
    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      toast.error("Coordinates are out of range");
      return;
    }
    toast.success("Home location set! Now select your bus stop.");
    setStep(2);
  };

  const handleSave = () => {
    const lat = parseFloat(homeLat);
    const lng = parseFloat(homeLng);
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

      {/* Step indicator */}
      <div className="flex items-center gap-3">
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${
          step === 1 ? "bg-primary text-primary-foreground" : "bg-primary/20 text-primary"
        }`}>
          {step > 1 ? <CheckCircle className="h-4 w-4" /> : <span>1</span>}
          Home Location
        </div>
        <ArrowRight className="h-4 w-4 text-muted-foreground" />
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${
          step === 2 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
        }`}>
          <span>2</span> Select Bus Stop
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          {/* STEP 1: Home Location */}
          {step === 1 && (
            <Card className="border-2 border-primary/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Home className="h-5 w-5" /> Step 1: Set Your Home Location
                </CardTitle>
                <CardDescription>
                  Enter the latitude and longitude of your home. You can find these on Google Maps by right-clicking your location.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Latitude</Label>
                    <Input
                      value={homeLat}
                      onChange={(e) => setHomeLat(e.target.value)}
                      placeholder="e.g. 17.3616"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Longitude</Label>
                    <Input
                      value={homeLng}
                      onChange={(e) => setHomeLng(e.target.value)}
                      placeholder="e.g. 78.4727"
                    />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Tip: Open Google Maps → right-click your home → copy coordinates
                </p>
                <Button onClick={handleNextStep} className="w-full">
                  Next: Select Bus Stop <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          )}

          {/* STEP 2: Bus Stop Selection */}
          {step === 2 && (
            <>
              <Card className="bg-primary/5 border border-primary/20">
                <CardContent className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">Home: {homeLat}, {homeLng}</span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setStep(1)}>Edit</Button>
                </CardContent>
              </Card>

              <Card className="border-2 border-primary/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <MapPin className="h-5 w-5" /> Step 2: Select Your Bus Stop
                  </CardTitle>
                  <CardDescription>Choose the stop you typically board from</CardDescription>
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

                  <Button onClick={handleSave} className="w-full">
                    Save & Go to Dashboard <CheckCircle className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Map */}
        <div className="lg:sticky lg:top-20 h-fit">
          <MapView
            buses={buses}
            stops={MOCK_STOPS}
            routes={MOCK_ROUTES}
            homeLocation={{ lat: parseFloat(homeLat) || 17.3616, lng: parseFloat(homeLng) || 78.4727 }}
            selectedStopId={selectedStopId}
            height="600px"
          />
        </div>
      </div>
    </div>
  );
}
