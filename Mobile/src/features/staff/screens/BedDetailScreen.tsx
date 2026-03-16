import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDepartments, useAdmitPatient, useDischargePatient } from '@/src/hooks/useBeds';
import { LoadingSpinner } from '@/src/components/ui/LoadingSpinner';
import { Badge } from '@/src/components/ui/Badge';
import { getAIPrediction } from '@/src/services/aiService';
import {
  BedDouble,
  ArrowRightLeft,
  Save,
  LogOut,
  ChevronRight,
  ChevronLeft,
  Brain,
  ShieldAlert,
  Lock,
} from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';
import { ThemeToggle } from '@/src/components/ui/ThemeToggle';

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
  const [transferBedId, setTransferBedId] = useState('');

  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState('');
  const [sex, setSex] = useState('Male');
  const [complaint, setComplaint] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [riskLevel, setRiskLevel] = useState<'Low' | 'Medium' | 'High'>('High');
  const [isPredicting, setIsPredicting] = useState(false);

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

  const selectedTransferDept = useMemo(
    () => departments?.find((d) => d._id === transferDeptId),
    [departments, transferDeptId]
  );

  const transferWards = selectedTransferDept?.wards ?? [];
  const selectedTransferWard = transferWards.find((w) => w.name === transferWard);
  const availableTransferBeds = (selectedTransferWard?.beds ?? []).filter(
    (candidate) => candidate.status === 'available'
  );

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

  const normalizeRiskLevel = (risk?: string): 'Low' | 'Medium' | 'High' | null => {
    if (!risk) return null;
    const normalized = risk.toLowerCase();
    if (normalized.includes('high')) return 'High';
    if (normalized.includes('medium')) return 'Medium';
    if (normalized.includes('low')) return 'Low';
    return null;
  };

  const handleAIPredict = async () => {
    if (!complaint.trim()) {
      Alert.alert('Chief Complaint Required', 'Please enter a chief complaint first.');
      return;
    }

    setIsPredicting(true);
    try {
      const data = await getAIPrediction(complaint, 'groq');
      if (data?.diagnosis) {
        setDiagnosis(data.diagnosis);
      }

      const mappedRisk = normalizeRiskLevel(data?.riskLevel);
      if (mappedRisk) {
        setRiskLevel(mappedRisk);
      }

      Alert.alert('AI Analysis Complete', 'Clinical diagnosis has been updated.');
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        'AI service is currently unavailable. Please try again.';
      Alert.alert('AI Prediction Failed', message);
    } finally {
      setIsPredicting(false);
    }
  };

  const statusBadge = isOccupied
    ? 'destructive'
    : bed.status === 'cleaning'
      ? 'warning'
      : 'success';
  const statusLabel = bed.status.charAt(0).toUpperCase() + bed.status.slice(1);

  const cardTone = isOccupied
    ? 'border-destructive/20 bg-destructive/5'
    : 'border-success/20 bg-success/5';

  const riskTone =
    riskLevel === 'High'
      ? 'text-destructive'
      : riskLevel === 'Medium'
        ? 'text-warning'
        : 'text-success';

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="border-b border-border bg-card px-4 py-3 shadow-sm">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-3">
            <Pressable onPress={() => router.back()} className="rounded-full p-2 active:opacity-70">
              <Icon as={ChevronLeft} className="text-primary" size={24} />
            </Pressable>
            <Text className="text-lg font-bold tracking-tight text-foreground">Bed {bed.id}</Text>
          </View>

          <View className="flex-row items-center gap-2">
            {isOccupied ? (
              <View className="flex-row items-center gap-1.5 rounded-full bg-destructive/15 px-3 py-1">
                <View className="h-2 w-2 rounded-full bg-destructive" />
                <Text className="text-xs font-bold uppercase tracking-wider text-destructive">
                  {statusLabel}
                </Text>
              </View>
            ) : (
              <Badge label={statusLabel} variant={statusBadge} />
            )}
            <ThemeToggle variant="outline" />
          </View>
        </View>
      </View>

      <ScrollView className="flex-1" contentContainerClassName="gap-6 px-4 py-4 pb-24">
        {/* Transfer Protocol Section */}
        {isOccupied && (
          <View className="rounded-2xl border border-primary/20 bg-card p-4 shadow-sm">
            <View className="mb-4 flex-row items-center gap-2">
              <Icon as={ArrowRightLeft} className="text-primary" size={18} />
              <Text className="text-sm font-semibold uppercase tracking-wide text-foreground">
                Transfer Protocol
              </Text>
            </View>

            {/* Department Selection */}
            <View className="mb-4">
              <View className="mb-2 flex-row items-center justify-between">
                <Text className="ml-1 text-[10px] font-bold uppercase text-muted-foreground">
                  Target Department
                </Text>
                <Text className="text-[10px] font-bold text-primary">
                  {selectedTransferDept?.name || 'Required'}
                </Text>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerClassName="gap-2">
                {departments?.map((candidate) => (
                  <Pressable
                    key={candidate._id}
                    onPress={() => {
                      setTransferDeptId(candidate._id);
                      setTransferWard('');
                      setTransferBedId('');
                    }}
                    className={`rounded-lg border px-4 py-2.5 ${
                      transferDeptId === candidate._id
                        ? 'border-primary bg-primary/10'
                        : 'border-border bg-accent'
                    }`}>
                    <Text
                      className={`text-xs font-semibold ${
                        transferDeptId === candidate._id ? 'text-primary' : 'text-muted-foreground'
                      }`}>
                      {candidate.name}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>

            {/* Ward Selection */}
            <View className="mb-4">
              <View className="mb-2 flex-row items-center justify-between">
                <Text className="ml-1 text-[10px] font-bold uppercase text-muted-foreground">
                  Target Ward
                </Text>
                <Text className="text-[10px] font-bold text-primary">
                  {transferWard || 'Select Dept First'}
                </Text>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerClassName="gap-2">
                {transferWards.length === 0 ? (
                  <View className="rounded-lg border border-dashed border-border px-4 py-2.5">
                    <Text className="text-xs italic text-muted-foreground">
                      Waiting for department...
                    </Text>
                  </View>
                ) : (
                  transferWards.map((candidate) => (
                    <Pressable
                      key={candidate.name}
                      onPress={() => {
                        setTransferWard(candidate.name);
                        setTransferBedId('');
                      }}
                      className={`rounded-lg border px-4 py-2.5 ${
                        transferWard === candidate.name
                          ? 'border-primary bg-primary/10'
                          : 'border-border bg-accent'
                      }`}>
                      <Text
                        className={`text-xs font-semibold ${
                          transferWard === candidate.name ? 'text-primary' : 'text-muted-foreground'
                        }`}>
                        {candidate.name}
                      </Text>
                    </Pressable>
                  ))
                )}
              </ScrollView>
            </View>

            {/* Target Bed Selection */}
            <View className="mb-4">
              <View className="mb-2 flex-row items-center justify-between">
                <Text className="ml-1 text-[10px] font-bold uppercase text-muted-foreground">
                  Available Beds
                </Text>
                <Text className="text-[10px] font-bold text-primary">
                  {transferBedId
                    ? `Selected: Bed ${availableTransferBeds.find((b) => b._id === transferBedId)?.id}`
                    : 'Required'}
                </Text>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerClassName="gap-2">
                {availableTransferBeds.length === 0 ? (
                  <View className="rounded-lg border border-dashed border-border px-4 py-2.5">
                    <Text className="text-xs italic text-muted-foreground">
                      {transferWard ? 'No beds available' : 'Waiting for ward...'}
                    </Text>
                  </View>
                ) : (
                  availableTransferBeds.map((candidate) => (
                    <Pressable
                      key={candidate._id}
                      onPress={() => setTransferBedId(candidate._id)}
                      className={`rounded-lg border px-4 py-2.5 ${
                        transferBedId === candidate._id
                          ? 'border-primary bg-primary/10'
                          : 'border-border bg-accent'
                      }`}>
                      <Text
                        className={`text-xs font-semibold ${
                          transferBedId === candidate._id ? 'text-primary' : 'text-muted-foreground'
                        }`}>
                        Bed {candidate.id}
                      </Text>
                    </Pressable>
                  ))
                )}
              </ScrollView>
            </View>

            <Pressable className="mt-2 h-12 flex-row items-center justify-center gap-2 rounded-xl bg-primary active:opacity-90">
              <Text className="font-semibold text-primary-foreground">Initialize Transfer</Text>
              <Icon as={ChevronRight} className="text-primary-foreground" size={18} />
            </Pressable>
          </View>
        )}

        <View className={`rounded-[40px] border p-6 shadow-lg ${cardTone}`}>
          <View className="mb-8 flex-row items-center gap-4">
            <View
              className={`h-14 w-14 items-center justify-center rounded-full ${
                isOccupied
                  ? 'bg-destructive shadow-lg shadow-destructive/30'
                  : 'bg-success shadow-lg shadow-success/30'
              }`}>
              <Icon as={BedDouble} className="text-primary-foreground" size={28} />
            </View>
            <View>
              <Text className="text-2xl font-bold text-foreground">Bed {bed.id}</Text>
              <View className="mt-1 flex-row items-center gap-1.5">
                <Icon as={Lock} className="text-muted-foreground" size={14} />
                <Text className="text-sm text-muted-foreground">
                  {bed.assignedUser ? `Assigned To: ${bed.assignedUser.name}` : 'Unassigned'}
                </Text>
              </View>
            </View>
          </View>

          <View className="mb-8 gap-4">
            <View className="mb-2 border-b border-destructive/20 pb-2">
              <Text className="text-xs font-black uppercase tracking-[0.2em] text-destructive">
                Administrative Info
              </Text>
            </View>

            <View className="gap-1">
              <Text className="ml-1 text-[11px] font-bold uppercase text-muted-foreground">
                Full Name
              </Text>
              <TextInput
                className="rounded-xl bg-card px-4 py-3 text-foreground"
                value={fullName || bed.assignedUser?.name || ''}
                onChangeText={setFullName}
                placeholder="Enter patient full name"
                placeholderTextColor="#94A3B8"
              />
            </View>

            <View className="flex-row gap-3">
              <View className="flex-1 gap-1">
                <Text className="ml-1 text-[11px] font-bold uppercase text-muted-foreground">
                  Age
                </Text>
                <TextInput
                  className="rounded-xl bg-card px-4 py-3 text-foreground"
                  value={age}
                  onChangeText={setAge}
                  keyboardType="numeric"
                  placeholder="0"
                  placeholderTextColor="#94A3B8"
                />
              </View>
              <View className="flex-1 gap-1">
                <Text className="ml-1 text-[11px] font-bold uppercase text-muted-foreground">
                  Sex
                </Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerClassName="gap-2">
                  {['Male', 'Female', 'Other'].map((candidate) => (
                    <Pressable
                      key={candidate}
                      onPress={() => setSex(candidate)}
                      className={`rounded-xl border px-3 py-3 ${
                        sex === candidate ? 'border-primary bg-primary/10' : 'border-border bg-card'
                      }`}>
                      <Text
                        className={`text-xs font-semibold ${
                          sex === candidate ? 'text-primary' : 'text-muted-foreground'
                        }`}>
                        {candidate}
                      </Text>
                    </Pressable>
                  ))}
                </ScrollView>
              </View>
            </View>

            <View className="gap-1">
              <Text className="ml-1 text-[11px] font-bold uppercase text-muted-foreground">
                Chief Complaint
              </Text>
              <TextInput
                multiline
                numberOfLines={3}
                className="rounded-xl bg-card px-4 py-3 text-foreground"
                value={complaint}
                onChangeText={setComplaint}
                placeholder="Describe symptoms..."
                placeholderTextColor="#94A3B8"
                textAlignVertical="top"
              />
            </View>
          </View>

          <View className="mb-8 gap-4">
            <View className="mb-2 flex-row items-center justify-between border-b border-destructive/20 pb-2">
              <Text className="text-xs font-black uppercase tracking-[0.2em] text-destructive">
                Clinical Analysis
              </Text>
              <Pressable
                onPress={handleAIPredict}
                disabled={isPredicting}
                className="flex-row items-center gap-1 rounded-full bg-warning px-3 py-1 active:opacity-80">
                <Icon as={Brain} className="text-foreground" size={12} />
                <Text className="text-[10px] font-bold text-foreground">
                  {isPredicting ? 'ANALYZING...' : 'AI PREDICT'}
                </Text>
              </Pressable>
            </View>

            <View className="gap-1">
              <Text className="ml-1 text-[11px] font-bold uppercase text-muted-foreground">
                Clinical Diagnosis
              </Text>
              <TextInput
                multiline
                numberOfLines={4}
                className="rounded-xl border-2 border-destructive/40 bg-card px-4 py-3 text-foreground"
                value={diagnosis}
                onChangeText={setDiagnosis}
                placeholder="Enter clinical diagnosis..."
                placeholderTextColor="#94A3B8"
                textAlignVertical="top"
              />
            </View>

            <View className="gap-1">
              <Text className="ml-1 text-[11px] font-bold uppercase text-muted-foreground">
                Risk Level
              </Text>
              <View className="flex-row gap-2">
                {(['Low', 'Medium', 'High'] as const).map((candidate) => (
                  <Pressable
                    key={candidate}
                    onPress={() => setRiskLevel(candidate)}
                    className={`flex-1 rounded-xl border px-3 py-3 ${
                      riskLevel === candidate
                        ? candidate === 'High'
                          ? 'border-destructive bg-destructive/10'
                          : candidate === 'Medium'
                            ? 'border-warning bg-warning/10'
                            : 'border-success bg-success/10'
                        : 'border-border bg-card'
                    }`}>
                    <Text
                      className={`text-center text-xs font-bold ${
                        riskLevel === candidate
                          ? candidate === 'High'
                            ? 'text-destructive'
                            : candidate === 'Medium'
                              ? 'text-warning'
                              : 'text-success'
                          : 'text-muted-foreground'
                      }`}>
                      {candidate === 'Low'
                        ? 'Low Risk'
                        : candidate === 'Medium'
                          ? 'Medium Risk'
                          : 'High Risk'}
                    </Text>
                  </Pressable>
                ))}
              </View>
              <View className="mt-1 flex-row items-center gap-1">
                <Icon as={ShieldAlert} className={riskTone} size={14} />
                <Text className={`text-xs font-semibold ${riskTone}`}>{riskLevel} Risk</Text>
              </View>
            </View>
          </View>

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
                <Text className="font-bold text-primary-foreground">
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
