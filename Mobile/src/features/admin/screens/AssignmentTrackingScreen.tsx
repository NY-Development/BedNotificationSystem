import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAllAssignments } from '@/src/hooks/useAdmin';
import { useDepartments } from '@/src/hooks/useBeds';
import { Header } from '@/src/components/layout/Header';
import { Badge } from '@/src/components/ui/Badge';
import { LoadingSpinner } from '@/src/components/ui/LoadingSpinner';
import { EmptyState } from '@/src/components/ui/EmptyState';
import { Clock, MapPin, Calendar } from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';

type StatusFilter = 'all' | 'active' | 'expired';

export default function AssignmentTrackingScreen() {
  const { data: assignments, isLoading } = useAllAssignments();
  const { data: departments } = useDepartments();
  const [filter, setFilter] = useState<StatusFilter>('all');

  const deptMap = useMemo(() => {
    const m: Record<string, string> = {};
    departments?.forEach((d) => {
      m[d._id] = d.name;
    });
    return m;
  }, [departments]);

  const isExpired = (a: { deptExpiry: string }) => new Date(a.deptExpiry) < new Date();

  const filtered = useMemo(() => {
    if (!assignments) return [];
    if (filter === 'active') return assignments.filter((a) => !isExpired(a));
    if (filter === 'expired') return assignments.filter((a) => isExpired(a));
    return assignments;
  }, [assignments, filter]);

  const timeRemaining = (expiry: string) => {
    const diff = new Date(expiry).getTime() - Date.now();
    if (diff <= 0) return null;
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    return `${h}h ${m}m`;
  };

  const filters: { label: string; value: StatusFilter }[] = [
    { label: 'All', value: 'all' },
    { label: 'Active', value: 'active' },
    { label: 'Expired', value: 'expired' },
  ];

  return (
    <SafeAreaView className="flex-1 bg-background">
      <Header title="Assignments Overview" showBack />

      {/* Segmented Filter */}
      <View className="px-4 pt-4">
        <View className="flex-row rounded-xl bg-muted p-1">
          {filters.map((f) => (
            <Pressable
              key={f.value}
              onPress={() => setFilter(f.value)}
              className={`flex-1 items-center rounded-lg py-2.5 ${
                filter === f.value ? 'bg-card shadow-sm' : ''
              }`}>
              <Text
                className={`text-sm font-medium ${
                  filter === f.value ? 'text-primary' : 'text-muted-foreground'
                }`}>
                {f.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {isLoading ? (
        <LoadingSpinner />
      ) : filtered.length === 0 ? (
        <EmptyState title="No assignments" message="No assignments match the filter." />
      ) : (
        <ScrollView className="flex-1 px-4 pt-4" contentContainerClassName="gap-4 pb-24">
          {filtered.map((assignment) => {
            const expired = isExpired(assignment);
            const remaining = timeRemaining(assignment.deptExpiry);
            return (
              <View
                key={assignment._id}
                className={`rounded-2xl border border-border bg-card p-4 ${expired ? 'opacity-75' : ''}`}>
                <View className="mb-3 flex-row items-start justify-between">
                  <View className="flex-row items-center gap-3">
                    <View
                      className={`h-12 w-12 items-center justify-center rounded-full ${
                        expired ? 'bg-muted' : 'bg-primary/10'
                      }`}>
                      <Icon
                        as={MapPin}
                        className={expired ? 'text-muted-foreground' : 'text-primary'}
                        size={22}
                      />
                    </View>
                    <View>
                      <Text className="font-bold text-foreground">
                        {deptMap[assignment.deptId] ?? 'Department'}
                      </Text>
                      <Text className="text-sm text-muted-foreground">
                        Ward: {assignment.wardName}
                      </Text>
                    </View>
                  </View>
                  <Badge
                    label={expired ? 'Expired' : 'Active'}
                    variant={expired ? 'destructive' : 'success'}
                  />
                </View>

                <View className="flex-row border-t border-border pt-3">
                  <View className="flex-1">
                    <Text className="text-[11px] font-bold uppercase tracking-tight text-muted-foreground">
                      Beds
                    </Text>
                    <Text className="text-sm font-medium text-foreground">
                      {assignment.beds.length} assigned
                    </Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-[11px] font-bold uppercase tracking-tight text-muted-foreground">
                      {expired ? 'Ended' : 'Remaining'}
                    </Text>
                    <View className="flex-row items-center gap-1.5">
                      <Icon
                        as={expired ? Calendar : Clock}
                        className={expired ? 'text-red-500' : 'text-primary'}
                        size={14}
                      />
                      <Text
                        className={`text-sm font-medium ${expired ? 'text-red-500' : 'text-foreground'}`}>
                        {remaining ?? 'Expired'}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            );
          })}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
