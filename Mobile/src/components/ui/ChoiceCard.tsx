import React from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import { CheckCircle2, MapPin } from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';
import { useThemeStore } from '@/src/store/themeStore';
import { cn } from '@/lib/utils';

interface ChoiceCardProps {
  university: any;
  isSelected: boolean;
  onSelect: () => void;
}

export function ChoiceCard({ university, isSelected, onSelect }: ChoiceCardProps) {
  const { colorScheme } = useThemeStore();
  const isDark = colorScheme === 'dark';

  return (
    <Pressable
      onPress={onSelect}
      className={cn(
        'mb-3 flex-row items-center gap-4 rounded-xl border-2 p-4 shadow-sm',
        isSelected
          ? 'border-[#135bec] bg-white dark:bg-slate-800'
          : isDark
            ? 'border-slate-700 bg-slate-800'
            : 'border-slate-100 bg-white'
      )}>
      {/* Logo Container */}
      <View
        className={cn(
          'size-12 items-center justify-center overflow-hidden rounded-lg',
          isSelected ? 'bg-primary/10' : isDark ? 'bg-slate-700' : 'bg-slate-100'
        )}>
        {university.image ? (
          <Image source={{ uri: university.image }} className="h-full w-full" resizeMode="cover" />
        ) : (
          <Icon as={MapPin} size={20} className="text-slate-400" />
        )}
      </View>

      {/* Text Content */}
      <View className="flex-1">
        <Text className={cn('text-base font-semibold', isDark ? 'text-white' : 'text-slate-900')}>
          {university.name}
        </Text>
        <Text className="text-sm text-slate-500">{university.location || 'Ethiopia'}</Text>
      </View>

      {/* Selected Indicator */}
      {isSelected && (
        <View className="items-center justify-center">
          <Icon as={CheckCircle2} size={24} className="text-[#135bec]" />
        </View>
      )}
    </Pressable>
  );
}
