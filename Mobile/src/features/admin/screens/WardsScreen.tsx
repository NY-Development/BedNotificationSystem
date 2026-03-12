import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, Pressable, TextInput } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDepartments } from '@/src/hooks/useBeds';
import { useAddWard } from '@/src/hooks/useAdmin';
import { Header } from '@/src/components/layout/Header';
import { LoadingSpinner } from '@/src/components/ui/LoadingSpinner';
import { EmptyState } from '@/src/components/ui/EmptyState';
import { Modal } from '@/src/components/ui/Modal';
import { Bed, Plus } from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';

export default function WardsScreen() {
  const { deptId, deptName } = useLocalSearchParams<{ deptId: string; deptName: string }>();
  const router = useRouter();
  const { data: departments, isLoading } = useDepartments();
  const addWard = useAddWard();
  const [showAdd, setShowAdd] = useState(false);
  const [wardName, setWardName] = useState('');

  const department = departments?.find((d) => d._id === deptId);
  const wards = department?.wards ?? [];

  const wardStats = useMemo(() => {
    return wards.map((w) => {
      const total = w.beds.length;
      const occupied = w.beds.filter((b) => b.status === 'occupied').length;
      const pct = total > 0 ? Math.round((occupied / total) * 100) : 0;
      return { ...w, total, occupied, available: total - occupied, pct };
    });
  }, [wards]);

  const handleAdd = () => {
    if (!wardName.trim() || !deptId) return;
    addWard.mutate(
      { deptId, name: wardName.trim() },
      {
        onSuccess: () => {
          setWardName('');
          setShowAdd(false);
        },
      }
    );
  };

  const barColor = (pct: number) => {
    if (pct >= 100) return 'bg-red-500';
    if (pct >= 75) return 'bg-orange-500';
    return 'bg-primary';
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <Header title={deptName ?? 'Wards'} showBack />

      <View className="flex-row items-center justify-between px-4 pb-2 pt-4">
        <View>
          <Text className="text-lg font-bold text-foreground">Ward Occupancy</Text>
        </View>
        <View className="rounded bg-primary/10 px-2 py-1">
          <Text className="text-xs font-semibold uppercase text-primary">Live Feed</Text>
        </View>
      </View>

      {isLoading ? (
        <LoadingSpinner />
      ) : wardStats.length === 0 ? (
        <EmptyState title="No wards" message="Add wards to this department." />
      ) : (
        <ScrollView className="flex-1 px-4" contentContainerClassName="gap-4 pb-24 pt-2">
          {wardStats.map((ward) => (
            <Pressable
              key={ward._id}
              onPress={() =>
                router.push({
                  pathname: '/(admin)/beds-view',
                  params: { deptId, wardId: ward._id, wardName: ward.name },
                })
              }
              className="gap-4 rounded-2xl border border-border bg-card p-4 active:opacity-90">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-4">
                  <View
                    className={`h-12 w-12 items-center justify-center rounded-xl ${
                      ward.pct >= 100 ? 'bg-red-100' : 'bg-primary/10'
                    }`}>
                    <Icon
                      as={Bed}
                      className={ward.pct >= 100 ? 'text-red-600' : 'text-primary'}
                      size={22}
                    />
                  </View>
                  <View>
                    <Text className="text-base font-bold text-foreground">{ward.name}</Text>
                    <Text className="text-sm text-muted-foreground">{ward.total} total beds</Text>
                  </View>
                </View>
                <View className="items-end">
                  <Text
                    className={`text-lg font-bold ${
                      ward.pct >= 100 ? 'text-red-600' : 'text-primary'
                    }`}>
                    {ward.occupied}/{ward.total}
                  </Text>
                  <Text
                    className={`text-[10px] font-bold uppercase ${
                      ward.pct >= 100 ? 'text-red-500' : 'text-muted-foreground'
                    }`}>
                    {ward.pct >= 100 ? 'FULL' : 'Beds Available'}
                  </Text>
                </View>
              </View>

              {/* Progress bar */}
              <View className="h-2 overflow-hidden rounded-full bg-muted">
                <View
                  className={`h-full rounded-full ${barColor(ward.pct)}`}
                  style={{ width: `${Math.min(ward.pct, 100)}%` }}
                />
              </View>

              <View className="flex-row justify-between">
                <Text className="text-xs font-medium text-muted-foreground">
                  {ward.pct >= 100 ? (
                    <Text className="font-bold text-red-600">100% Occupancy</Text>
                  ) : (
                    `${ward.pct}% Occupancy`
                  )}
                </Text>
                <Text
                  className={`text-xs font-medium ${
                    ward.available > 0 ? 'text-green-600' : 'text-red-500'
                  }`}>
                  {ward.available > 0 ? `${ward.available} Beds Empty` : 'Redirecting Patients'}
                </Text>
              </View>
            </Pressable>
          ))}
        </ScrollView>
      )}

      {/* FAB */}
      <Pressable
        onPress={() => setShowAdd(true)}
        className="absolute bottom-24 right-6 h-14 w-14 items-center justify-center rounded-full bg-primary shadow-lg active:scale-95"
        style={{ elevation: 8 }}>
        <Icon as={Plus} className="text-white" size={26} />
      </Pressable>

      {/* Add Ward Modal */}
      <Modal visible={showAdd} onClose={() => setShowAdd(false)} title="Add Ward">
        <View className="gap-4">
          <TextInput
            className="h-12 rounded-xl border border-border bg-muted px-4 text-base text-foreground"
            placeholder="Ward name"
            placeholderTextColor="#94A3B8"
            value={wardName}
            onChangeText={setWardName}
          />
          <Pressable
            onPress={handleAdd}
            className="h-12 items-center justify-center rounded-xl bg-primary active:opacity-90">
            <Text className="font-bold text-white">
              {addWard.isPending ? 'Adding...' : 'Add Ward'}
            </Text>
          </Pressable>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
