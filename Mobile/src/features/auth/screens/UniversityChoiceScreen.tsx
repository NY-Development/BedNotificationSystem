import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, ScrollView, Pressable, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Search } from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';
import { ChoiceCard } from '@/src/components/ui/ChoiceCard';
import { useUniversityStore } from '@/src/store/universityStore';
import { useThemeStore } from '@/src/store/themeStore';
import { cn } from '@/lib/utils';

export default function UniversityChoiceScreen() {
  const router = useRouter();
  const { colorScheme } = useThemeStore();
  const { universities, setSelectedUniversity, loadSelectedUniversity } = useUniversityStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const isDark = colorScheme === 'dark';

  useEffect(() => {
    loadSelectedUniversity();
  }, []);

  const filteredUniversities = useMemo(() => {
    return universities.filter((u) => u.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [searchQuery, universities]);

  const handleContinue = async () => {
    const selected = universities.find((u) => u.id === selectedId);
    if (!selected) return;

    setIsLoading(true);
    try {
      await setSelectedUniversity(selected.name);
      router.back();
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className={cn('flex-1', isDark ? 'bg-[#101622]' : 'bg-[#f6f6f8]')}>
      {/* Top Navigation */}
      <View className="flex-row items-center p-4">
        <Pressable onPress={() => router.back()} className="p-2">
          <Icon as={ArrowLeft} className={isDark ? 'text-white' : 'text-slate-900'} size={24} />
        </Pressable>
        <Text
          className={cn('ml-2 flex-1 text-lg font-bold', isDark ? 'text-white' : 'text-slate-900')}>
          Medical App
        </Text>
      </View>

      {/* Progress Indicator */}
      <View className="px-4 py-2">
        <View className="mb-2 flex-row justify-between">
          <Text className={isDark ? 'text-white' : 'text-slate-900'}>Onboarding Progress</Text>
          <Text className={isDark ? 'text-slate-400' : 'text-slate-500'}>Step 1 of 2</Text>
        </View>
        <View className="h-2 w-full overflow-hidden rounded-full bg-primary/20">
          <View className="h-full bg-[#135bec]" style={{ width: '50%' }} />
        </View>
      </View>

      {/* Header Section */}
      <View className="px-4 pb-2 pt-6">
        <Text
          className={cn(
            'text-3xl font-bold tracking-tight',
            isDark ? 'text-white' : 'text-slate-900'
          )}>
          Affiliate Your Account
        </Text>
        <Text className={cn('mt-2 text-base', isDark ? 'text-slate-400' : 'text-slate-600')}>
          Select your medical university to continue setup
        </Text>
      </View>

      {/* Search Bar */}
      <View className="px-4 py-4">
        <View
          className={cn(
            'h-14 flex-row items-center rounded-xl px-4 shadow-sm',
            isDark ? 'bg-slate-800' : 'bg-white'
          )}>
          <Icon as={Search} size={20} className="text-slate-500" />
          <TextInput
            placeholder="Search universities..."
            placeholderTextColor="#94a3b8"
            className={cn('ml-3 flex-1 text-base', isDark ? 'text-white' : 'text-slate-900')}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Scrollable List */}
      <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: 20 }}>
        {filteredUniversities.map((university) => (
          <ChoiceCard
            key={university.id}
            university={university}
            isSelected={selectedId === university.id}
            onSelect={() => setSelectedId(university.id)}
          />
        ))}
      </ScrollView>

      {/* Sticky Footer Action */}
      <View
        className={cn(
          'border-t p-4',
          isDark ? 'border-slate-800 bg-slate-900/80' : 'border-slate-100 bg-white/80'
        )}>
        <Pressable
          onPress={handleContinue}
          disabled={!selectedId || isLoading}
          className={cn(
            'w-full items-center rounded-xl py-4 shadow-lg',
            !selectedId ? 'bg-slate-300 dark:bg-slate-700' : 'bg-[#135bec]'
          )}>
          <Text className={cn('text-lg font-bold', !selectedId ? 'text-slate-500' : 'text-white')}>
            {isLoading ? 'Processing...' : 'Continue'}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
