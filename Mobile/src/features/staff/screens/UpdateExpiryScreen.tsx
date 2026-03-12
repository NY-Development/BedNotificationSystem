import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAuthStore } from '@/src/store/authStore';
import { useAssignmentStore } from '@/src/store/assignmentStore';
import { useTheme } from '@/src/store/themeStore';
import { useToast } from '@/src/components/ui/Toast';
import { assignmentsApi } from '@/src/features/assignments/api/assignmentsApi';
import { departmentsApi } from '@/src/features/departments/api/departmentsApi';
import type { Department, Assignment } from '@/src/types';

export default function UpdateExpiryScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { user } = useAuthStore();
  const { myAssignment } = useAssignmentStore();
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    deptId: '',
    wardName: '',
    deptExpiry: '',
    wardExpiry: '',
    beds: [] as string[],
  });

  const [showDeptDatePicker, setShowDeptDatePicker] = useState(false);
  const [showWardDatePicker, setShowWardDatePicker] = useState(false);

  // Fetch departments
  const { data: departments = [], isLoading: depsLoading } = useQuery({
    queryKey: ['departments'],
    queryFn: () => departmentsApi.getDepartments(),
  });

  // Fetch expiry data
  const { data: expiry, isLoading: expiryLoading } = useQuery({
    queryKey: ['expiry', user?._id],
    queryFn: () => assignmentsApi.getExpiryDates(user!._id),
    enabled: !!user?._id,
  });

  // Fetch my assignment
  const { data: assignment, isLoading: assignmentLoading } = useQuery({
    queryKey: ['myAssignment'],
    queryFn: () => assignmentsApi.getMyAssignment(),
  });

  const updateExpiryMutation = useMutation({
    mutationFn: (data: any) => assignmentsApi.updateAssignment(myAssignment!._id, data),
    onSuccess: () => {
      showToast('Expiry updated successfully! ✅', 'success');
      queryClient.invalidateQueries({ queryKey: ['expiry'] });
      queryClient.invalidateQueries({ queryKey: ['myAssignment'] });
    },
    onError: () => {
      showToast('Failed to update expiry.', 'error');
    },
  });

  useEffect(() => {
    if (assignment && departments.length > 0) {
      const currentDept = departments.find((d: Department) => d.name === assignment.department);
      setForm((prev) => ({
        ...prev,
        deptId: currentDept?._id || '',
        wardName: assignment.ward || '',
      }));
    }
  }, [assignment, departments]);

  // Date utilities
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const getStatus = (date: string) => {
    if (!date) return 'N/A';
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    if (d <= today) return 'Expired';
    const days = Math.ceil((d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return days <= 3 ? 'ExpiringSoon' : 'Valid';
  };

  const deptStatus = getStatus(expiry?.deptExpiry);
  const wardStatus = getStatus(expiry?.wardExpiry);
  const isDeptExpired = deptStatus === 'Expired';
  const isWardExpired = wardStatus === 'Expired';

  const selectedDept = departments.find((d: Department) => d._id === form.deptId);
  const selectedWard = selectedDept?.wards.find((w) => w.name === form.wardName);
  const bedsToDisplay = selectedWard ? selectedWard.beds : [];

  const handleDeptChange = (deptId: string) => {
    setForm({ ...form, deptId, wardName: '', beds: [] });
  };

  const handleWardChange = (wardName: string) => {
    setForm({ ...form, wardName, beds: [] });
  };

  const handleBedToggle = (bedId: string) => {
    setForm((prev) => ({
      ...prev,
      beds: prev.beds.includes(bedId)
        ? prev.beds.filter((id) => id !== bedId)
        : [...prev.beds, bedId],
    }));
  };

  const handleSubmit = async () => {
    if (!myAssignment?._id) {
      showToast('No assignment found to update.', 'error');
      return;
    }

    try {
      await updateExpiryMutation.mutateAsync({
        deptExpiry: isDeptExpired ? form.deptExpiry : expiry.deptExpiry,
        wardExpiry: isWardExpired ? form.wardExpiry : expiry.wardExpiry,
        department: isDeptExpired ? selectedDept?.name : assignment?.department,
        ward: isDeptExpired || isWardExpired ? form.wardName : assignment?.ward,
        beds: form.beds,
      });
    } catch (error) {
      console.error('Update failed:', error);
    }
  };

  if (depsLoading || expiryLoading || assignmentLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" className="mb-4" />
          <Text className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            Loading your assignment details...
          </Text>
          <Text className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Please wait while we retrieve your current rotation data.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Subscription check
  if (!user?.subscription?.isActive) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900">
        <View className="flex-1 items-center justify-center p-6">
          <View className="w-full max-w-sm rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-xl dark:border-gray-700 dark:bg-gray-800">
            <View className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-red-50 dark:bg-red-900/30">
              <Ionicons
                name="lock-closed"
                size={40}
                color={theme === 'dark' ? '#ef4444' : '#dc2626'}
              />
            </View>
            <Text className="mb-2 text-2xl font-black uppercase text-gray-900 dark:text-gray-100">
              Access Denied
            </Text>
            <Text className="mb-8 text-sm font-semibold text-gray-500 dark:text-gray-400">
              You need an active Platform Subscription to access the Update-Ward Live Feed.
            </Text>
            <TouchableOpacity
              onPress={() => router.push('/(staff)/subscription')}
              className="w-full rounded-2xl bg-gray-900 py-4 dark:bg-gray-100">
              <Text className="text-center font-black uppercase tracking-widest text-white dark:text-gray-900">
                Upgrade Plan
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // No update needed - Valid status
  if ((!isDeptExpired && !isWardExpired) || user?.role === 'intern') {
    return (
      <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
        <ScrollView className="flex-1 p-6">
          <TouchableOpacity onPress={() => router.back()} className="mb-6">
            <Ionicons
              name="arrow-back"
              size={24}
              color={theme === 'dark' ? '#f3f4f6' : '#374151'}
            />
          </TouchableOpacity>

          <View className="rounded-3xl border-t-8 border-green-500 bg-white p-8 shadow-xl dark:bg-gray-800">
            <View className="mb-6 flex-row items-center border-b border-gray-200 pb-4 dark:border-gray-700">
              <Ionicons name="checkmark-circle" size={32} color="#059669" className="mr-3" />
              <Text className="flex-1 text-3xl font-extrabold text-gray-800 dark:text-gray-200">
                No Update Required
              </Text>
            </View>
            <Text className="mb-8 text-lg text-gray-700 dark:text-gray-300">
              Your current assignment and expiry dates are **valid**.
            </Text>

            <View className="space-y-4">
              <View className="flex-row items-center justify-between rounded-xl border border-green-200 bg-green-50 p-4 dark:border-green-700 dark:bg-green-900/30">
                <Text className="font-semibold text-gray-700 dark:text-gray-300">Department:</Text>
                <Text className="text-lg font-bold text-green-800 dark:text-green-400">
                  {assignment?.department || 'N/A'}
                </Text>
              </View>

              <View className="flex-row items-center justify-between rounded-xl border border-green-200 bg-green-50 p-4 dark:border-green-700 dark:bg-green-900/30">
                <Text className="font-semibold text-gray-700 dark:text-gray-300">Ward:</Text>
                <Text className="text-lg font-bold text-green-800 dark:text-green-400">
                  {assignment?.ward || 'N/A'}
                </Text>
              </View>

              <View className="flex-row items-center justify-between rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-600 dark:bg-gray-700">
                <Text className="text-gray-600 dark:text-gray-300">Dept Expiry Date:</Text>
                <Text className="font-mono text-base text-gray-900 dark:text-gray-100">
                  {expiry?.deptExpiry ? new Date(expiry.deptExpiry).toLocaleDateString() : 'N/A'}
                </Text>
              </View>

              <View className="flex-row items-center justify-between rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-600 dark:bg-gray-700">
                <Text className="text-gray-600 dark:text-gray-300">Ward Expiry Date:</Text>
                <Text className="font-mono text-base text-gray-900 dark:text-gray-100">
                  {expiry?.wardExpiry ? new Date(expiry.wardExpiry).toLocaleDateString() : 'N/A'}
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Expired - Update Required
  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
      <ScrollView className="flex-1 p-6">
        <TouchableOpacity onPress={() => router.back()} className="mb-6">
          <Ionicons name="arrow-back" size={24} color={theme === 'dark' ? '#f3f4f6' : '#374151'} />
        </TouchableOpacity>

        <View className="rounded-3xl border-4 border-red-600 bg-white p-6 shadow-xl dark:bg-gray-800">
          <View className="mb-6 flex-row items-center border-b border-gray-200 pb-4 dark:border-gray-700">
            <Ionicons name="warning" size={36} color="#dc2626" className="mr-4" />
            <Text className="flex-1 text-3xl font-extrabold text-gray-900 dark:text-gray-100">
              Mandatory Update
            </Text>
          </View>

          <View className="mb-8 rounded-xl border border-red-300 bg-red-50 p-4 dark:border-red-700 dark:bg-red-900/30">
            <Text className="text-base font-medium text-red-800 dark:text-red-400">
              ⚠️ Your assignment has **expired**. Please complete the rotation and bed selection
              below to regain system access.
            </Text>
          </View>

          {isDeptExpired && (
            <View className="mb-6">
              <Text className="mb-4 border-b border-gray-200 pb-2 text-xl font-bold text-red-700 dark:border-gray-600 dark:text-red-400">
                Full Rotation Change
              </Text>

              {/* Department Selection */}
              <View className="mb-4">
                <Text className="mb-2 block text-sm font-bold text-gray-700 dark:text-gray-300">
                  Select New Department:
                </Text>
                <View className="rounded-xl border border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-700">
                  {departments.map((dept: Department) => (
                    <TouchableOpacity
                      key={dept._id}
                      onPress={() => handleDeptChange(dept._id)}
                      className={`border-b border-gray-200 p-4 last:border-b-0 dark:border-gray-600 ${
                        form.deptId === dept._id ? 'bg-blue-50 dark:bg-blue-900/30' : ''
                      }`}>
                      <Text className="font-medium text-gray-800 dark:text-gray-200">
                        {dept.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Ward Selection */}
              {selectedDept && (
                <View className="mb-4">
                  <Text className="mb-2 block text-sm font-bold text-gray-700 dark:text-gray-300">
                    Select Ward:
                  </Text>
                  <View className="rounded-xl border border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-700">
                    {selectedDept.wards.map((ward, idx) => (
                      <TouchableOpacity
                        key={idx}
                        onPress={() => handleWardChange(ward.name)}
                        className={`border-b border-gray-200 p-4 last:border-b-0 dark:border-gray-600 ${
                          form.wardName === ward.name ? 'bg-blue-50 dark:bg-blue-900/30' : ''
                        }`}>
                        <Text className="font-medium text-gray-800 dark:text-gray-200">
                          {ward.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}

              {/* Date Pickers */}
              <View className="mb-4 flex-row space-x-4">
                <View className="flex-1">
                  <Text className="mb-2 text-sm font-bold text-gray-700 dark:text-gray-300">
                    New Department Expiry:
                  </Text>
                  <TouchableOpacity
                    onPress={() => setShowDeptDatePicker(true)}
                    className="rounded-xl border border-gray-300 bg-white p-4 dark:border-gray-600 dark:bg-gray-700">
                    <Text className="text-gray-800 dark:text-gray-200">
                      {form.deptExpiry || 'Select Date'}
                    </Text>
                  </TouchableOpacity>
                </View>

                <View className="flex-1">
                  <Text className="mb-2 text-sm font-bold text-gray-700 dark:text-gray-300">
                    New Ward Expiry:
                  </Text>
                  <TouchableOpacity
                    onPress={() => setShowWardDatePicker(true)}
                    className="rounded-xl border border-gray-300 bg-white p-4 dark:border-gray-600 dark:bg-gray-700">
                    <Text className="text-gray-800 dark:text-gray-200">
                      {form.wardExpiry || 'Select Date'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}

          {isWardExpired && !isDeptExpired && (
            <View className="mb-6">
              <Text className="mb-4 border-b border-gray-200 pb-2 text-xl font-bold text-red-700 dark:border-gray-600 dark:text-red-400">
                Ward Rotation Change Only
              </Text>

              <View className="mb-4">
                <Text className="mb-2 text-sm font-bold text-gray-700 dark:text-gray-300">
                  Current Department (Valid)
                </Text>
                <TextInput
                  value={assignment?.department || 'N/A'}
                  editable={false}
                  className="rounded-xl border border-gray-300 bg-gray-100 p-4 text-gray-700 dark:border-gray-600 dark:bg-gray-600 dark:text-gray-300"
                />
              </View>

              {departments.find((d: Department) => d.name === assignment?.department)?.wards && (
                <View className="mb-4">
                  <Text className="mb-2 text-sm font-bold text-gray-700 dark:text-gray-300">
                    Select New Ward:
                  </Text>
                  <View className="rounded-xl border border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-700">
                    {departments
                      .find((d: Department) => d.name === assignment?.department)
                      ?.wards.map((ward, idx) => (
                        <TouchableOpacity
                          key={idx}
                          onPress={() => handleWardChange(ward.name)}
                          className={`border-b border-gray-200 p-4 last:border-b-0 dark:border-gray-600 ${
                            form.wardName === ward.name ? 'bg-blue-50 dark:bg-blue-900/30' : ''
                          }`}>
                          <Text className="font-medium text-gray-800 dark:text-gray-200">
                            {ward.name}
                          </Text>
                        </TouchableOpacity>
                      ))}
                  </View>
                </View>
              )}

              <View className="mb-4">
                <Text className="mb-2 text-sm font-bold text-gray-700 dark:text-gray-300">
                  New Ward Expiry Date:
                </Text>
                <TouchableOpacity
                  onPress={() => setShowWardDatePicker(true)}
                  className="rounded-xl border border-gray-300 bg-white p-4 dark:border-gray-600 dark:bg-gray-700">
                  <Text className="text-gray-800 dark:text-gray-200">
                    {form.wardExpiry || 'Select Date'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Bed Selection */}
          {selectedWard && (
            <View className="mb-6 rounded-xl border border-blue-300 bg-blue-50 p-5 dark:border-blue-700 dark:bg-blue-900/30">
              <Text className="mb-4 flex-row items-center text-lg font-extrabold text-blue-800 dark:text-blue-400">
                <Ionicons
                  name="bed"
                  size={24}
                  color={theme === 'dark' ? '#60a5fa' : '#1e40af'}
                  className="mr-3"
                />
                Select Beds to Cover:
              </Text>
              {bedsToDisplay.length === 0 ? (
                <Text className="rounded-lg border border-red-200 bg-white p-3 text-sm text-red-600 dark:border-red-700 dark:bg-gray-800 dark:text-red-400">
                  No free beds available in this ward currently. Please contact an admin.
                </Text>
              ) : (
                <View className="flex-row flex-wrap gap-3">
                  {bedsToDisplay.map((bed) => (
                    <TouchableOpacity
                      key={bed.id}
                      onPress={() => handleBedToggle(bed.id.toString())}
                      className={`rounded-xl border-2 p-3 ${
                        form.beds.includes(bed.id.toString())
                          ? 'border-blue-700 bg-blue-600'
                          : 'border-gray-200 bg-white dark:border-gray-600 dark:bg-gray-700'
                      }`}>
                      <Text
                        className={`font-medium ${
                          form.beds.includes(bed.id.toString())
                            ? 'text-white'
                            : 'text-gray-800 dark:text-gray-200'
                        }`}>
                        Bed {bed.id}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          )}

          {/* Submit Button */}
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={
              updateExpiryMutation.isPending ||
              (isDeptExpired && !form.deptExpiry) ||
              (isWardExpired && !form.wardExpiry) ||
              !form.wardName
            }
            className={`w-full flex-row items-center justify-center rounded-xl p-4 ${
              updateExpiryMutation.isPending ||
              (isDeptExpired && !form.deptExpiry) ||
              (isWardExpired && !form.wardExpiry) ||
              !form.wardName
                ? 'bg-gray-400'
                : 'bg-red-600'
            }`}>
            {updateExpiryMutation.isPending ? (
              <>
                <ActivityIndicator size="small" color="white" className="mr-3" />
                <Text className="text-lg font-extrabold uppercase tracking-wider text-white">
                  Submitting Update...
                </Text>
              </>
            ) : (
              <>
                <Ionicons name="checkmark-circle" size={20} color="white" className="mr-3" />
                <Text className="text-lg font-extrabold uppercase tracking-wider text-white">
                  Confirm & Update Rotation
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Date Pickers */}
        {showDeptDatePicker && (
          <DateTimePicker
            value={form.deptExpiry ? new Date(form.deptExpiry) : tomorrow}
            mode="date"
            display="default"
            minimumDate={tomorrow}
            onChange={(event, selectedDate) => {
              setShowDeptDatePicker(false);
              if (selectedDate) {
                setForm({ ...form, deptExpiry: selectedDate.toISOString().split('T')[0] });
              }
            }}
          />
        )}

        {showWardDatePicker && (
          <DateTimePicker
            value={form.wardExpiry ? new Date(form.wardExpiry) : tomorrow}
            mode="date"
            display="default"
            minimumDate={tomorrow}
            onChange={(event, selectedDate) => {
              setShowWardDatePicker(false);
              if (selectedDate) {
                setForm({ ...form, wardExpiry: selectedDate.toISOString().split('T')[0] });
              }
            }}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
