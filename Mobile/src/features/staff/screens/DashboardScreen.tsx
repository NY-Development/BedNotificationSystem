import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable, Image, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQueryClient } from '@tanstack/react-query';
import { departmentsQueryOptions, useDepartments } from '@/src/hooks/useBeds';
import { useNotifications } from '@/src/hooks/useNotifications';
import { useAuthStore } from '@/src/store/authStore';
import { useProfile } from '@/src/hooks/useAuth';
import { LoadingSpinner } from '@/src/components/ui/LoadingSpinner';
import { ThemeToggle } from '@/src/components/ui/ThemeToggle';
import { AssignmentModal } from '@/src/features/staff/components/AssignmentModal';
import {
  Bell,
  Sparkles,
  CheckCircle2,
  Circle,
  Activity,
  AlertTriangle,
  Brush,
  UserPlus,
  Repeat,
  LayoutGrid,
} from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';
import type { Bed, Notification } from '@/src/types';

const formatTimeAgo = (date: string) => {
  const diffMs = Date.now() - new Date(date).getTime();
  const mins = Math.max(1, Math.floor(diffMs / 60000));
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
};

export default function StaffDashboardScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const { data: departments, isLoading: isBedsLoading } = useDepartments();
  const { data: notifications = [], isLoading: isNotificationsLoading } = useNotifications();
  useProfile();

  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [taskState, setTaskState] = useState<Record<string, boolean>>({
    rounds: true,
    logs: true,
    discharges: false,
    briefing: false,
    inventory: false,
  });

  const allBeds: Bed[] = departments?.flatMap((d) => d.wards.flatMap((w) => w.beds)) ?? [];
  const total = allBeds.length;
  const available = allBeds.filter((b) => b.status === 'available').length;
  const occupied = allBeds.filter((b) => b.status === 'occupied').length;

  const unreadCount = notifications.filter((n) => !n.read).length;
  const urgentAlerts = notifications
    .filter((n) => n.type === 'error' || n.type === 'warning')
    .slice(0, 2);
  const recentActivity = notifications.slice(0, 4);

  const completedTasks = Object.values(taskState).filter(Boolean).length;

  const taskItems = [
    { key: 'rounds', label: 'Morning ward round (Wards A-D)' },
    { key: 'logs', label: 'Review overnight turnover logs' },
    { key: 'discharges', label: 'Approve pending discharge orders' },
    { key: 'briefing', label: 'Staff briefing for ICU protocols' },
    { key: 'inventory', label: 'Validate equipment inventory (Floor 2)' },
  ];

  const activityMeta = (type: Notification['type']) => {
    if (type === 'error')
      return { icon: AlertTriangle, bg: 'bg-destructive/10', color: 'text-destructive' };
    if (type === 'warning') return { icon: Brush, bg: 'bg-warning/10', color: 'text-warning' };
    if (type === 'success') return { icon: UserPlus, bg: 'bg-success/10', color: 'text-success' };
    return { icon: Repeat, bg: 'bg-info/10', color: 'text-info' };
  };

  const todayLabel = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  const isLoading = isBedsLoading || isNotificationsLoading;

  useEffect(() => {
    queryClient.prefetchQuery(departmentsQueryOptions);
  }, [queryClient]);

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1" contentContainerClassName="pb-28">
        <View className="border-b border-primary/20 bg-primary/10 px-4 py-3">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-3">
              <Icon as={Sparkles} className="text-primary" size={20} />
              <View>
                <Text className="text-sm font-bold text-foreground">Subscription Active</Text>
                <Text className="text-xs text-muted-foreground">
                  BNS Pro License: Hospital System v4.2
                </Text>
              </View>
            </View>
            <Pressable
              onPress={() => router.push('/(system)/expired-subscription')}
              className="rounded-full bg-primary px-3 py-1.5 active:opacity-90">
              <Text className="text-xs font-bold text-primary-foreground">Manage</Text>
            </Pressable>
          </View>
        </View>

        <View className="px-4 pt-6">
          <View className="mb-2 flex-row items-center justify-between">
            <View className="flex-row items-center gap-3">
              <View className="relative">
                <View className="h-12 w-12 items-center justify-center overflow-hidden rounded-full border-2 border-primary/20 bg-primary/10">
                  {user?.image ? (
                    <Image source={{ uri: user.image }} className="h-full w-full" />
                  ) : (
                    <Text className="text-lg font-bold text-primary">
                      {user?.name?.charAt(0) ?? 'U'}
                    </Text>
                  )}
                </View>
                <View className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background bg-success" />
              </View>
              <View>
                <Text className="text-lg font-bold text-foreground">{user?.name ?? 'User'}</Text>
                <View className="flex-row items-center gap-2">
                  <View className="rounded-full bg-primary/10 px-2 py-0.5">
                    <Text className="text-[10px] font-bold uppercase tracking-wide text-primary">
                      On Duty
                    </Text>
                  </View>
                  <Text className="text-xs capitalize text-muted-foreground">
                    {user?.role ?? 'Staff'}
                  </Text>
                </View>
              </View>
            </View>

            <View className="flex-row items-center gap-1">
              <Pressable
                onPress={() => router.push('/(staff)/notifications')}
                className="relative rounded-full p-2 active:opacity-80">
                <Icon as={Bell} className="text-foreground" size={22} />
                {unreadCount > 0 && (
                  <View className="absolute right-2 top-2 h-2 w-2 rounded-full bg-destructive" />
                )}
              </Pressable>
              <ThemeToggle variant="ghost" />
            </View>
          </View>

          <View className="mt-4">
            <Text className="text-2xl font-bold text-foreground">Clinical Overview</Text>
            <Text className="text-sm text-muted-foreground">Shift Handover - {todayLabel}</Text>
          </View>
        </View>

        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <>
            <View className="px-4 py-3">
              <View className="flex-row flex-wrap gap-3">
                <View className="min-w-[140px] flex-1 rounded-xl border border-border bg-card p-4 shadow-sm">
                  <Text className="text-sm font-medium text-muted-foreground">Total Beds</Text>
                  <Text className="text-2xl font-bold text-foreground">{total}</Text>
                  <Text className="mt-1 text-xs text-muted-foreground">Capacity 100%</Text>
                </View>
                <View className="min-w-[140px] flex-1 rounded-xl border border-border bg-card p-4 shadow-sm">
                  <Text className="text-sm font-medium text-muted-foreground">Available</Text>
                  <Text className="text-2xl font-bold text-success">{available}</Text>
                  <Text className="mt-1 text-xs text-success">Real-time</Text>
                </View>
                <View className="min-w-[140px] flex-1 rounded-xl border border-border bg-card p-4 shadow-sm">
                  <Text className="text-sm font-medium text-muted-foreground">Occupied</Text>
                  <Text className="text-2xl font-bold text-destructive">{occupied}</Text>
                  <Text className="mt-1 text-xs text-destructive">Live status</Text>
                </View>
              </View>
            </View>

            <View className="px-4 pb-2 pt-4">
              <Text className="mb-3 text-sm font-bold uppercase tracking-widest text-muted-foreground">
                Urgent Alerts
              </Text>
              <View className="gap-3">
                {urgentAlerts.length === 0 ? (
                  <Pressable
                    onPress={() => router.push('/(staff)/notifications')}
                    className="rounded-xl border border-border bg-card p-4">
                    <Text className="text-sm font-semibold text-foreground">
                      No urgent alerts right now
                    </Text>
                    <Text className="mt-1 text-xs text-muted-foreground">
                      Tap to view all alerts
                    </Text>
                  </Pressable>
                ) : (
                  urgentAlerts.map((alert) => {
                    const isError = alert.type === 'error';
                    return (
                      <Pressable
                        key={alert._id}
                        onPress={() => router.push('/(staff)/notifications')}
                        className={`rounded-xl border p-4 shadow-sm ${
                          isError
                            ? 'border-destructive/20 bg-destructive/10'
                            : 'border-warning/20 bg-warning/10'
                        }`}>
                        <View className="flex-row gap-3">
                          <View
                            className={`h-10 w-10 items-center justify-center rounded-lg ${
                              isError ? 'bg-destructive/20' : 'bg-warning/20'
                            }`}>
                            <Icon
                              as={isError ? AlertTriangle : Activity}
                              className={isError ? 'text-destructive' : 'text-warning'}
                              size={20}
                            />
                          </View>
                          <View className="flex-1">
                            <View className="flex-row items-start justify-between">
                              <Text
                                className={`text-sm font-bold uppercase ${isError ? 'text-destructive' : 'text-warning'}`}>
                                {alert.title}
                              </Text>
                              <Text
                                className={`text-[10px] font-bold ${isError ? 'text-destructive' : 'text-warning'}`}>
                                {formatTimeAgo(alert.createdAt)}
                              </Text>
                            </View>
                            <Text className="mt-1 text-xs text-foreground">{alert.message}</Text>
                          </View>
                        </View>
                      </Pressable>
                    );
                  })
                )}
              </View>
            </View>

            <View className="px-4 pb-3 pt-5">
              <View className="mb-3 flex-row items-center justify-between">
                <Text className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                  Shift Tasks
                </Text>
                <Text className="text-xs font-bold text-primary">
                  {completedTasks}/{taskItems.length} Done
                </Text>
              </View>

              <View className="rounded-2xl border border-border bg-card shadow-sm">
                {taskItems.map((task, index) => {
                  const checked = !!taskState[task.key];
                  const isLast = index === taskItems.length - 1;
                  return (
                    <Pressable
                      key={task.key}
                      onPress={() =>
                        setTaskState((prev) => ({ ...prev, [task.key]: !prev[task.key] }))
                      }
                      className={`flex-row items-center gap-3 p-4 ${!isLast ? 'border-b border-border' : ''}`}>
                      <Icon
                        as={checked ? CheckCircle2 : Circle}
                        className={checked ? 'text-primary' : 'text-muted-foreground'}
                        size={20}
                      />
                      <Text
                        className={`flex-1 text-sm ${checked ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                        {task.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <View className="px-4 pb-6">
              <Text className="mb-3 text-sm font-bold uppercase tracking-widest text-muted-foreground">
                Recent Activity
              </Text>
              <View className="rounded-2xl border border-border bg-card p-4 shadow-sm">
                {recentActivity.length === 0 ? (
                  <Text className="text-sm text-muted-foreground">No recent activity.</Text>
                ) : (
                  <View className="gap-4">
                    {recentActivity.map((activityItem) => {
                      const meta = activityMeta(activityItem.type);
                      return (
                        <View key={activityItem._id} className="flex-row items-center gap-3">
                          <View
                            className={`h-10 w-10 items-center justify-center rounded-full ${meta.bg}`}>
                            <Icon as={meta.icon} className={meta.color} size={18} />
                          </View>
                          <View className="flex-1">
                            <Text className="text-sm font-bold text-foreground">
                              {activityItem.title}
                            </Text>
                            <Text className="text-xs text-muted-foreground">
                              {activityItem.message} - {formatTimeAgo(activityItem.createdAt)}
                            </Text>
                          </View>
                        </View>
                      );
                    })}
                  </View>
                )}

                <Pressable
                  onPress={() => router.push('/(staff)/notifications')}
                  className="mt-5 border-t border-border pt-3">
                  <Text className="text-center text-xs font-bold text-primary">VIEW ALL LOGS</Text>
                </Pressable>
              </View>
            </View>
          </>
        )}
      </ScrollView>

      <Pressable
        onPress={() => setIsAssignModalOpen(true)}
        className="absolute bottom-[125px] left-6 h-14 w-14 items-center justify-center rounded-full bg-foreground shadow-2xl active:opacity-90"
        style={Platform.OS === 'android' ? { elevation: 8 } : undefined}>
        <Icon as={LayoutGrid} className="text-background" size={24} />
      </Pressable>

      <AssignmentModal visible={isAssignModalOpen} onClose={() => setIsAssignModalOpen(false)} />
    </SafeAreaView>
  );
}
