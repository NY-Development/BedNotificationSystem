import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAllUsers } from '@/src/hooks/useAdmin';
import { Header } from '@/src/components/layout/Header';
import { Badge } from '@/src/components/ui/Badge';
import { LoadingSpinner } from '@/src/components/ui/LoadingSpinner';
import { EmptyState } from '@/src/components/ui/EmptyState';
import { Search, ChevronRight } from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';

type RoleFilter = 'all' | 'admin' | 'supervisor' | 'user';

export default function UserDirectoryScreen() {
  const router = useRouter();
  const { data: users, isLoading } = useAllUsers();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('all');

  const filtered = useMemo(() => {
    if (!users) return [];
    let result = users;
    if (roleFilter !== 'all') result = result.filter((u) => u.role === roleFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
      );
    }
    return result;
  }, [users, roleFilter, search]);

  const filters: { label: string; value: RoleFilter }[] = [
    { label: 'All', value: 'all' },
    { label: 'Admin', value: 'admin' },
    { label: 'Supervisor', value: 'supervisor' },
    { label: 'Staff', value: 'user' },
  ];

  const roleBadgeVariant = (role: string) => {
    if (role === 'admin') return 'destructive' as const;
    if (role === 'supervisor') return 'warning' as const;
    return 'default' as const;
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <Header title="User Directory" showBack />

      <View className="px-4 pt-4">
        <View className="relative mb-3">
          <View className="absolute bottom-0 left-3 top-0 z-10 justify-center">
            <Icon as={Search} className="text-muted-foreground" size={20} />
          </View>
          <TextInput
            className="h-12 w-full rounded-xl border border-border bg-card pl-10 pr-4 text-base text-foreground"
            placeholder="Search by name or email..."
            placeholderTextColor="#94A3B8"
            value={search}
            onChangeText={setSearch}
          />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="gap-2 pb-3">
          {filters.map((f) => (
            <Pressable
              key={f.value}
              onPress={() => setRoleFilter(f.value)}
              className={`rounded-full px-4 py-2 ${
                roleFilter === f.value ? 'bg-primary' : 'border border-border bg-card'
              }`}>
              <Text
                className={`text-sm font-semibold ${
                  roleFilter === f.value ? 'text-white' : 'text-muted-foreground'
                }`}>
                {f.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {isLoading ? (
        <LoadingSpinner />
      ) : filtered.length === 0 ? (
        <EmptyState title="No users found" message="Try adjusting your search." />
      ) : (
        <ScrollView className="flex-1 px-4" contentContainerClassName="gap-3 pb-24 pt-2">
          {filtered.map((user) => (
            <Pressable
              key={user._id}
              onPress={() =>
                router.push({
                  pathname: '/(admin)/user-detail',
                  params: { userId: user._id },
                })
              }
              className="flex-row items-center justify-between rounded-2xl border border-border bg-card p-4 active:opacity-90">
              <View className="flex-row items-center gap-3">
                <View className="h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-primary/10">
                  {user.image ? (
                    <Image source={{ uri: user.image }} className="h-full w-full" />
                  ) : (
                    <Text className="text-lg font-bold text-primary">{user.name.charAt(0)}</Text>
                  )}
                </View>
                <View>
                  <Text className="text-base font-bold text-foreground">{user.name}</Text>
                  <Text className="text-xs text-muted-foreground">{user.email}</Text>
                </View>
              </View>
              <View className="flex-row items-center gap-2">
                <Badge label={user.role} variant={roleBadgeVariant(user.role)} />
                <Icon as={ChevronRight} className="text-muted-foreground" size={18} />
              </View>
            </Pressable>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
