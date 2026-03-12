import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNotifications } from '@/src/hooks/useNotifications';
import { useNotificationStore } from '@/src/store/notificationStore';
import { LoadingSpinner } from '@/src/components/ui/LoadingSpinner';
import { EmptyState } from '@/src/components/ui/EmptyState';
import { AlertTriangle, Sparkles, ClipboardList, Bell, UserCheck } from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';
import type { Notification } from '@/src/types';

type FilterType = 'all' | 'urgent' | 'unread';

const typeIcons: Record<string, typeof Bell> = {
  error: AlertTriangle,
  warning: AlertTriangle,
  info: Bell,
  success: UserCheck,
};

const typeColors: Record<string, { bg: string; text: string }> = {
  error: { bg: 'bg-destructive/10', text: 'text-destructive' },
  warning: { bg: 'bg-warning/10', text: 'text-warning' },
  info: { bg: 'bg-primary/10', text: 'text-primary' },
  success: { bg: 'bg-success/10', text: 'text-success' },
};

function groupByDate(notifications: Notification[]) {
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  const groups: { label: string; items: Notification[] }[] = [];

  const todayItems = notifications.filter((n) => new Date(n.createdAt).toDateString() === today);
  const yesterdayItems = notifications.filter(
    (n) => new Date(n.createdAt).toDateString() === yesterday
  );
  const olderItems = notifications.filter(
    (n) =>
      new Date(n.createdAt).toDateString() !== today &&
      new Date(n.createdAt).toDateString() !== yesterday
  );

  if (todayItems.length > 0) groups.push({ label: 'Today', items: todayItems });
  if (yesterdayItems.length > 0) groups.push({ label: 'Yesterday', items: yesterdayItems });
  if (olderItems.length > 0) groups.push({ label: 'Earlier', items: olderItems });

  return groups;
}

function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function NotificationsScreen() {
  const { data: notifications, isLoading } = useNotifications();
  const { markAsRead } = useNotificationStore();
  const [filter, setFilter] = useState<FilterType>('all');

  const filtered = useMemo(() => {
    if (!notifications) return [];
    if (filter === 'urgent')
      return notifications.filter((n) => n.type === 'error' || n.type === 'warning');
    if (filter === 'unread') return notifications.filter((n) => !n.read);
    return notifications;
  }, [notifications, filter]);

  const groups = useMemo(() => groupByDate(filtered), [filtered]);

  const filters: { label: string; value: FilterType }[] = [
    { label: 'All', value: 'all' },
    { label: 'Urgent', value: 'urgent' },
    { label: 'Unread', value: 'unread' },
  ];

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Header */}
      <View className="bg-background px-6 pb-4 pt-4">
        <View className="mb-4 flex-row items-center justify-between">
          <Text className="text-3xl font-bold text-foreground">Alerts</Text>
          <Pressable>
            <Text className="text-sm font-semibold text-primary">Mark all as read</Text>
          </Pressable>
        </View>

        {/* Segmented Filter */}
        <View className="flex-row rounded-lg bg-accent p-1">
          {filters.map((f) => (
            <Pressable
              key={f.value}
              onPress={() => setFilter(f.value)}
              className={`flex-1 items-center rounded-md px-3 py-1.5 ${
                filter === f.value ? 'bg-card shadow-sm' : ''
              }`}>
              <Text
                className={`text-sm font-medium ${
                  filter === f.value ? 'text-foreground' : 'text-muted-foreground'
                }`}>
                {f.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Content */}
      {isLoading ? (
        <LoadingSpinner />
      ) : groups.length === 0 ? (
        <EmptyState title="No notifications" message="You're all caught up!" />
      ) : (
        <ScrollView className="flex-1 px-4" contentContainerClassName="gap-4 pb-24">
          {groups.map((group) => (
            <View key={group.label}>
              <Text className="py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {group.label}
              </Text>
              <View className="gap-3">
                {group.items.map((notif) => {
                  const isUrgent = notif.type === 'error' || notif.type === 'warning';
                  const colors = typeColors[notif.type] ?? typeColors.info;
                  const NotifIcon = typeIcons[notif.type] ?? Bell;

                  return (
                    <Pressable
                      key={notif._id}
                      onPress={() => markAsRead(notif._id)}
                      className="overflow-hidden rounded-xl border border-border bg-card active:opacity-90">
                      {isUrgent && (
                        <View className="absolute bottom-0 left-0 top-0 w-1.5 bg-destructive" />
                      )}
                      <View className={`p-4 ${isUrgent ? 'pl-5' : ''}`}>
                        <View className="mb-2 flex-row items-start justify-between">
                          <View className="flex-row items-center gap-2">
                            <View
                              className={`h-8 w-8 items-center justify-center rounded-full ${colors.bg}`}>
                              <Icon as={NotifIcon} className={colors.text} size={18} />
                            </View>
                            {isUrgent && (
                              <View className="rounded bg-destructive/10 px-2 py-0.5">
                                <Text className="text-xs font-medium text-destructive">
                                  High Priority
                                </Text>
                              </View>
                            )}
                            {!notif.read && !isUrgent && (
                              <View className="h-2 w-2 rounded-full bg-primary" />
                            )}
                          </View>
                          <Text className="text-xs text-muted-foreground">
                            {timeAgo(notif.createdAt)}
                          </Text>
                        </View>
                        <Text className="mb-1 text-base font-semibold text-foreground">
                          {notif.title}
                        </Text>
                        <Text className="text-sm leading-relaxed text-muted-foreground">
                          {notif.message}
                        </Text>
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
