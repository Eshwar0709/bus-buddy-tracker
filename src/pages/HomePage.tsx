/**
 * ============================================
 * HOME PAGE
 * Landing page with hero section
 * ============================================
 */

import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Bus, MapPin, Clock, Bell, BarChart3, Shield } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  { icon: MapPin, title: "Real-Time Tracking", desc: "See buses moving live on the map with simulated GPS" },
  { icon: Clock, title: "Smart ETA", desc: "Get accurate arrival times using distance & speed formulas" },
  { icon: Bell, title: "Leave-Time Alerts", desc: "Know exactly when to leave home to catch your bus" },
  { icon: BarChart3, title: "Bus Comparison", desc: "Compare all buses for your stop and pick the fastest" },
  { icon: Bus, title: "Multi-Route Support", desc: "Track buses across multiple routes and stops" },
  { icon: Shield, title: "Role-Based Access", desc: "Separate dashboards for passengers, drivers, and admins" },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="container py-20 md:py-32 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Bus className="h-4 w-4" />
            Academic Project — Bus Tracking System
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Real-Time Bus Tracking
            <br />
            <span className="text-primary">& Smart Reminders</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Track buses in real time, get estimated arrival times, and receive smart
            distance-based reminders telling you exactly when to leave home.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/login">
              <Button size="lg" className="font-semibold">
                Get Started
              </Button>
            </Link>
            <Link to="/tracking">
              <Button variant="outline" size="lg">
                View Live Map
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="container pb-20">
        <h2 className="font-display text-2xl font-bold text-center mb-10">Key Features</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <Card className="h-full hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <f.icon className="h-10 w-10 text-primary mb-4" />
                  <h3 className="font-display font-semibold text-lg mb-2">{f.title}</h3>
                  <p className="text-sm text-muted-foreground">{f.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Demo Credentials */}
      <section className="container pb-20">
        <Card className="max-w-lg mx-auto">
          <CardContent className="p-6">
            <h3 className="font-display font-bold text-lg mb-4">Demo Login Credentials</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between p-2 bg-secondary rounded-md">
                <span className="font-medium">Passenger:</span>
                <span className="text-muted-foreground">user@bus.com / user123</span>
              </div>
              <div className="flex justify-between p-2 bg-secondary rounded-md">
                <span className="font-medium">Admin:</span>
                <span className="text-muted-foreground">admin@bus.com / admin123</span>
              </div>
              <div className="flex justify-between p-2 bg-secondary rounded-md">
                <span className="font-medium">Driver:</span>
                <span className="text-muted-foreground">driver@bus.com / driver123</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Future Scope */}
      <section className="container pb-20">
        <h2 className="font-display text-2xl font-bold text-center mb-6">Future Scope</h2>
        <div className="max-w-2xl mx-auto text-muted-foreground text-sm space-y-2">
          <p>• <strong>IoT GPS Integration:</strong> Replace simulated coordinates with real GPS hardware modules.</p>
          <p>• <strong>Mobile App:</strong> Extend to React Native for native iOS/Android experience.</p>
          <p>• <strong>Push Notifications:</strong> Integrate Firebase Cloud Messaging for real push alerts.</p>
          <p>• <strong>Route Optimization:</strong> Use AI/ML to predict traffic and optimize routes.</p>
          <p>• <strong>Payment Integration:</strong> Add digital ticketing and fare payment.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container text-center text-sm text-muted-foreground">
          <p>Real-Time Bus Tracking System — Academic Student Project</p>
        </div>
      </footer>
    </div>
  );
}
