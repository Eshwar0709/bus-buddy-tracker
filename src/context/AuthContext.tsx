/**
 * ============================================
 * AUTH CONTEXT
 * Simple localStorage-based authentication
 * For academic demonstration purposes
 * ============================================
 */

import React, { createContext, useContext, useState, useEffect } from "react";
import { User, UserRole, LatLng } from "@/types";
import { DEFAULT_HOME } from "@/data/mockData";

interface AuthContextType {
  user: User | null;
  isNewUser: boolean;
  login: (email: string, password: string) => boolean;
  register: (name: string, email: string, password: string, role: UserRole) => boolean;
  logout: () => void;
  updateUserLocation: (home: LatLng, stopId: string) => void;
  clearNewUser: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Pre-seeded accounts for demo
const DEMO_ACCOUNTS = [
  { id: "admin-1", name: "Admin User", email: "admin@bus.com", password: "admin123", role: "admin" as UserRole, homeLocation: DEFAULT_HOME, selectedStopId: "stop-1" },
  { id: "driver-1", name: "John Driver", email: "driver@bus.com", password: "driver123", role: "driver" as UserRole, homeLocation: DEFAULT_HOME, selectedStopId: "stop-1" },
  { id: "passenger-1", name: "Jane Passenger", email: "user@bus.com", password: "user123", role: "passenger" as UserRole, homeLocation: DEFAULT_HOME, selectedStopId: "stop-1" },
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isNewUser, setIsNewUser] = useState(false);

  // Load user from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("bustrack_user");
    if (saved) {
      setUser(JSON.parse(saved));
    }
  }, []);

  const login = (email: string, password: string): boolean => {
    // Check demo accounts
    const demo = DEMO_ACCOUNTS.find(
      (a) => a.email === email && a.password === password
    );
    if (demo) {
      const u: User = {
        id: demo.id,
        name: demo.name,
        email: demo.email,
        role: demo.role,
        homeLocation: demo.homeLocation,
        selectedStopId: demo.selectedStopId,
      };
      setUser(u);
      localStorage.setItem("bustrack_user", JSON.stringify(u));
      return true;
    }

    // Check registered users
    const users = JSON.parse(localStorage.getItem("bustrack_users") || "[]");
    const found = users.find(
      (u: any) => u.email === email && u.password === password
    );
    if (found) {
      const u: User = {
        id: found.id,
        name: found.name,
        email: found.email,
        role: found.role,
        homeLocation: found.homeLocation || DEFAULT_HOME,
        selectedStopId: found.selectedStopId || "stop-1",
      };
      setUser(u);
      localStorage.setItem("bustrack_user", JSON.stringify(u));
      return true;
    }

    return false;
  };

  const register = (name: string, email: string, password: string, role: UserRole): boolean => {
    const users = JSON.parse(localStorage.getItem("bustrack_users") || "[]");
    if (users.find((u: any) => u.email === email)) return false;

    const newUser = {
      id: `user-${Date.now()}`,
      name,
      email,
      password,
      role,
      homeLocation: DEFAULT_HOME,
      selectedStopId: "stop-1",
    };
    users.push(newUser);
    localStorage.setItem("bustrack_users", JSON.stringify(users));

    const u: User = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      homeLocation: DEFAULT_HOME,
      selectedStopId: "stop-1",
    };
    setUser(u);
    setIsNewUser(true);
    localStorage.setItem("bustrack_user", JSON.stringify(u));
    return true;
  };

  const clearNewUser = () => setIsNewUser(false);

  const logout = () => {
    setUser(null);
    localStorage.removeItem("bustrack_user");
  };

  const updateUserLocation = (home: LatLng, stopId: string) => {
    if (!user) return;
    const updated = { ...user, homeLocation: home, selectedStopId: stopId };
    setUser(updated);
    localStorage.setItem("bustrack_user", JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{ user, isNewUser, login, register, logout, updateUserLocation, clearNewUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
