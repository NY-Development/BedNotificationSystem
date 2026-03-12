import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDepartments, useAdmitPatient, useDischargePatient } from '@/src/hooks/useBeds';
import { Header } from '@/src/components/layout/Header';
import { LoadingSpinner } from '@/src/components/ui/LoadingSpinner';
import { Badge } from '@/src/components/ui/Badge';
import { Input } from '@/src/components/ui/Input';
import { BedDouble, ArrowRightLeft, Save, LogOut, ChevronRight } from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';

export default function BedDetailScreen() {
  const router = useRouter();
  const { deptId, wardName, bedId } = useLocalSearchParams<{
    deptId: string;
    wardName: string;
    bedId: string;
  }>();
  const { data: departments, isLoading } = useDepartments();
  const dischargeMutation = useDischargePatient();
  const admitMutation = useAdmitPatient();

  // Transfer state
  const [transferDeptId, setTransferDeptId] = useState('');
  const [transferWard, setTransferWard] = useState('');

  // Find current bed
  const dept = departments?.find((d) => d._id === deptId);
  const ward = dept?.wards.find((w) => w.name === wardName);
  const bed = ward?.beds.find((b) => b._id === bedId);

  if (isLoading) return <LoadingSpinner />;
  if (!bed || !dept || !ward) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-background">
        <Text className="text-muted-foreground">Bed not found.</Text>
      </SafeAreaView>
    );
  }

  const isOccupied = bed.status === 'occupied';

  const handleDischarge = () => {
    Alert.alert('Confirm Discharge', 'Are you sure you want to discharge this patient?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Discharge',
        style: 'destructive',
        onPress: () => {
          dischargeMutation.mutate(
            { deptId: dept._id, wardName: ward.name, bedId: bed._id },
            { onSuccess: () => router.back() }
          );
        },
      },
    ]);
  };

  const handleAdmit = () => {
    admitMutation.mutate(
      { deptId: dept._id, wardName: ward.name, bedId: bed._id },
      { onSuccess: () => router.back() }
    );
  };

  const statusBadge = isOccupied
    ? 'destructive'
    : bed.status === 'cleaning'
      ? 'warning'
      : 'success';
  const statusLabel = bed.status.charAt(0).toUpperCase() + bed.status.slice(1);

  return (
    <SafeAreaView className="flex-1 bg-background">
      <Header
        title={`Bed ${bed.id}`}
        showBack
        rightAction={<Badge label={statusLabel} variant={statusBadge} />}
      />

      <ScrollView className="flex-1" contentContainerClassName="px-4 py-6 gap-6 pb-24">
        {/* Transfer Protocol */}
        {isOccupied && (
          <View className="gap-3 rounded-2xl border border-primary/20 bg-card p-4">
            <View className="mb-1 flex-row items-center gap-2">
              <Icon as={ArrowRightLeft} className="text-primary" size={18} />
              <Text className="text-sm font-semibold uppercase tracking-wide text-primary">
                Transfer Protocol
              </Text>
            </View>
            <Input
              label="Target Department"
              placeholder="Enter department name"
              value={transferDeptId}
              onChangeText={setTransferDeptId}
            />
            <Input
              label="Target Ward"
              placeholder="Enter ward name"
              value={transferWard}
              onChangeText={setTransferWard}
            />
            <Pressable className="mt-2 h-12 flex-row items-center justify-center gap-2 rounded-xl bg-primary active:opacity-90">
              <Text className="font-semibold text-white">Initialize Transfer</Text>
              <Icon as={ChevronRight} className="text-white" size={18} />
            </Pressable>
          </View>
        )}

        {/* Patient Info Card */}
        <View
          className={`rounded-3xl border p-6 ${isOccupied ? 'border-destructive/20 bg-destructive/5' : 'border-success/20 bg-success/5'}`}>
          {/* Bed Header */}
          <View className="mb-8 flex-row items-center gap-4">
            <View
              className={`h-14 w-14 items-center justify-center rounded-full ${isOccupied ? 'bg-destructive' : 'bg-success'}`}>
              <Icon as={BedDouble} className="text-white" size={28} />
            </View>
            <View>
              <Text className="text-2xl font-bold text-foreground">Bed {bed.id}</Text>
              <Text className="mt-0.5 text-sm text-muted-foreground">
                {bed.assignedUser ? `Assigned: ${bed.assignedUser.name}` : 'Unassigned'}
              </Text>
            </View>
          </View>

          {/* Patient Info (if occupied) */}
          {isOccupied && bed.assignedUser && (
            <View className="mb-8 gap-4">
              <View className="mb-2 flex-row items-center gap-2 border-b border-destructive/20 pb-2">
                <Text className="text-xs font-black uppercase tracking-[0.2em] text-destructive">
                  Administrative Info
                </Text>
              </View>
              <View className="gap-1">
                <Text className="ml-1 text-[11px] font-bold uppercase text-muted-foreground">
                  Full Name
                </Text>
                <View className="rounded-xl bg-card px-4 py-3">
                  <Text className="font-medium text-foreground">{bed.assignedUser.name}</Text>
                </View>
              </View>
              <View className="gap-1">
                <Text className="ml-1 text-[11px] font-bold uppercase text-muted-foreground">
                  Email
                </Text>
                <View className="rounded-xl bg-card px-4 py-3">
                  <Text className="font-medium text-foreground">{bed.assignedUser.email}</Text>
                </View>
              </View>
            </View>
          )}

          {/* Actions */}
          <View className="gap-3">
            {isOccupied ? (
              <>
                <Pressable className="h-14 flex-row items-center justify-center gap-3 rounded-2xl bg-foreground active:opacity-90">
                  <Icon as={Save} className="text-background" size={20} />
                  <Text className="font-bold text-background">Update Clinical Record</Text>
                </Pressable>
                <Pressable
                  onPress={handleDischarge}
                  disabled={!!dischargeMutation.isPending}
                  className="h-14 flex-row items-center justify-center gap-3 rounded-2xl border-2 border-destructive active:opacity-90">
                  <Icon as={LogOut} className="text-destructive" size={20} />
                  <Text className="font-bold text-destructive">
                    {dischargeMutation.isPending ? 'Discharging...' : 'Discharge Patient'}
                  </Text>
                </Pressable>
              </>
            ) : (
              <Pressable
                onPress={handleAdmit}
                disabled={!!admitMutation.isPending}
                className="h-14 flex-row items-center justify-center gap-3 rounded-2xl bg-primary active:opacity-90">
                <Text className="font-bold text-white">
                  {admitMutation.isPending ? 'Admitting...' : 'Admit Patient'}
                </Text>
              </Pressable>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
