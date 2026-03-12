import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDepartments } from '@/src/hooks/useBeds';
import { useAddDepartment, useDeleteDepartment } from '@/src/hooks/useAdmin';
import { Header } from '@/src/components/layout/Header';
import { LoadingSpinner } from '@/src/components/ui/LoadingSpinner';
import { Modal } from '@/src/components/ui/Modal';
import {
  Building2,
  ChevronDown,
  PlusCircle,
  Trash2,
  TrendingUp,
  AlertTriangle,
} from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';

export default function DepartmentsScreen() {
  const router = useRouter();
  const { data: departments, isLoading } = useDepartments();
  const addDepartment = useAddDepartment();
  const deleteDepartment = useDeleteDepartment();
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);

  const stats = useMemo(() => {
    if (!departments) return { depts: 0, wards: 0, totalBeds: 0, occupied: 0 };
    let wards = 0;
    let totalBeds = 0;
    let occupied = 0;
    departments.forEach((d) => {
      wards += d.wards.length;
      d.wards.forEach((w) => {
        totalBeds += w.beds.length;
        occupied += w.beds.filter((b) => b.status === 'occupied').length;
      });
    });
    const pct = totalBeds > 0 ? Math.round((occupied / totalBeds) * 100) : 0;
    return { depts: departments.length, wards, totalBeds, occupied, pct };
  }, [departments]);

  const handleAdd = () => {
    if (!newName.trim()) return;
    addDepartment.mutate(newName.trim(), {
      onSuccess: () => {
        setNewName('');
        setShowAdd(false);
      },
    });
  };

  const handleDelete = (deptId: string, name: string) => {
    Alert.alert('Delete Department', `Delete "${name}" and all its wards?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteDepartment.mutate(deptId) },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <Header title="Departments View" showBack />

      {/* Quick Stats */}
      <View className="flex-row gap-3 px-4 pt-4">
        <View className="flex-1 rounded-xl border border-primary/30 bg-primary/5 p-4">
          <Text className="text-xs uppercase tracking-wider text-muted-foreground">Depts</Text>
          <Text className="text-2xl font-bold text-foreground">{stats.depts}</Text>
          <View className="flex-row items-center gap-1">
            <Icon as={TrendingUp} className="text-green-500" size={12} />
            <Text className="text-xs font-bold text-green-500">Stable</Text>
          </View>
        </View>
        <View className="flex-1 rounded-xl border border-border bg-card p-4">
          <Text className="text-xs uppercase tracking-wider text-muted-foreground">Wards</Text>
          <Text className="text-2xl font-bold text-foreground">{stats.wards}</Text>
        </View>
        <View className="flex-1 rounded-xl border border-border bg-card p-4">
          <Text className="text-xs uppercase tracking-wider text-muted-foreground">Occupancy</Text>
          <Text className="text-2xl font-bold text-foreground">{stats.pct}%</Text>
          {(stats.pct ?? 0) > 75 && (
            <View className="flex-row items-center gap-1">
              <Icon as={AlertTriangle} className="text-orange-500" size={12} />
              <Text className="text-xs font-bold text-orange-500">High</Text>
            </View>
          )}
        </View>
      </View>

      {/* Section Title */}
      <View className="flex-row items-center justify-between px-4 pb-2 pt-5">
        <Text className="text-lg font-bold text-foreground">Departments</Text>
        <Pressable onPress={() => setShowAdd(true)} className="flex-row items-center gap-1">
          <Icon as={PlusCircle} className="text-primary" size={16} />
          <Text className="text-sm font-semibold text-primary">Add Dept</Text>
        </Pressable>
      </View>

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <ScrollView className="flex-1 px-4" contentContainerClassName="gap-4 pb-24 pt-2">
          {departments?.map((dept) => {
            const isOpen = expanded === dept._id;
            return (
              <View
                key={dept._id}
                className="overflow-hidden rounded-xl border border-border bg-card">
                <Pressable
                  onPress={() => setExpanded(isOpen ? null : dept._id)}
                  className="flex-row items-center justify-between bg-muted/50 p-4">
                  <View className="flex-row items-center gap-3">
                    <View className="h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Icon as={Building2} className="text-primary" size={20} />
                    </View>
                    <View>
                      <Text className="font-bold text-foreground">{dept.name}</Text>
                      <Text className="text-xs text-muted-foreground">
                        {dept.wards.length} Wards assigned
                      </Text>
                    </View>
                  </View>
                  <View className="flex-row items-center gap-2">
                    <Pressable onPress={() => handleDelete(dept._id, dept.name)} hitSlop={8}>
                      <Icon as={Trash2} className="text-red-400" size={16} />
                    </Pressable>
                    <Icon
                      as={ChevronDown}
                      className={`text-muted-foreground ${isOpen ? 'rotate-180' : ''}`}
                      size={20}
                    />
                  </View>
                </Pressable>
                {isOpen && (
                  <View className="px-4 py-3 pl-16">
                    {dept.wards.length === 0 ? (
                      <Text className="text-xs text-muted-foreground">No wards yet.</Text>
                    ) : (
                      dept.wards.map((w) => (
                        <Pressable
                          key={w._id}
                          onPress={() =>
                            router.push({
                              pathname: '/(admin)/wards',
                              params: { deptId: dept._id, deptName: dept.name },
                            })
                          }
                          className="py-2">
                          <Text className="text-sm font-medium text-foreground">
                            {w.name}{' '}
                            <Text className="text-muted-foreground">({w.beds.length} beds)</Text>
                          </Text>
                        </Pressable>
                      ))
                    )}
                  </View>
                )}
              </View>
            );
          })}
        </ScrollView>
      )}

      {/* Add Modal */}
      <Modal visible={showAdd} onClose={() => setShowAdd(false)} title="Add Department">
        <View className="gap-4">
          <TextInput
            className="h-12 rounded-xl border border-border bg-muted px-4 text-base text-foreground"
            placeholder="Department name"
            placeholderTextColor="#94A3B8"
            value={newName}
            onChangeText={setNewName}
          />
          <Pressable
            onPress={handleAdd}
            className="h-12 items-center justify-center rounded-xl bg-primary active:opacity-90">
            <Text className="font-bold text-white">
              {addDepartment.isPending ? 'Adding...' : 'Add Department'}
            </Text>
          </Pressable>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
