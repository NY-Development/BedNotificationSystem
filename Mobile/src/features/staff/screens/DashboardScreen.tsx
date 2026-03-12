import React from 'react';
import { View, Text, ScrollView, Pressable, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDepartments } from '@/src/hooks/useBeds';
import { useAuthStore } from '@/src/store/authStore';
import { useProfile } from '@/src/hooks/useAuth';
import { Badge } from '@/src/components/ui/Badge';
import { StatCard } from '@/src/components/ui/StatCard';
import { LoadingSpinner } from '@/src/components/ui/LoadingSpinner';
import {
  Bell,
  BedDouble,
  UserPlus,
  ArrowUpRight,
  LogOut,
  Sparkles,
  ClipboardList,
  Headset,
  ChevronRight,
} from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';
import { ThemeToggle } from '@/src/components/ui/ThemeToggle';
import type { Bed } from '@/src/types';

export default function StaffDashboardScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { data: departments, isLoading } = useDepartments();
  useProfile();

  const allBeds: Bed[] = departments?.flatMap((d) => d.wards.flatMap((w) => w.beds)) ?? [];
  const total = allBeds.length;
  const available = allBeds.filter((b) => b.status === 'available').length;
  const occupied = allBeds.filter((b) => b.status === 'occupied').length;

  const quickActions = [
    { label: 'Admit', icon: UserPlus, primary: true, onPress: () => router.push('/(staff)/beds') },
    { label: 'Transfer', icon: ArrowUpRight, onPress: () => router.push('/(staff)/beds') },
    { label: 'Discharge', icon: LogOut, onPress: () => router.push('/(staff)/beds') },
    { label: 'Clean', icon: Sparkles, onPress: () => router.push('/(staff)/beds') },
  ];

  const modules = [
    {
      title: 'Ward Beds',
      desc: 'Real-time status of all patient beds and room turnover.',
      icon: BedDouble,
      color: 'bg-blue-50',
      iconColor: 'text-blue-600',
      path: '/(staff)/beds',
    },
    {
      title: 'Notifications',
      desc: 'Urgent bed requests and priority cleaning alerts.',
      icon: Bell,
      color: 'bg-orange-50',
      iconColor: 'text-orange-600',
      path: '/(staff)/notifications',
    },
    {
      title: 'Assignments',
      desc: 'Manage staff rotations and ward responsibilities.',
      icon: ClipboardList,
      color: 'bg-purple-50',
      iconColor: 'text-purple-600',
      path: '/(staff)/assignments',
    },
    {
      title: 'Support Desk',
      desc: '24/7 technical assistance for the BNS platform.',
      icon: Headset,
      color: 'bg-teal-50',
      iconColor: 'text-teal-600',
      path: '/(staff)/support',
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1" contentContainerClassName="pb-24">
        {/* Subscription Banner */}
        <View className="flex-row items-center justify-between border-b border-primary/20 bg-primary/10 px-4 py-3">
          <View className="flex-row items-center gap-3">
            <Icon as={Sparkles} className="text-primary" size={20} />
            <View>
              <Text className="text-sm font-bold text-foreground">Subscription Active</Text>
              <Text className="text-xs text-muted-foreground">BNS Pro License</Text>
            </View>
          </View>
          <Badge label="Manage" variant="default" />
        </View>

        {/* Header */}
        <View className="px-4 pb-2 pt-6">
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
                  <Badge label="On Duty" />
                  <Text className="text-xs capitalize text-muted-foreground">
                    {user?.role ?? 'Staff'}
                  </Text>
                </View>
              </View>
            </View>
            <View className="flex-row items-center">
              <Pressable
                onPress={() => router.push('/(staff)/notifications')}
                className="rounded-full p-2">
                <Icon as={Bell} className="text-foreground" size={24} />
              </Pressable>
              <ThemeToggle variant="ghost" />
            </View>
          </View>
          <Text className="mt-4 text-2xl font-bold text-foreground">Bed Notification System</Text>
        </View>

        {/* Stats */}
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <View className="px-4 py-2">
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerClassName="gap-3">
              <StatCard title="Total Beds" value={total} className="min-w-[140px]" />
              <StatCard title="Available" value={available} className="min-w-[140px]" />
              <StatCard title="Occupied" value={occupied} className="min-w-[140px]" />
            </ScrollView>
          </View>
        )}

        {/* Quick Actions */}
        <View className="px-4 py-6">
          <Text className="mb-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Quick Actions
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerClassName="gap-4">
            {quickActions.map((action) => (
              <Pressable key={action.label} onPress={action.onPress} className="items-center gap-2">
                <View
                  className={`h-14 w-14 items-center justify-center rounded-2xl ${
                    action.primary ? 'bg-primary shadow-lg' : 'border border-border bg-card'
                  }`}>
                  <Icon
                    as={action.icon}
                    className={action.primary ? 'text-white' : 'text-foreground'}
                    size={24}
                  />
                </View>
                <Text className="text-xs font-bold text-foreground">{action.label}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Clinical Modules */}
        <View className="px-4 pb-6">
          <Text className="mb-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Clinical Modules
          </Text>
          <View className="gap-4">
            {modules.map((mod) => (
              <Pressable
                key={mod.title}
                onPress={() => router.push(mod.path as never)}
                className="rounded-2xl border border-border bg-card p-5 shadow-sm active:opacity-90">
                <View
                  className={`mb-4 h-10 w-10 items-center justify-center rounded-lg ${mod.color}`}>
                  <Icon as={mod.icon} className={mod.iconColor} size={22} />
                </View>
                <Text className="text-lg font-bold text-foreground">{mod.title}</Text>
                <Text className="mt-1 text-sm text-muted-foreground">{mod.desc}</Text>
                <View className="mt-6 flex-row items-center justify-between">
                  <Text className="text-sm font-bold text-primary">Access Module</Text>
                  <Icon as={ChevronRight} className="text-primary" size={16} />
                </View>
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
