/**
 * ============================================
 * NOTIFICATION CONTEXT
 * Manages in-app notifications and alerts
 * ============================================
 */

import React, { createContext, useContext, useState, useCallback } from "react";
import { Notification } from "@/types";

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (title: string, message: string, type?: Notification["type"]) => void;
  markAsRead: (id: string) => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback(
    (title: string, message: string, type: Notification["type"] = "info") => {
      const n: Notification = {
        id: `notif-${Date.now()}`,
        title,
        message,
        type,
        timestamp: new Date(),
        read: false,
      };
      setNotifications((prev) => [n, ...prev]);
    },
    []
  );

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const clearAll = useCallback(() => setNotifications([]), []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{ notifications, unreadCount, addNotification, markAsRead, clearAll }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotifications must be used within NotificationProvider");
  return ctx;
}
