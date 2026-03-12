import React from 'react';
import { View, Text, ScrollView, Pressable, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@/src/store/authStore';
import { useLogout } from '@/src/hooks/useAuth';
import { Header } from '@/src/components/layout/Header';
import { ShieldCheck, Lock, LogOut, HelpCircle, Server, Edit } from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';

export default function AdminProfileScreen() {
  const user = useAuthStore((s) => s.user);
  const logout = useLogout();
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-background">
      <Header title="System Administrator" showBack />

      <ScrollView className="flex-1" contentContainerClassName="pb-24">
        {/* Profile Section */}
        <View className="items-center bg-primary/5 py-6">
          <View className="relative">
            <View className="h-32 w-32 items-center justify-center overflow-hidden rounded-full border-4 border-card bg-primary/10 shadow-xl">
              {user?.image ? (
                <Image source={{ uri: user.image }} className="h-full w-full" />
              ) : (
                <Text className="text-5xl font-bold text-primary">
                  {user?.name?.charAt(0) ?? 'A'}
                </Text>
              )}
            </View>
            <View className="absolute bottom-1 right-1 h-5 w-5 rounded-full border-2 border-card bg-green-500" />
          </View>
          <Text className="mt-4 text-2xl font-bold tracking-tight text-foreground">
            {user?.name ?? 'Admin'}
          </Text>
          <View className="mt-1 flex-row items-center gap-2">
            <View className="rounded-full bg-primary/20 px-2 py-0.5">
              <Text className="text-xs font-bold uppercase tracking-wider text-primary">
                {user?.role ?? 'Admin'}
              </Text>
            </View>
            <Text className="text-sm text-muted-foreground">{user?.email}</Text>
          </View>

          <View className="mt-6 w-full max-w-sm flex-row gap-3 px-6">
            <Pressable className="h-11 flex-1 flex-row items-center justify-center gap-2 rounded-xl bg-primary active:opacity-90">
              <Icon as={Edit} className="text-white" size={16} />
              <Text className="text-sm font-bold text-white">Edit Profile</Text>
            </Pressable>
          </View>
        </View>

        {/* System Permissions */}
        <View className="px-4 pt-6">
          <Text className="px-2 pb-4 text-xs font-bold uppercase tracking-widest text-foreground">
            System Permissions
          </Text>
          <View className="gap-3">
            <View className="flex-row items-center gap-4 rounded-xl border border-border bg-card p-4">
              <View className="h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <Icon as={ShieldCheck} className="text-primary" size={22} />
              </View>
              <View className="flex-1">
                <Text className="text-base font-semibold text-foreground">Full Admin Access</Text>
                <Text className="text-xs text-muted-foreground">
                  Manage users, departments, and logs
                </Text>
              </View>
            </View>
            <View className="flex-row items-center gap-4 rounded-xl border border-border bg-card p-4">
              <View className="h-12 w-12 items-center justify-center rounded-xl bg-orange-500/10">
                <Icon as={Lock} className="text-orange-500" size={22} />
              </View>
              <View className="flex-1">
                <Text className="text-base font-semibold text-foreground">Security Protocol</Text>
                <Text className="text-xs text-muted-foreground">
                  Multi-factor authentication enabled
                </Text>
              </View>
              <View className="rounded bg-green-500/10 px-2 py-1">
                <Text className="text-[10px] font-bold text-green-600">SECURE</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Support & Management */}
        <View className="px-4 pt-6">
          <Text className="px-2 pb-4 text-xs font-bold uppercase tracking-widest text-foreground">
            Support & Management
          </Text>
          <View className="flex-row gap-3">
            <Pressable className="flex-1 gap-2 rounded-xl border border-border bg-card p-4 active:opacity-90">
              <Icon as={HelpCircle} className="text-primary" size={22} />
              <Text className="text-sm font-bold text-foreground">Help Desk</Text>
            </Pressable>
            <Pressable className="flex-1 gap-2 rounded-xl border border-border bg-card p-4 active:opacity-90">
              <Icon as={Server} className="text-primary" size={22} />
              <Text className="text-sm font-bold text-foreground">Server Status</Text>
            </Pressable>
          </View>
        </View>

        {/* Logout */}
        <View className="px-4 pt-6">
          <View className="overflow-hidden rounded-xl border border-border bg-card">
            <Pressable
              onPress={() => {
                logout();
                router.replace('/(auth)/login');
              }}
              className="flex-row items-center gap-3 p-4 active:bg-red-50">
              <Icon as={LogOut} className="text-red-500" size={20} />
              <Text className="text-sm font-bold text-red-500">Logout Session</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
