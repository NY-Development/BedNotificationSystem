import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Alert, Image, Switch } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  useAllUsers,
  useUpdateUserRole,
  useActivateSubscription,
  useDeactivateSubscription,
  useDeleteUser,
} from '@/src/hooks/useAdmin';
import { Header } from '@/src/components/layout/Header';
import { Badge } from '@/src/components/ui/Badge';
import { LoadingSpinner } from '@/src/components/ui/LoadingSpinner';
import { ShieldCheck, Power, CreditCard, Trash2, UserCog } from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';

const ROLES = ['admin', 'supervisor', 'user'] as const;

export default function UserDetailScreen() {
  const { userId } = useLocalSearchParams<{ userId: string }>();
  const router = useRouter();
  const { data: users, isLoading } = useAllUsers();
  const updateRole = useUpdateUserRole();
  const activate = useActivateSubscription();
  const deactivate = useDeactivateSubscription();
  const deleteUser = useDeleteUser();

  const user = users?.find((u) => u._id === userId);
  const [selectedRole, setSelectedRole] = useState(user?.role ?? 'user');

  if (isLoading) return <LoadingSpinner />;
  if (!user)
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-background">
        <Text className="text-muted-foreground">User not found.</Text>
      </SafeAreaView>
    );

  const handleRoleChange = (role: string) => {
    setSelectedRole(role as typeof selectedRole);
    updateRole.mutate({ userId: user._id, newRole: role });
  };

  const handleToggleSubscription = () => {
    if (user.subscription.isActive) {
      deactivate.mutate(user._id);
    } else {
      activate.mutate(user._id);
    }
  };

  const handleDelete = () => {
    Alert.alert('Delete Account', `Are you sure you want to delete ${user.name}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => deleteUser.mutate(user._id, { onSuccess: () => router.back() }),
      },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <Header title="Staff Management" showBack />

      <ScrollView className="flex-1" contentContainerClassName="pb-24">
        {/* Profile Header */}
        <View className="mx-4 mt-4 items-center rounded-2xl border border-border bg-card p-6">
          <View className="relative">
            <View className="h-28 w-28 items-center justify-center overflow-hidden rounded-full border-4 border-primary/20 bg-primary/10">
              {user.image ? (
                <Image source={{ uri: user.image }} className="h-full w-full" />
              ) : (
                <Text className="text-4xl font-bold text-primary">{user.name.charAt(0)}</Text>
              )}
            </View>
            <View className="absolute bottom-1 right-1 h-5 w-5 rounded-full border-4 border-card bg-green-500" />
          </View>
          <Text className="mt-4 text-2xl font-bold text-foreground">{user.name}</Text>
          <Text className="font-medium text-muted-foreground">{user.email}</Text>
          <View className="mt-2 flex-row gap-3">
            <View className="rounded-full bg-primary/10 px-3 py-1">
              <Text className="text-xs font-semibold text-primary">ID: {user._id.slice(-6)}</Text>
            </View>
          </View>
        </View>

        {/* Role Management */}
        <View className="mx-4 mt-4 rounded-2xl border border-border bg-card p-5">
          <View className="mb-4 flex-row items-center gap-2">
            <Icon as={ShieldCheck} className="text-primary" size={20} />
            <Text className="font-bold text-foreground">Role Management</Text>
          </View>
          <Text className="mb-2 text-xs font-medium text-muted-foreground">
            Current Assigned Role
          </Text>
          <View className="flex-row gap-2">
            {ROLES.map((role) => (
              <Pressable
                key={role}
                onPress={() => handleRoleChange(role)}
                className={`flex-1 items-center rounded-xl py-3 ${
                  selectedRole === role ? 'bg-primary' : 'bg-muted'
                }`}>
                <Text
                  className={`text-sm font-bold capitalize ${
                    selectedRole === role ? 'text-white' : 'text-muted-foreground'
                  }`}>
                  {role}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Staff Status */}
        <View className="mx-4 mt-4 rounded-2xl border border-border bg-card p-5">
          <View className="mb-4 flex-row items-center justify-between">
            <View className="flex-row items-center gap-2">
              <Icon as={Power} className="text-primary" size={20} />
              <Text className="font-bold text-foreground">Staff Status</Text>
            </View>
            <Badge
              label={user.subscription.isActive ? 'Active' : 'Inactive'}
              variant={user.subscription.isActive ? 'success' : 'destructive'}
            />
          </View>
          <View className="flex-row items-center justify-between rounded-xl bg-muted p-4">
            <Text className="text-sm font-medium text-foreground">
              {user.subscription.isActive ? 'Deactivate' : 'Activate'} Subscription
            </Text>
            <Switch
              value={user.subscription.isActive}
              onValueChange={handleToggleSubscription}
              trackColor={{ false: '#cbd5e1', true: '#2563EB' }}
              thumbColor="#ffffff"
            />
          </View>
        </View>

        {/* Subscription Info */}
        <View className="mx-4 mt-4 rounded-2xl border border-border bg-card p-5">
          <View className="mb-4 flex-row items-center gap-2">
            <Icon as={CreditCard} className="text-primary" size={20} />
            <Text className="font-bold text-foreground">Subscription</Text>
          </View>
          <View className="flex-row gap-3">
            <View className="flex-1 rounded-xl bg-muted p-4">
              <Text className="mb-1 text-xs font-bold uppercase text-muted-foreground">Plan</Text>
              <Text className="text-sm font-bold capitalize text-foreground">
                {user.subscription.plan ?? 'None'}
              </Text>
            </View>
            <View className="flex-1 rounded-xl bg-muted p-4">
              <Text className="mb-1 text-xs font-bold uppercase text-muted-foreground">Status</Text>
              <Text
                className={`text-sm font-bold ${user.subscription.isActive ? 'text-green-600' : 'text-red-500'}`}>
                {user.subscription.isActive ? 'Active' : 'Expired'}
              </Text>
            </View>
          </View>
        </View>

        {/* Destructive Actions */}
        <View className="mx-4 mt-4 rounded-2xl border border-border bg-card p-5">
          <View className="mb-4 flex-row items-center gap-2">
            <Icon as={UserCog} className="text-red-500" size={20} />
            <Text className="font-bold text-foreground">Account Actions</Text>
          </View>
          <Pressable
            onPress={handleDelete}
            className="flex-row items-center justify-center gap-2 rounded-xl bg-red-50 py-4 active:bg-red-100">
            <Icon as={Trash2} className="text-red-600" size={18} />
            <Text className="text-sm font-bold text-red-600">Delete Account</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
