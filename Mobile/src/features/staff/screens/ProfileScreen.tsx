import React from 'react';
import { View, Text, ScrollView, Pressable, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@/src/store/authStore';
import { useLogout } from '@/src/hooks/useAuth';
import { Header } from '@/src/components/layout/Header';
import { Badge } from '@/src/components/ui/Badge';
import {
  User,
  Lock,
  Bell,
  Building2,
  BadgeCheck,
  LogOut,
  ChevronRight,
  Shield,
  Edit3,
} from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';
import type { LucideIcon } from 'lucide-react-native';

interface SettingItem {
  icon: LucideIcon;
  label: string;
  iconBg: string;
  iconColor: string;
  onPress?: () => void;
}

export default function ProfileScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const logout = useLogout();

  const accountSettings: SettingItem[] = [
    { icon: User, label: 'Edit Profile', iconBg: 'bg-blue-50', iconColor: 'text-primary' },
    { icon: Lock, label: 'Security & Password', iconBg: 'bg-blue-50', iconColor: 'text-primary' },
    {
      icon: Bell,
      label: 'Notification Preferences',
      iconBg: 'bg-blue-50',
      iconColor: 'text-primary',
    },
  ];

  const hospitalSettings: SettingItem[] = [
    {
      icon: Building2,
      label: 'Unit Settings',
      iconBg: 'bg-indigo-50',
      iconColor: 'text-indigo-500',
    },
    {
      icon: BadgeCheck,
      label: 'Staff Access',
      iconBg: 'bg-indigo-50',
      iconColor: 'text-indigo-500',
    },
  ];

  const handleLogout = () => {
    logout();
    router.replace('/(auth)/login');
  };

  const renderSettingRow = (item: SettingItem, isLast: boolean) => (
    <Pressable
      key={item.label}
      onPress={item.onPress}
      className={`flex-row items-center justify-between p-4 ${
        !isLast ? 'border-b border-border' : ''
      } active:bg-accent/50`}>
      <View className="flex-row items-center gap-3">
        <View className={`h-8 w-8 items-center justify-center rounded-lg ${item.iconBg}`}>
          <Icon as={item.icon} className={item.iconColor} size={18} />
        </View>
        <Text className="text-sm font-medium text-foreground">{item.label}</Text>
      </View>
      <Icon as={ChevronRight} className="text-muted-foreground" size={20} />
    </Pressable>
  );

  return (
    <SafeAreaView className="flex-1 bg-background">
      <Header title="My Profile" showBack />

      <ScrollView className="flex-1" contentContainerClassName="px-4 py-6 pb-24 gap-8">
        {/* Profile Card */}
        <View className="items-center">
          <View className="relative">
            <View className="h-28 w-28 overflow-hidden rounded-full border-4 border-card shadow-xl">
              {user?.image ? (
                <Image source={{ uri: user.image }} className="h-full w-full" />
              ) : (
                <View className="h-full w-full items-center justify-center bg-primary/10">
                  <Text className="text-4xl font-bold text-primary">
                    {user?.name?.charAt(0) ?? 'U'}
                  </Text>
                </View>
              )}
            </View>
            <Pressable className="absolute bottom-0 right-0 rounded-full border-4 border-background bg-primary p-1.5">
              <Icon as={Edit3} className="text-white" size={14} />
            </Pressable>
          </View>
          <Text className="mt-4 text-xl font-bold text-foreground">{user?.name ?? 'User'}</Text>
          <View className="mt-2 flex-row items-center gap-2">
            <Badge label={user?.role ?? 'Staff'} />
            <Text className="text-sm text-muted-foreground">•</Text>
            <Text className="text-sm text-muted-foreground">Department</Text>
          </View>
        </View>

        {/* Subscription Status */}
        <View className="flex-row items-center justify-between rounded-xl border border-border bg-card p-4">
          <View className="flex-row items-center gap-3">
            <View className="h-10 w-10 items-center justify-center rounded-full bg-success/10">
              <Icon as={Shield} className="text-success" size={20} />
            </View>
            <View>
              <Text className="text-sm font-semibold text-foreground">
                {user?.subscription?.plan === 'year' ? 'Annual Plan' : 'Monthly Plan'}
              </Text>
              <Text className="text-xs text-muted-foreground">
                {user?.subscription?.isActive ? 'Active' : 'Inactive'}
              </Text>
            </View>
          </View>
          <Text className="text-sm font-medium text-primary">Manage</Text>
        </View>

        {/* Account Settings */}
        <View>
          <Text className="mb-2 px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Account
          </Text>
          <View className="overflow-hidden rounded-xl border border-border bg-card">
            {accountSettings.map((item, i) =>
              renderSettingRow(item, i === accountSettings.length - 1)
            )}
          </View>
        </View>

        {/* Hospital Settings */}
        <View>
          <Text className="mb-2 px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Hospital
          </Text>
          <View className="overflow-hidden rounded-xl border border-border bg-card">
            {hospitalSettings.map((item, i) =>
              renderSettingRow(item, i === hospitalSettings.length - 1)
            )}
          </View>
        </View>

        {/* Logout */}
        <Pressable
          onPress={handleLogout}
          className="flex-row items-center justify-center gap-2 rounded-xl border border-border bg-card p-4 active:bg-destructive/5">
          <Icon as={LogOut} className="text-destructive" size={20} />
          <Text className="text-sm font-medium text-destructive">Log Out</Text>
        </Pressable>

        {/* Version */}
        <Text className="text-center text-xs text-muted-foreground">BNS App Version 2.1.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}
