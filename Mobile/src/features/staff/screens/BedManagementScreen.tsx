import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
  AppState,
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { useQueryClient } from '@tanstack/react-query';
import { DEPARTMENTS_QUERY_KEY, useDepartments } from '@/src/hooks/useBeds';
import { LoadingSpinner } from '@/src/components/ui/LoadingSpinner';
import { Badge } from '@/src/components/ui/Badge';
import { EmptyState } from '@/src/components/ui/EmptyState';
import {
  Search,
  RefreshCw,
  BedDouble,
  User,
  Sparkles,
  Plus,
  LayoutGrid,
  Users,
  Settings,
} from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';
import { ThemeToggle } from '@/src/components/ui/ThemeToggle';
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
  const queryClient = useQueryClient();
  const { data: departments, isLoading, isRefetching, refetch } = useDepartments();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterType>('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [wardFilter, setWardFilter] = useState('all');
  const [isManualReloading, setIsManualReloading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        refetch();
      }
    });

    return () => subscription.remove();
  }, [refetch]);

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

    if (statusFilter !== 'all') {
      result = result.filter((b) => b.bed.status === statusFilter);
    }

    if (departmentFilter !== 'all') {
      result = result.filter((b) => b.dept._id === departmentFilter);
    }

    if (wardFilter !== 'all') {
      result = result.filter((b) => b.ward.name === wardFilter);
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
  }, [allBeds, statusFilter, departmentFilter, wardFilter, search]);

  const counts = useMemo(
    () => ({
      available: allBeds.filter((b) => b.bed.status === 'available').length,
      occupied: allBeds.filter((b) => b.bed.status === 'occupied').length,
      cleaning: allBeds.filter((b) => b.bed.status === 'cleaning').length,
    }),
    [allBeds]
  );

  const statusFilters: { label: string; value: FilterType }[] = [
    { label: 'All Beds', value: 'all' },
    { label: 'Available', value: 'available' },
    { label: 'Occupied', value: 'occupied' },
    { label: 'Cleaning', value: 'cleaning' },
  ];

  const departmentFilters = useMemo(
    () => [
      { label: 'All Departments', value: 'all' },
      ...(departments ?? []).map((dept) => ({ label: dept.name, value: dept._id })),
    ],
    [departments]
  );

  const wardFilters = useMemo(() => {
    if (!departments) return [{ label: 'All Wards', value: 'all' }];

    const wardsSource =
      departmentFilter === 'all'
        ? departments.flatMap((dept) => dept.wards.map((ward) => ward.name))
        : (departments.find((dept) => dept._id === departmentFilter)?.wards ?? []).map(
            (ward) => ward.name
          );

    const uniqueWards = Array.from(new Set(wardsSource));
    return [
      { label: 'All Wards', value: 'all' },
      ...uniqueWards.map((ward) => ({ label: ward, value: ward })),
    ];
  }, [departments, departmentFilter]);

  const bedsByWard = useMemo(() => {
    const grouped = new Map<string, { dept: Department; ward: Ward; beds: typeof filteredBeds }>();

    for (const item of filteredBeds) {
      const key = `${item.dept._id}::${item.ward.name}`;
      const existing = grouped.get(key);
      if (existing) {
        existing.beds.push(item);
      } else {
        grouped.set(key, {
          dept: item.dept,
          ward: item.ward,
          beds: [item],
        });
      }
    }

    return Array.from(grouped.values());
  }, [filteredBeds]);

  const bedIcon = (status: string) => {
    if (status === 'occupied') return User;
    if (status === 'cleaning') return Sparkles;
    return BedDouble;
  };

  const handleReload = async () => {
    if (isManualReloading || isRefetching) return;

    setIsManualReloading(true);
    try {
      await queryClient.invalidateQueries({ queryKey: DEPARTMENTS_QUERY_KEY });
      await refetch();
    } finally {
      setIsManualReloading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="border-b border-border bg-background px-4 pb-4 pt-2">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-3">
            <View className="h-10 w-10 items-center justify-center overflow-hidden rounded-full border-2 border-background bg-muted">
              <Icon as={BedDouble} className="text-muted-foreground" size={20} />
            </View>
            <View>
              <Text className="text-xl font-bold tracking-tight text-foreground">
                Bed Management
              </Text>
              <Text className="text-xs font-medium text-muted-foreground">
                All Units Monitoring
              </Text>
            </View>
          </View>

          <View className="flex-row items-center gap-2">
            <Pressable
              onPress={() => handleReload()}
              disabled={isRefetching || isManualReloading}
              className="h-10 w-10 items-center justify-center rounded-full border border-border bg-card active:opacity-80">
              {isRefetching || isManualReloading ? (
                <ActivityIndicator size="small" color="hsl(215, 16%, 47%)" />
              ) : (
                <Icon as={RefreshCw} className="text-muted-foreground" size={20} />
              )}
            </Pressable>
            <ThemeToggle variant="outline" />
          </View>
        </View>
      </View>

      <View className="flex-1">
        <ScrollView className="flex-1" contentContainerClassName="px-4 pb-32 pt-4">
          <View className="relative">
            <View className="absolute bottom-0 left-3 top-0 z-10 justify-center">
              <Icon as={Search} className="text-muted-foreground" size={20} />
            </View>
            <TextInput
              className="h-12 w-full rounded-xl border border-border bg-card pl-10 pr-4 text-base text-foreground"
              placeholder="Search bed ID, department, or ward..."
              placeholderTextColor="#94A3B8"
              value={search}
              onChangeText={setSearch}
            />
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerClassName="gap-3 py-4">
            {statusFilters.map((f) => (
              <Pressable
                key={f.value}
                onPress={() => setStatusFilter(f.value)}
                className={`rounded-full px-5 py-2.5 ${
                  statusFilter === f.value ? 'bg-primary' : 'border border-border bg-card'
                }`}>
                <Text
                  className={`text-sm ${
                    statusFilter === f.value
                      ? 'font-semibold text-primary-foreground'
                      : 'font-medium text-muted-foreground'
                  }`}>
                  {f.label}
                </Text>
              </Pressable>
            ))}
          </ScrollView>

          <View className="mb-2 gap-2">
            <Text className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Departments
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerClassName="gap-2 pb-1">
              {departmentFilters.map((f) => (
                <Pressable
                  key={f.value}
                  onPress={() => {
                    setDepartmentFilter(f.value);
                    setWardFilter('all');
                  }}
                  className={`rounded-full px-4 py-2 ${
                    departmentFilter === f.value
                      ? 'bg-primary text-primary-foreground'
                      : 'border border-border bg-card'
                  }`}>
                  <Text
                    className={`text-xs font-semibold ${
                      departmentFilter === f.value
                        ? 'text-primary-foreground'
                        : 'text-muted-foreground'
                    }`}>
                    {f.label}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>

          <View className="mb-4 gap-2">
            <Text className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Wards
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerClassName="gap-2 pb-1">
              {wardFilters.map((f) => (
                <Pressable
                  key={f.value}
                  onPress={() => setWardFilter(f.value)}
                  className={`rounded-full px-4 py-2 ${
                    wardFilter === f.value ? 'bg-primary' : 'border border-border bg-card'
                  }`}>
                  <Text
                    className={`text-xs font-semibold ${
                      wardFilter === f.value ? 'text-primary-foreground' : 'text-muted-foreground'
                    }`}>
                    {f.label}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>

          <View className="mb-6 flex-row gap-3">
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
          </View>

          {isLoading ? (
            <LoadingSpinner message="Opening Bed Management..." />
          ) : filteredBeds.length === 0 ? (
            <EmptyState title="No beds found" message="Try adjusting your search or filters." />
          ) : (
            <View className="gap-8">
              {bedsByWard.map((group) => (
                <View key={`${group.dept._id}-${group.ward.name}`} className="gap-3">
                  <View className="flex-row items-center justify-between px-1">
                    <Text className="text-lg font-bold text-foreground">{group.ward.name}</Text>
                    <Text className="text-xs font-semibold text-primary">View All</Text>
                  </View>

                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerClassName="gap-4 pb-2">
                    {group.beds.map((item) => {
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
                          className="w-[280px] rounded-2xl border border-border bg-card p-5 shadow-sm active:opacity-90">
                          <View className="mb-4 flex-row items-center justify-between">
                            <View
                              className={`h-12 w-12 items-center justify-center rounded-xl ${config.bg}`}>
                              <Icon
                                as={bedIcon(item.bed.status)}
                                className={config.textColor}
                                size={24}
                              />
                            </View>
                            <Badge label={config.label} variant={config.badgeVariant} />
                          </View>

                          <Text className="text-lg font-bold text-foreground">
                            Bed {item.bed.id}
                          </Text>
                          <Text className="text-xs font-medium text-muted-foreground">
                            {item.ward.name} • {item.bed.assignedUser?.name ?? group.dept.name}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </ScrollView>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
