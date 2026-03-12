import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, GraduationCap, MapPin } from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';
import { ChoiceCard } from '@/src/components/ui/ChoiceCard';
import { useUniversityStore } from '@/src/store/universityStore';
import { useThemeStore } from '@/src/store/themeStore';
import { cn } from '@/lib/utils';

interface University {
  id: string;
  name: string;
  description: string;
  image: string;
}

export default function UniversityChoiceScreen() {
  const router = useRouter();
  const { colorScheme } = useThemeStore();
  const { universities, setSelectedUniversity, loadSelectedUniversity } = useUniversityStore();
  const [isLoading, setIsLoading] = useState(false);

  const isDark = colorScheme === 'dark';

  useEffect(() => {
    loadSelectedUniversity();
  }, []);

  const handleUniversitySelect = async (university: University) => {
    setIsLoading(true);
    try {
      await setSelectedUniversity(university.name);
      // Navigate back to previous screen
      router.back();
    } catch (error) {
      console.error('Error selecting university:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className={cn('flex-1', isDark ? 'bg-slate-900' : 'bg-white')}>
      {/* Header */}
      <View
        className={cn(
          'flex-row items-center justify-between border-b p-6',
          isDark ? 'border-slate-700' : 'border-slate-200'
        )}>
        <Pressable
          onPress={() => router.back()}
          className={cn('rounded-full p-2', isDark ? 'bg-slate-800' : 'bg-slate-100')}>
          <Icon as={ArrowLeft} className={isDark ? 'text-slate-300' : 'text-slate-600'} size={20} />
        </Pressable>
        <View className="flex-row items-center gap-3">
          <View
            className={cn('rounded-xl p-2', isDark ? 'bg-emerald-500/20' : 'bg-emerald-500/10')}>
            <Icon
              as={GraduationCap}
              className={isDark ? 'text-emerald-400' : 'text-emerald-600'}
              size={24}
            />
          </View>
          <View>
            <Text className={cn('text-xl font-bold', isDark ? 'text-white' : 'text-slate-900')}>
              Choose University
            </Text>
            <Text
              className={cn(
                'text-xs font-bold uppercase tracking-wider',
                isDark ? 'text-slate-500' : 'text-slate-400'
              )}>
              Medical Institution
            </Text>
          </View>
        </View>
        <View className="w-10" /> {/* Spacer for centering */}
      </View>

      {/* Content */}
      <ScrollView className="flex-1">
        {/* Header Message */}
        <View className="p-6">
          <View
            className={cn(
              'mb-6 rounded-2xl p-4',
              isDark
                ? 'border border-emerald-500/20 bg-emerald-500/10'
                : 'border border-emerald-100 bg-emerald-50'
            )}>
            <View className="mb-2 flex-row items-center gap-2">
              <Icon
                as={MapPin}
                className={isDark ? 'text-emerald-400' : 'text-emerald-600'}
                size={18}
              />
              <Text className={cn('font-bold', isDark ? 'text-emerald-300' : 'text-emerald-700')}>
                Ethiopian Medical Institutions
              </Text>
            </View>
            <Text
              className={cn(
                'text-sm leading-relaxed',
                isDark ? 'text-emerald-300/80' : 'text-emerald-700/80'
              )}>
              Select your medical university or hospital to access the appropriate bed management
              system and clinical rotation tracking.
            </Text>
          </View>

          {/* University Cards */}
          <View>
            <Text
              className={cn('mb-4 text-lg font-bold', isDark ? 'text-white' : 'text-slate-900')}>
              Available Institutions
            </Text>

            {universities.map((university) => (
              <ChoiceCard
                key={university.id}
                university={university}
                onSelect={handleUniversitySelect}
              />
            ))}
          </View>

          {/* Instructions */}
          <View className={cn('mt-4 rounded-xl p-4', isDark ? 'bg-slate-800/50' : 'bg-slate-50')}>
            <Text
              className={cn('mb-2 text-sm font-bold', isDark ? 'text-white' : 'text-slate-900')}>
              Note:
            </Text>
            <Text
              className={cn(
                'text-sm leading-relaxed',
                isDark ? 'text-slate-400' : 'text-slate-600'
              )}>
              Your selected institution will be used to configure the correct hospital database
              connections and rotation schedules. You can change this selection later in settings.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Loading Overlay */}
      {isLoading && (
        <View className="absolute inset-0 items-center justify-center bg-black/50">
          <View
            className={cn('items-center rounded-2xl p-6', isDark ? 'bg-slate-800' : 'bg-white')}>
            <Text className={cn('font-bold', isDark ? 'text-white' : 'text-slate-900')}>
              Selecting University...
            </Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}
