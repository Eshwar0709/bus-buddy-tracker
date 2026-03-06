/**
 * ============================================
 * NAVBAR COMPONENT
 * Main navigation bar with role-based links
 * ============================================
 */

import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useNotifications } from "@/context/NotificationContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bus, Bell, LogOut, User, Menu } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { unreadCount, notifications, markAsRead } = useNotifications();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navLinks = user
    ? user.role === "admin"
      ? [
          { to: "/admin", label: "Admin Dashboard" },
          { to: "/tracking", label: "Live Map" },
        ]
      : user.role === "driver"
      ? [
          { to: "/driver", label: "Driver Panel" },
          { to: "/tracking", label: "Live Map" },
        ]
      : [
          { to: "/dashboard", label: "Dashboard" },
          { to: "/tracking", label: "Live Map" },
          { to: "/stops", label: "Stops" },
          { to: "/leave-time", label: "Leave Time" },
          { to: "/compare", label: "Compare" },
        ]
    : [];

  return (
    <nav className="sticky top-0 z-50 glass-card border-b">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold text-primary">
          <Bus className="h-6 w-6" />
          <span className="hidden sm:inline">BusTracker</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {user && (
            <>
              {/* Notifications */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs bg-destructive text-destructive-foreground">
                        {unreadCount}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-sm text-muted-foreground text-center">
                      No notifications
                    </div>
                  ) : (
                    notifications.slice(0, 5).map((n) => (
                      <DropdownMenuItem
                        key={n.id}
                        onClick={() => markAsRead(n.id)}
                        className="flex flex-col items-start gap-1 p-3"
                      >
                        <span className="font-medium text-sm">{n.title}</span>
                        <span className="text-xs text-muted-foreground">{n.message}</span>
                      </DropdownMenuItem>
                    ))
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* User menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <div className="px-3 py-2 border-b">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
                  </div>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}

          {!user && (
            <Link to="/login">
              <Button>Login</Button>
            </Link>
          )}

          {/* Mobile menu toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="md:hidden border-t bg-card p-4 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
