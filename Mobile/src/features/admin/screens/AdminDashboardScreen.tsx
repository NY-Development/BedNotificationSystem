import React from 'react';
import { View, Text, ScrollView, Pressable, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAdminStats } from '@/src/hooks/useAdmin';
import { useAuthStore } from '@/src/store/authStore';
import { StatCard } from '@/src/components/ui/StatCard';
import { LoadingSpinner } from '@/src/components/ui/LoadingSpinner';
import {
  Settings,
  BedDouble,
  Clock,
  Users,
  AlertTriangle,
  ChevronRight,
  CheckCircle,
  Sparkles,
  UserPlus,
} from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';

export default function AdminDashboardScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { data: stats, isLoading } = useAdminStats();

  const greeting =
    new Date().getHours() < 12
      ? 'Good Morning'
      : new Date().getHours() < 18
        ? 'Good Afternoon'
        : 'Good Evening';

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Header */}
      <View className="flex-row items-center justify-between border-b border-border bg-card px-6 pb-4 pt-4">
        <View className="flex-row items-center gap-3">
          <View className="relative">
            <View className="h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-primary/10">
              {user?.image ? (
                <Image source={{ uri: user.image }} className="h-full w-full" />
              ) : (
                <Text className="font-bold text-primary">{user?.name?.charAt(0) ?? 'A'}</Text>
              )}
            </View>
            <View className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-card bg-success" />
          </View>
          <View>
            <Text className="text-xs text-muted-foreground">{greeting},</Text>
            <Text className="text-lg font-bold text-foreground">{user?.name ?? 'Admin'}</Text>
          </View>
        </View>
        <Pressable
          onPress={() => router.push('/(admin)/profile')}
          className="h-10 w-10 items-center justify-center rounded-full">
          <Icon as={Settings} className="text-foreground" size={24} />
        </Pressable>
      </View>

      <ScrollView className="flex-1" contentContainerClassName="pb-24">
        {/* Metrics */}
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <View className="gap-4 p-6">
            <View className="flex-row gap-4">
              <StatCard
                title="Total Beds"
                value={stats?.totalBeds ?? 0}
                icon={BedDouble}
                className="flex-1"
              />
              <View className="h-32 flex-1 justify-between rounded-xl bg-primary p-5 shadow-lg">
                <View className="flex-row items-start justify-between">
                  <Text className="text-sm font-medium text-white/80">Departments</Text>
                </View>
                <Text className="text-3xl font-bold text-white">
                  {stats?.totalDepartments ?? 0}
                </Text>
                <Text className="text-xs text-white/80">Active</Text>
              </View>
            </View>
            <View className="flex-row gap-4">
              <StatCard
                title="Staff Online"
                value={stats?.totalUsers ?? 0}
                icon={Users}
                className="flex-1"
              />
              <StatCard
                title="Assignments"
                value={stats?.totalAssignments ?? 0}
                icon={Clock}
                className="flex-1"
              />
            </View>
          </View>
        )}

        {/* Critical Alert */}
        <View className="px-6 pb-4">
          <View className="mb-3 flex-row items-center gap-2">
            <Icon as={AlertTriangle} className="text-destructive" size={20} />
            <Text className="text-lg font-bold text-foreground">Critical System Alerts</Text>
          </View>
          <View className="rounded-xl border border-destructive/10 bg-destructive/5 p-4">
            <View className="flex-row items-start gap-3">
              <View className="rounded-lg bg-card p-2">
                <Icon as={AlertTriangle} className="text-destructive" size={20} />
              </View>
              <View className="flex-1">
                <Text className="text-sm font-bold text-destructive">ICU Capacity Warning</Text>
                <Text className="mt-1 text-sm leading-snug text-destructive/80">
                  Ward 4 is at 98% capacity. Immediate bed allocation review required.
                </Text>
              </View>
            </View>
            <View className="mt-2 flex-row justify-end border-t border-destructive/10 pt-2">
              <Pressable className="flex-row items-center gap-1">
                <Text className="text-sm font-semibold text-destructive">Review Now</Text>
                <Icon as={ChevronRight} className="text-destructive" size={16} />
              </Pressable>
            </View>
          </View>
        </View>

        {/* Recent Activity */}
        <View className="px-6 py-4">
          <View className="mb-4 flex-row items-center justify-between">
            <Text className="text-lg font-bold text-foreground">Recent Turnovers</Text>
            <Text className="text-sm font-medium text-primary">View All</Text>
          </View>
          <View className="gap-3">
            {[
              {
                icon: CheckCircle,
                iconBg: 'bg-green-100',
                iconColor: 'text-green-600',
                title: 'Ward 3 - Bed 12',
                desc: 'Discharged • Housekeeping notified',
                time: '2m ago',
              },
              {
                icon: Sparkles,
                iconBg: 'bg-blue-100',
                iconColor: 'text-blue-600',
                title: 'ER - Bed 04',
                desc: 'Cleaning Request • Priority High',
                time: '5m ago',
              },
              {
                icon: UserPlus,
                iconBg: 'bg-purple-100',
                iconColor: 'text-purple-600',
                title: 'ICU - Bed 01',
                desc: 'Admitted • Dr. Sarah assigned',
                time: '12m ago',
              },
            ].map((item) => (
              <View
                key={item.title}
                className="flex-row items-center gap-4 rounded-xl border border-border bg-card p-4">
                <View
                  className={`h-10 w-10 items-center justify-center rounded-full ${item.iconBg}`}>
                  <Icon as={item.icon} className={item.iconColor} size={20} />
                </View>
                <View className="flex-1">
                  <View className="mb-0.5 flex-row items-start justify-between">
                    <Text className="text-sm font-bold text-foreground">{item.title}</Text>
                    <Text className="text-xs text-muted-foreground">{item.time}</Text>
                  </View>
                  <Text className="text-xs text-muted-foreground">{item.desc}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
