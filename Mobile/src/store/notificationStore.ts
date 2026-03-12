import { create } from 'zustand';
import type { Notification } from '@/src/types';

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  setNotifications: (notifications: Notification[]) => void;
  markAsRead: (id: string) => void;
  clearAll: () => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,

  setNotifications: (notifications) =>
    set({
      notifications,
      unreadCount: notifications.filter((n) => !n.read).length,
    }),

  markAsRead: (id) => {
    const notifications = get().notifications.map((n) => (n._id === id ? { ...n, read: true } : n));
    set({
      notifications,
      unreadCount: notifications.filter((n) => !n.read).length,
    });
  },

  clearAll: () => set({ notifications: [], unreadCount: 0 }),
}));
