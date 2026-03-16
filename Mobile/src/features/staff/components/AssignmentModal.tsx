import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { assignmentsApi } from '@/src/features/assignments/api/assignmentsApi';
import { useMyAssignment } from '@/src/hooks/useAssignments';
import { useDepartments } from '@/src/hooks/useBeds';
import { Modal } from '@/src/components/ui/Modal';
import { useAuthStore } from '@/src/store/authStore';

type AssignmentModalProps = {
  visible: boolean;
  onClose: () => void;
};

const plusOneDayIso = () => {
  const nextDay = new Date();
  nextDay.setDate(nextDay.getDate() + 1);
  return nextDay.toISOString().split('T')[0];
};

export function AssignmentModal({ visible, onClose }: AssignmentModalProps) {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const { data: departments } = useDepartments();
  const { data: myAssignment } = useMyAssignment();

  const [form, setForm] = useState({
    deptId: '',
    wardName: '',
    beds: [] as string[],
    deptExpiry: '',
    wardExpiry: '',
  });

  useEffect(() => {
    if (!visible) return;

    if (myAssignment) {
      setForm({
        deptId: myAssignment.deptId ?? '',
        wardName: myAssignment.wardName ?? '',
        beds: (myAssignment.beds ?? []).map(String),
        deptExpiry: myAssignment.deptExpiry ? myAssignment.deptExpiry.split('T')[0] : '',
        wardExpiry: myAssignment.wardExpiry ? myAssignment.wardExpiry.split('T')[0] : '',
      });
    } else {
      setForm({ deptId: '', wardName: '', beds: [], deptExpiry: '', wardExpiry: '' });
    }
  }, [visible, myAssignment]);

  const selectedDept = useMemo(
    () => departments?.find((d) => d._id === form.deptId),
    [departments, form.deptId]
  );

  const selectedWard = useMemo(
    () => selectedDept?.wards.find((w) => w.name === form.wardName),
    [selectedDept, form.wardName]
  );

  const bedsToDisplay = useMemo(
    () =>
      selectedWard
        ? selectedWard.beds.filter(
            (bed) => bed.status === 'available' || form.beds.includes(String(bed.id))
          )
        : [],
    [selectedWard, form.beds]
  );

  const createAssignmentMutation = useMutation({
    mutationFn: (payload: {
      userId: string;
      deptId: string;
      wardName: string;
      beds: string[];
      deptExpiry?: string;
      wardExpiry?: string;
    }) => assignmentsApi.createAssignment(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['myAssignment'] });
      await queryClient.invalidateQueries({ queryKey: ['departments'] });
      onClose();
      Alert.alert('Success', 'Assignment initialized successfully.');
    },
    onError: (error: any) => {
      Alert.alert('Failed', error?.response?.data?.message || 'Unable to create assignment.');
    },
  });

  const updateAssignmentMutation = useMutation({
    mutationFn: (payload: {
      deptId: string;
      wardName: string;
      beds: string[];
      deptExpiry?: string;
      wardExpiry?: string;
    }) => assignmentsApi.updateAssignment(myAssignment!._id, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['myAssignment'] });
      await queryClient.invalidateQueries({ queryKey: ['departments'] });
      onClose();
      Alert.alert('Success', 'Clinical assignment updated successfully.');
    },
    onError: (error: any) => {
      Alert.alert('Failed', error?.response?.data?.message || 'Unable to update assignment.');
    },
  });

  const handleSubmitAssignment = () => {
    if (!form.deptId || !form.wardName || form.beds.length === 0) {
      Alert.alert('Incomplete Form', 'Select department, ward, and at least one bed.');
      return;
    }

    if (!form.deptExpiry || !form.wardExpiry) {
      Alert.alert('Missing Dates', 'Set both department and ward expiry dates.');
      return;
    }

    if (!user?._id) {
      Alert.alert('Error', 'User not found. Please log in again.');
      return;
    }

    const payload = {
      deptId: form.deptId,
      wardName: form.wardName,
      beds: form.beds,
      deptExpiry: form.deptExpiry,
      wardExpiry: form.wardExpiry,
    };

    if (myAssignment?._id) {
      updateAssignmentMutation.mutate(payload);
    } else {
      createAssignmentMutation.mutate({ ...payload, userId: user._id });
    }
  };

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      title={myAssignment ? 'Update Clinical Assignment' : 'Initialize Assignment'}
      className="max-w-[92%]">
      <ScrollView className="max-h-[70vh]" contentContainerClassName="gap-4">
        <View className="gap-2">
          <Text className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Department
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerClassName="gap-2">
            {(departments ?? []).map((dept) => (
              <Pressable
                key={dept._id}
                onPress={() =>
                  setForm((prev) => ({ ...prev, deptId: dept._id, wardName: '', beds: [] }))
                }
                className={`rounded-full border px-3 py-2 ${
                  form.deptId === dept._id
                    ? 'border-primary bg-primary/10'
                    : 'border-border bg-card'
                }`}>
                <Text
                  className={`text-xs font-semibold ${form.deptId === dept._id ? 'text-primary' : 'text-muted-foreground'}`}>
                  {dept.name}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        <View className="gap-2">
          <Text className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Ward
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerClassName="gap-2">
            {selectedDept ? (
              selectedDept.wards.map((ward) => (
                <Pressable
                  key={ward.name}
                  onPress={() => setForm((prev) => ({ ...prev, wardName: ward.name, beds: [] }))}
                  className={`rounded-full border px-3 py-2 ${
                    form.wardName === ward.name
                      ? 'border-primary bg-primary/10'
                      : 'border-border bg-card'
                  }`}>
                  <Text
                    className={`text-xs font-semibold ${form.wardName === ward.name ? 'text-primary' : 'text-muted-foreground'}`}>
                    {ward.name}
                  </Text>
                </Pressable>
              ))
            ) : (
              <Text className="text-xs text-muted-foreground">Select department first</Text>
            )}
          </ScrollView>
        </View>

        <View className="gap-2">
          <Text className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Beds
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {bedsToDisplay.length === 0 ? (
              <Text className="text-xs text-muted-foreground">No available beds in this ward.</Text>
            ) : (
              bedsToDisplay.map((bed) => {
                const value = String(bed.id);
                const selected = form.beds.includes(value);
                return (
                  <Pressable
                    key={bed._id}
                    onPress={() =>
                      setForm((prev) => ({
                        ...prev,
                        beds: selected
                          ? prev.beds.filter((id) => id !== value)
                          : [...prev.beds, value],
                      }))
                    }
                    className={`rounded-full border px-3 py-2 ${selected ? 'border-primary bg-primary/10' : 'border-border bg-card'}`}>
                    <Text
                      className={`text-xs font-semibold ${selected ? 'text-primary' : 'text-muted-foreground'}`}>
                      Bed {bed.id}
                    </Text>
                  </Pressable>
                );
              })
            )}
          </View>
        </View>

        <View className="gap-2">
          <Text className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Department Expiry
          </Text>
          <TextInput
            value={form.deptExpiry}
            onChangeText={(text) => setForm((prev) => ({ ...prev, deptExpiry: text }))}
            placeholder="YYYY-MM-DD"
            className="rounded-xl border border-border bg-card px-3 py-3 text-foreground"
          />
          <Text className="text-[11px] text-muted-foreground">Minimum date: {plusOneDayIso()}</Text>
        </View>

        <View className="gap-2">
          <Text className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Ward Expiry
          </Text>
          <TextInput
            value={form.wardExpiry}
            onChangeText={(text) => setForm((prev) => ({ ...prev, wardExpiry: text }))}
            placeholder="YYYY-MM-DD"
            className="rounded-xl border border-border bg-card px-3 py-3 text-foreground"
          />
          <Text className="text-[11px] text-muted-foreground">Minimum date: {plusOneDayIso()}</Text>
        </View>

        <Pressable
          onPress={handleSubmitAssignment}
          disabled={createAssignmentMutation.isPending || updateAssignmentMutation.isPending}
          className="mt-2 h-12 items-center justify-center rounded-xl bg-primary active:opacity-90">
          <Text className="font-bold text-primary-foreground">
            {createAssignmentMutation.isPending || updateAssignmentMutation.isPending
              ? 'Synchronizing...'
              : myAssignment
                ? 'Update Clinical Station'
                : 'Initialize Assignment'}
          </Text>
        </Pressable>
      </ScrollView>
    </Modal>
  );
}
