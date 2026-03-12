import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, Pressable, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDepartments } from '@/src/hooks/useBeds';
import { Header } from '@/src/components/layout/Header';
import { LoadingSpinner } from '@/src/components/ui/LoadingSpinner';
import { Badge } from '@/src/components/ui/Badge';
import { EmptyState } from '@/src/components/ui/EmptyState';
import { Search, RefreshCw, BedDouble, User, Sparkles } from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';
import type { Bed, Ward, Department } from '@/src/types';

type FilterType = 'all' | 'available' | 'occupied' | 'cleaning';

const statusConfig: Record<
  string,
  {
    bg: string;
    textColor: string;
    label: string;
    badgeVariant: 'success' | 'destructive' | 'warning';
  }
> = {
  available: {
    bg: 'bg-success/10',
    textColor: 'text-success',
    label: 'Available',
    badgeVariant: 'success',
  },
  occupied: {
    bg: 'bg-destructive/10',
    textColor: 'text-destructive',
    label: 'Occupied',
    badgeVariant: 'destructive',
  },
  cleaning: {
    bg: 'bg-warning/10',
    textColor: 'text-warning',
    label: 'Pending',
    badgeVariant: 'warning',
  },
};

export default function BedManagementScreen() {
  const router = useRouter();
  const { data: departments, isLoading, refetch } = useDepartments();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');

  const allBeds = useMemo(() => {
    if (!departments) return [];
    const beds: { bed: Bed; ward: Ward; dept: Department }[] = [];
    for (const dept of departments) {
      for (const ward of dept.wards) {
        for (const bed of ward.beds) {
          beds.push({ bed, ward, dept });
        }
      }
    }
    return beds;
  }, [departments]);

  const filteredBeds = useMemo(() => {
    let result = allBeds;
    if (filter !== 'all') {
      result = result.filter((b) => b.bed.status === filter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (b) =>
          String(b.bed.id).includes(q) ||
          b.ward.name.toLowerCase().includes(q) ||
          b.dept.name.toLowerCase().includes(q)
      );
    }
    return result;
  }, [allBeds, filter, search]);

  const counts = useMemo(
    () => ({
      available: allBeds.filter((b) => b.bed.status === 'available').length,
      occupied: allBeds.filter((b) => b.bed.status === 'occupied').length,
      cleaning: allBeds.filter((b) => b.bed.status === 'cleaning').length,
    }),
    [allBeds]
  );

  const filters: { label: string; value: FilterType }[] = [
    { label: 'All Beds', value: 'all' },
    { label: 'Available', value: 'available' },
    { label: 'Occupied', value: 'occupied' },
    { label: 'Cleaning', value: 'cleaning' },
  ];

  const bedIcon = (status: string) => {
    if (status === 'occupied') return User;
    if (status === 'cleaning') return Sparkles;
    return BedDouble;
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <Header
        title="Bed Management"
        showBack
        rightAction={
          <Pressable
            onPress={() => refetch()}
            className="rounded-full border border-border bg-card p-2">
            <Icon as={RefreshCw} className="text-muted-foreground" size={20} />
          </Pressable>
        }
      />

      <View className="flex-1">
        {/* Search */}
        <View className="px-4 pt-4">
          <View className="relative">
            <View className="absolute bottom-0 left-3 top-0 z-10 justify-center">
              <Icon as={Search} className="text-muted-foreground" size={20} />
            </View>
            <TextInput
              className="h-12 w-full rounded-xl border border-border bg-card pl-10 pr-4 text-base text-foreground"
              placeholder="Search bed ID or room number..."
              placeholderTextColor="#94A3B8"
              value={search}
              onChangeText={setSearch}
            />
          </View>
        </View>

        {/* Filter Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="px-4 py-3 gap-3">
          {filters.map((f) => (
            <Pressable
              key={f.value}
              onPress={() => setFilter(f.value)}
              className={`rounded-full px-5 py-2.5 ${
                filter === f.value ? 'bg-primary shadow-md' : 'border border-border bg-card'
              }`}>
              <Text
                className={`text-sm font-semibold ${
                  filter === f.value ? 'text-white' : 'text-muted-foreground'
                }`}>
                {f.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Stats Summary */}
        <View className="mb-4 flex-row gap-3 px-4">
          <View className="flex-1 items-center rounded-xl border border-success/20 bg-success/10 p-3">
            <Text className="text-2xl font-bold text-success">{counts.available}</Text>
            <Text className="text-[10px] font-bold uppercase tracking-wider text-success/80">
              Available
            </Text>
          </View>
          <View className="flex-1 items-center rounded-xl border border-destructive/20 bg-destructive/10 p-3">
            <Text className="text-2xl font-bold text-destructive">{counts.occupied}</Text>
            <Text className="text-[10px] font-bold uppercase tracking-wider text-destructive/80">
              Occupied
            </Text>
          </View>
          <View className="flex-1 items-center rounded-xl border border-warning/20 bg-warning/10 p-3">
            <Text className="text-2xl font-bold text-warning">{counts.cleaning}</Text>
            <Text className="text-[10px] font-bold uppercase tracking-wider text-warning/80">
              Cleaning
            </Text>
          </View>
        </View>

        {/* Bed List */}
        {isLoading ? (
          <LoadingSpinner />
        ) : filteredBeds.length === 0 ? (
          <EmptyState title="No beds found" message="Try adjusting your search or filters." />
        ) : (
          <ScrollView className="flex-1 px-4" contentContainerClassName="gap-3 pb-24">
            {filteredBeds.map((item) => {
              const config = statusConfig[item.bed.status] ?? statusConfig.available;
              return (
                <Pressable
                  key={item.bed._id}
                  onPress={() =>
                    router.push({
                      pathname: '/(staff)/bed-detail',
                      params: {
                        deptId: item.dept._id,
                        wardName: item.ward.name,
                        bedId: item.bed._id,
                      },
                    })
                  }
                  className="flex-row items-center justify-between rounded-2xl border border-border bg-card p-5 shadow-sm active:opacity-90">
                  <View className="flex-row items-center gap-4">
                    <View
                      className={`h-14 w-14 items-center justify-center rounded-xl ${config.bg}`}>
                      <Icon as={bedIcon(item.bed.status)} className={config.textColor} size={28} />
                    </View>
                    <View>
                      <Text className="text-lg font-bold text-foreground">Bed {item.bed.id}</Text>
                      <Text className="text-sm text-muted-foreground">
                        {item.ward.name} • {item.bed.assignedUser?.name ?? item.dept.name}
                      </Text>
                    </View>
                  </View>
                  <Badge label={config.label} variant={config.badgeVariant} />
                </Pressable>
              );
            })}
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}
