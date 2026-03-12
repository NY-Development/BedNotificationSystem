import React, { useRef } from 'react';
import { View, Text, Pressable, Image, Animated } from 'react-native';
import { Building2, ArrowRight, Activity, CheckCircle2 } from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';
import { useThemeStore } from '@/src/store/themeStore';
import { cn } from '@/lib/utils';

interface University {
  id: string;
  name: string;
  description: string;
  image: string;
}

interface ChoiceCardProps {
  university: University;
  onSelect: (university: University) => void;
}

export function ChoiceCard({ university, onSelect }: ChoiceCardProps) {
  const { colorScheme } = useThemeStore();
  const isDark = colorScheme === 'dark';
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    // Animate press
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.98,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onSelect(university);
    });
  };

  return (
    <Animated.View
      style={{
        transform: [{ scale: scaleAnim }],
      }}>
      <Pressable
        onPress={handlePress}
        className={cn(
          'relative mb-6 rounded-[2rem] border p-8 shadow-lg transition-all duration-500',
          isDark ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'
        )}>
        {/* Header */}
        <View className="mb-6 flex-row items-start justify-between">
          <View
            className={cn(
              'h-14 w-14 items-center justify-center rounded-2xl',
              isDark ? 'bg-indigo-500/20' : 'bg-indigo-50'
            )}>
            <Icon
              as={Building2}
              className={isDark ? 'text-indigo-400' : 'text-indigo-600'}
              size={28}
            />
          </View>

          <View className="items-end">
            <Text
              className={cn(
                'mb-1 text-xs font-bold uppercase tracking-widest',
                isDark ? 'text-slate-500' : 'text-slate-400'
              )}>
              Database Status
            </Text>
            <View
              className={cn(
                'flex-row items-center gap-2 rounded-full px-3 py-1',
                isDark ? 'bg-emerald-500/20' : 'bg-emerald-50'
              )}>
              <View className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <Text
                className={cn(
                  'text-xs font-black uppercase',
                  isDark ? 'text-emerald-400' : 'text-emerald-700'
                )}>
                Synchronized
              </Text>
            </View>
          </View>
        </View>

        {/* University Name */}
        <Text
          className={cn(
            'mb-4 text-3xl font-black uppercase italic tracking-tighter',
            isDark ? 'text-white' : 'text-slate-900'
          )}>
          {university.name}
        </Text>

        {/* Image Container */}
        <View className="relative mb-6 h-48 overflow-hidden rounded-[1.5rem] border">
          <Image source={{ uri: university.image }} className="h-full w-full" resizeMode="cover" />
          <View className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
          <View className="absolute bottom-4 left-4 flex-row items-center gap-2">
            <Icon as={Activity} className="animate-pulse text-white" size={16} />
            <Text className="text-xs font-bold uppercase tracking-widest text-white">
              Active Registry
            </Text>
          </View>
        </View>

        {/* Description */}
        <Text
          className={cn(
            'mb-6 text-sm font-medium leading-relaxed',
            isDark ? 'text-slate-400' : 'text-slate-500'
          )}>
          {university.description}
        </Text>

        {/* Footer */}
        <View
          className={cn(
            'flex-row items-center justify-between border-t pt-4',
            isDark ? 'border-slate-700' : 'border-slate-100'
          )}>
          <View className="flex-row items-center gap-2">
            <Icon
              as={CheckCircle2}
              className={isDark ? 'text-slate-400' : 'text-slate-400'}
              size={18}
            />
            <Text
              className={cn(
                'text-xs font-bold uppercase tracking-widest',
                isDark ? 'text-slate-500' : 'text-slate-500'
              )}>
              Enter Institution
            </Text>
          </View>

          <View className="flex-row items-center gap-2">
            <Text
              className={cn(
                'text-xs font-bold uppercase tracking-tighter',
                isDark ? 'text-indigo-400' : 'text-indigo-600'
              )}>
              Connect
            </Text>
            <Icon
              as={ArrowRight}
              className={isDark ? 'text-indigo-400' : 'text-indigo-600'}
              size={16}
            />
          </View>
        </View>

        {/* Bottom Accent */}
        <View
          className={cn(
            'absolute bottom-0 left-1/2 h-1 w-1/3 -translate-x-1/2 rounded-t-full',
            isDark ? 'bg-indigo-500' : 'bg-indigo-600'
          )}
        />
      </Pressable>
    </Animated.View>
  );
}
