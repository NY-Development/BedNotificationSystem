import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, Pressable, TextInput } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDepartments } from '@/src/hooks/useBeds';
import { useAddBed } from '@/src/hooks/useAdmin';
import { Header } from '@/src/components/layout/Header';
import { LoadingSpinner } from '@/src/components/ui/LoadingSpinner';
import { EmptyState } from '@/src/components/ui/EmptyState';
import { Modal } from '@/src/components/ui/Modal';
import { Bed as BedIcon, UserRound, Sparkles, Plus } from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';
import type { Bed } from '@/src/types';

export default function BedsViewScreen() {
  const { deptId, wardId, wardName } = useLocalSearchParams<{
    deptId: string;
    wardId: string;
    wardName: string;
  }>();
  const { data: departments, isLoading } = useDepartments();
  const addBed = useAddBed();
  const [showAdd, setShowAdd] = useState(false);
  const [newBedId, setNewBedId] = useState('');

  const ward = useMemo(() => {
    const dept = departments?.find((d) => d._id === deptId);
    return dept?.wards.find((w) => w._id === wardId);
  }, [departments, deptId, wardId]);

  const beds = ward?.beds ?? [];

  const stats = useMemo(() => {
    const available = beds.filter((b) => b.status === 'available').length;
    const occupied = beds.filter((b) => b.status === 'occupied').length;
    const cleaning = beds.filter((b) => b.status === 'cleaning').length;
    return { available, occupied, cleaning };
  }, [beds]);

  const handleAdd = () => {
    const id = parseInt(newBedId, 10);
    if (isNaN(id) || !deptId || !wardId) return;
    addBed.mutate(
      { deptId, wardId, id },
      {
        onSuccess: () => {
          setNewBedId('');
          setShowAdd(false);
        },
      }
    );
  };

  const statusConfig: Record<
    Bed['status'],
    { border: string; dotColor: string; icon: typeof BedIcon; iconColor: string }
  > = {
    available: {
      border: 'border-green-500/30',
      dotColor: 'bg-green-500',
      icon: BedIcon,
      iconColor: 'text-green-500',
    },
    occupied: {
      border: 'border-red-500/30',
      dotColor: 'bg-red-500',
      icon: UserRound,
      iconColor: 'text-red-500',
    },
    cleaning: {
      border: 'border-amber-500/30',
      dotColor: 'bg-amber-500',
      icon: Sparkles,
      iconColor: 'text-amber-500',
    },
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <Header title={wardName ?? 'Beds View'} showBack />

      {/* Quick Stats */}
      <View className="flex-row gap-3 px-4 pt-4">
        <View className="flex-1 rounded-xl border border-green-100 bg-green-50 p-4">
          <Text className="text-sm font-semibold text-green-700">Available</Text>
          <Text className="text-2xl font-bold text-foreground">{stats.available}</Text>
        </View>
        <View className="flex-1 rounded-xl border border-red-100 bg-red-50 p-4">
          <Text className="text-sm font-semibold text-red-700">Occupied</Text>
          <Text className="text-2xl font-bold text-foreground">{stats.occupied}</Text>
        </View>
        <View className="flex-1 rounded-xl border border-amber-100 bg-amber-50 p-4">
          <Text className="text-sm font-semibold text-amber-700">Cleaning</Text>
          <Text className="text-2xl font-bold text-foreground">{stats.cleaning}</Text>
        </View>
      </View>

      <View className="flex-row items-center justify-between px-4 pb-2 pt-5">
        <Text className="text-lg font-bold text-foreground">Bed Inventory</Text>
      </View>

      {isLoading ? (
        <LoadingSpinner />
      ) : beds.length === 0 ? (
        <EmptyState title="No beds" message="Add beds to this ward." />
      ) : (
        <ScrollView className="flex-1 px-4" contentContainerClassName="pb-24 pt-2">
          <View className="flex-row flex-wrap gap-3">
            {beds.map((bed) => {
              const cfg = statusConfig[bed.status];
              return (
                <View
                  key={bed._id}
                  className={`w-[48%] rounded-2xl border bg-card p-4 ${cfg.border} relative`}>
                  {/* Status dot */}
                  <View className="absolute right-3 top-3">
                    <View className={`h-2 w-2 rounded-full ${cfg.dotColor}`} />
                  </View>

                  <Icon as={cfg.icon} className={cfg.iconColor} size={22} />
                  <Text className="mt-2 text-xs font-bold uppercase text-muted-foreground">
                    Bed {bed.id}
                  </Text>
                  <Text className="mt-0.5 text-lg font-bold capitalize text-foreground">
                    {bed.status === 'occupied' && bed.assignedUser
                      ? bed.assignedUser.name
                      : bed.status}
                  </Text>

                  <View className="mt-3">
                    {bed.status === 'available' && (
                      <View className="items-center rounded-lg bg-green-500 py-1.5">
                        <Text className="text-xs font-bold uppercase tracking-wider text-white">
                          Assign
                        </Text>
                      </View>
                    )}
                    {bed.status === 'occupied' && (
                      <View className="items-center rounded-lg border border-border py-1.5">
                        <Text className="text-xs font-bold uppercase tracking-wider text-foreground">
                          View File
                        </Text>
                      </View>
                    )}
                    {bed.status === 'cleaning' && (
                      <View className="items-center rounded-lg bg-muted py-1.5">
                        <Text className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                          Wait
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        </ScrollView>
      )}

      {/* FAB */}
      <Pressable
        onPress={() => setShowAdd(true)}
        className="absolute bottom-24 right-6 h-14 w-14 items-center justify-center rounded-full bg-primary shadow-lg active:scale-95"
        style={{ elevation: 8 }}>
        <Icon as={Plus} className="text-white" size={26} />
      </Pressable>

      {/* Add Bed Modal */}
      <Modal visible={showAdd} onClose={() => setShowAdd(false)} title="Add Bed">
        <View className="gap-4">
          <TextInput
            className="h-12 rounded-xl border border-border bg-muted px-4 text-base text-foreground"
            placeholder="Bed number (e.g. 101)"
            placeholderTextColor="#94A3B8"
            value={newBedId}
            onChangeText={setNewBedId}
            keyboardType="numeric"
          />
          <Pressable
            onPress={handleAdd}
            className="h-12 items-center justify-center rounded-xl bg-primary active:opacity-90">
            <Text className="font-bold text-white">
              {addBed.isPending ? 'Adding...' : 'Add Bed'}
            </Text>
          </Pressable>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
