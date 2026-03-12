import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAdminStats } from '@/src/hooks/useAdmin';
import { useDepartments } from '@/src/hooks/useBeds';
import { useAllUsers } from '@/src/hooks/useAdmin';
import { Header } from '@/src/components/layout/Header';
import { LoadingSpinner } from '@/src/components/ui/LoadingSpinner';
import type { Bed } from '@/src/types';

export default function AnalyticsScreen() {
  const { data: stats, isLoading: statsLoading } = useAdminStats();
  const { data: departments } = useDepartments();
  const { data: users } = useAllUsers();

  const allBeds: Bed[] = departments?.flatMap((d) => d.wards.flatMap((w) => w.beds)) ?? [];
  const occupied = allBeds.filter((b) => b.status === 'occupied').length;
  const total = allBeds.length || 1;
  const occupancyPct = Math.round((occupied / total) * 100);

  const admins = users?.filter((u) => u.role === 'admin').length ?? 0;
  const supervisors = users?.filter((u) => u.role === 'supervisor').length ?? 0;
  const staff = users?.filter((u) => u.role === 'user').length ?? 0;
  const totalUsers = users?.length || 1;

  return (
    <SafeAreaView className="flex-1 bg-background">
      <Header title="Analytics" showBack />

      {statsLoading ? (
        <LoadingSpinner />
      ) : (
        <ScrollView className="flex-1" contentContainerClassName="px-6 py-4 gap-4 pb-24">
          {/* Bed Occupancy */}
          <View className="rounded-xl border border-border bg-card p-5">
            <Text className="mb-4 text-sm font-bold text-foreground">Bed Occupancy</Text>
            <View className="flex-row items-center gap-6">
              <View className="items-center justify-center">
                <View className="h-24 w-24 items-center justify-center rounded-full border-8 border-primary">
                  <Text className="text-lg font-bold text-foreground">{occupancyPct}%</Text>
                  <Text className="text-[8px] uppercase text-muted-foreground">Total</Text>
                </View>
              </View>
              <View className="gap-2">
                <View className="flex-row items-center gap-2">
                  <View className="h-2 w-2 rounded-full bg-primary" />
                  <Text className="text-[10px] text-muted-foreground">Occupied ({occupied})</Text>
                </View>
                <View className="flex-row items-center gap-2">
                  <View className="h-2 w-2 rounded-full bg-success" />
                  <Text className="text-[10px] text-muted-foreground">
                    Available ({allBeds.filter((b) => b.status === 'available').length})
                  </Text>
                </View>
                <View className="flex-row items-center gap-2">
                  <View className="h-2 w-2 rounded-full bg-warning" />
                  <Text className="text-[10px] text-muted-foreground">
                    Cleaning ({allBeds.filter((b) => b.status === 'cleaning').length})
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Role Distribution */}
          <View className="rounded-xl border border-border bg-card p-5">
            <Text className="mb-4 text-sm font-bold text-foreground">Role Distribution</Text>
            <View className="gap-4">
              {[
                { label: 'Admins', value: admins, pct: Math.round((admins / totalUsers) * 100) },
                {
                  label: 'Supervisors',
                  value: supervisors,
                  pct: Math.round((supervisors / totalUsers) * 100),
                },
                { label: 'Staff', value: staff, pct: Math.round((staff / totalUsers) * 100) },
              ].map((item) => (
                <View key={item.label}>
                  <View className="mb-1 flex-row justify-between">
                    <Text className="text-[10px] font-medium text-muted-foreground">
                      {item.label}
                    </Text>
                    <Text className="text-[10px] font-medium text-foreground">{item.value}</Text>
                  </View>
                  <View className="h-1.5 w-full rounded-full bg-accent">
                    <View
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${item.pct}%` }}
                    />
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Summary Stats */}
          <View className="flex-row gap-4">
            <View className="flex-1 items-center rounded-xl border border-border bg-card p-4">
              <Text className="text-2xl font-bold text-foreground">{stats?.totalBeds ?? 0}</Text>
              <Text className="text-xs text-muted-foreground">Total Beds</Text>
            </View>
            <View className="flex-1 items-center rounded-xl border border-border bg-card p-4">
              <Text className="text-2xl font-bold text-foreground">
                {stats?.totalDepartments ?? 0}
              </Text>
              <Text className="text-xs text-muted-foreground">Departments</Text>
            </View>
          </View>
          <View className="flex-row gap-4">
            <View className="flex-1 items-center rounded-xl border border-border bg-card p-4">
              <Text className="text-2xl font-bold text-foreground">
                {stats?.activeSubscriptions ?? 0}
              </Text>
              <Text className="text-xs text-muted-foreground">Active Subs</Text>
            </View>
            <View className="flex-1 items-center rounded-xl border border-border bg-card p-4">
              <Text className="text-2xl font-bold text-foreground">
                {stats?.totalAssignments ?? 0}
              </Text>
              <Text className="text-xs text-muted-foreground">Assignments</Text>
            </View>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
