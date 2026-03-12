import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMyAssignment } from '@/src/hooks/useAssignments';
import { Header } from '@/src/components/layout/Header';
import { StatCard } from '@/src/components/ui/StatCard';
import { Badge } from '@/src/components/ui/Badge';
import { LoadingSpinner } from '@/src/components/ui/LoadingSpinner';
import { EmptyState } from '@/src/components/ui/EmptyState';
import {
  ClipboardList,
  AlertTriangle,
  CheckCircle,
  BedDouble,
  ChevronRight,
  Filter,
} from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';

export default function AssignmentsScreen() {
  const router = useRouter();
  const { data: assignment, isLoading } = useMyAssignment();

  const isExpired = assignment?.status === 'expired';
  const bedCount = assignment?.beds?.length ?? 0;

  return (
    <SafeAreaView className="flex-1 bg-background">
      <Header
        title="My Assignments"
        rightAction={
          <Pressable className="h-10 w-10 items-center justify-center rounded-full border border-border bg-card">
            <Icon as={Filter} className="text-muted-foreground" size={20} />
          </Pressable>
        }
      />

      <ScrollView className="flex-1" contentContainerClassName="px-5 py-6 pb-24">
        {/* Summary Stats */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="gap-3 mb-8">
          <StatCard title="Active" value={assignment && !isExpired ? 1 : 0} icon={ClipboardList} />
          <StatCard title="Beds" value={bedCount} icon={BedDouble} iconBgClassName="bg-orange-50" />
          <StatCard
            title="Status"
            value={isExpired ? 'Expired' : 'Active'}
            icon={CheckCircle}
            iconBgClassName="bg-green-50"
          />
        </ScrollView>

        {/* List */}
        <View className="mb-4 flex-row items-center justify-between">
          <Text className="text-lg font-bold text-foreground">Current Tasks</Text>
          <Text className="text-sm font-semibold text-primary">View all</Text>
        </View>

        {isLoading ? (
          <LoadingSpinner />
        ) : !assignment ? (
          <EmptyState title="All caught up!" message="No active assignments at the moment." />
        ) : (
          <View className="gap-4">
            {/* Assignment Card */}
            <Pressable
              onPress={() => router.push('/(staff)/beds')}
              className="rounded-2xl border border-border bg-card p-5 shadow-sm active:opacity-90">
              <View className="mb-3 flex-row items-start justify-between">
                <View className="flex-row items-center gap-3">
                  <View className="h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Icon as={ClipboardList} className="text-primary" size={24} />
                  </View>
                  <View>
                    <Text className="text-base font-bold text-foreground">
                      {assignment.wardName}
                    </Text>
                    <Text className="mt-0.5 text-xs text-muted-foreground">
                      {bedCount} bed{bedCount !== 1 ? 's' : ''} assigned
                    </Text>
                  </View>
                </View>
                <Badge
                  label={isExpired ? 'Expired' : 'Active'}
                  variant={isExpired ? 'destructive' : 'success'}
                />
              </View>

              <View className="mb-3 h-px bg-border" />

              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-4">
                  <View>
                    <Text className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      Location
                    </Text>
                    <View className="flex-row items-center gap-1.5">
                      <Icon as={BedDouble} className="text-primary" size={16} />
                      <Text className="font-semibold text-primary">{assignment.wardName}</Text>
                    </View>
                  </View>
                  <View className="h-8 w-px bg-border" />
                  <View>
                    <Text className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      Status
                    </Text>
                    <Text className="text-sm font-medium text-foreground">
                      {isExpired ? 'Expired' : 'In Progress'}
                    </Text>
                  </View>
                </View>
                <View className="h-8 w-8 items-center justify-center rounded-full bg-accent">
                  <Icon as={ChevronRight} className="text-muted-foreground" size={20} />
                </View>
              </View>
            </Pressable>

            {/* Expiry Info */}
            {assignment.deptExpiry && (
              <View className="flex-row items-center gap-3 rounded-xl border border-warning/20 bg-warning/10 p-4">
                <Icon as={AlertTriangle} className="text-warning" size={20} />
                <View className="flex-1">
                  <Text className="text-sm font-semibold text-foreground">Assignment Expiry</Text>
                  <Text className="text-xs text-muted-foreground">
                    Dept: {new Date(assignment.deptExpiry).toLocaleDateString()} • Ward:{' '}
                    {new Date(assignment.wardExpiry).toLocaleDateString()}
                  </Text>
                </View>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
