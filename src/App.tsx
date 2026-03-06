import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { NotificationProvider } from "@/context/NotificationContext";
import Navbar from "@/components/Navbar";
import HomePage from "@/pages/HomePage";
import LoginPage from "@/pages/LoginPage";
import DashboardPage from "@/pages/DashboardPage";
import TrackingPage from "@/pages/TrackingPage";
import StopSelectionPage from "@/pages/StopSelectionPage";
import LeaveTimePage from "@/pages/LeaveTimePage";
import BusComparisonPage from "@/pages/BusComparisonPage";
import AdminDashboard from "@/pages/AdminDashboard";
import DriverDashboard from "@/pages/DriverDashboard";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <NotificationProvider>
            <Navbar />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/tracking" element={<TrackingPage />} />
              <Route path="/stops" element={<StopSelectionPage />} />
              <Route path="/leave-time" element={<LeaveTimePage />} />
              <Route path="/compare" element={<BusComparisonPage />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/driver" element={<DriverDashboard />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </NotificationProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
