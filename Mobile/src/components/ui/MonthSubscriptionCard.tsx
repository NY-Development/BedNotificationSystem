import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { CheckCircle, Check } from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';
import { cn } from '@/lib/utils';
import { useThemeStore } from '@/src/store/themeStore';

interface MonthSubscriptionCardProps {
  isSelected: boolean;
  onSelect: () => void;
}

export function MonthSubscriptionCard({ isSelected, onSelect }: MonthSubscriptionCardProps) {
  const { colorScheme } = useThemeStore();
  const isDark = colorScheme === 'dark';
  const weekBill = 24.99;

  return (
    <Pressable
      onPress={onSelect}
      className={cn(
        'relative flex-1 rounded-[2rem] border-2 p-6 transition-all duration-300',
        isSelected
          ? isDark
            ? 'border-indigo-500 bg-slate-800 shadow-2xl'
            : 'scale-[1.02] border-indigo-500 bg-slate-900 shadow-2xl'
          : isDark
            ? 'border-slate-700 bg-slate-800/50 shadow-sm'
            : 'border-slate-200 bg-white shadow-sm'
      )}>
      {/* Radio Selector */}
      <View className="absolute right-6 top-6">
        <View
          className={cn(
            'flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all',
            isSelected
              ? 'border-indigo-500 bg-indigo-500'
              : isDark
                ? 'border-slate-600'
                : 'border-slate-300'
          )}>
          {isSelected && <View className="h-2.5 w-2.5 rounded-full bg-white" />}
        </View>
      </View>

      <View>
        <Text
          className={cn(
            'mb-1 text-xl font-black',
            isSelected ? 'text-white' : isDark ? 'text-white' : 'text-slate-900'
          )}>
          Weekly Plan
        </Text>

        <View className="mb-6 flex-row items-baseline gap-1">
          <Text
            className={cn(
              'text-4xl font-black tracking-tighter',
              isSelected ? 'text-white' : isDark ? 'text-white' : 'text-slate-900'
            )}>
            {weekBill}
          </Text>
          <Text
            className={cn(
              'text-sm font-bold uppercase tracking-widest',
              isSelected ? 'text-indigo-300' : isDark ? 'text-slate-400' : 'text-slate-400'
            )}>
            ETB/week
          </Text>
        </View>

        <View className="space-y-4">
          {[
            { label: 'Flexibility', desc: 'Short-term hospital trials.' },
            { label: 'Commitment', desc: 'Cancel any time you want.' },
            { label: 'Low Cost', desc: 'Perfect for tighter budgets.' },
          ].map((item, i) => (
            <View key={i} className="flex-row items-start gap-3">
              <Icon
                as={CheckCircle}
                className={cn(
                  'h-5 w-5 shrink-0',
                  isSelected ? 'text-indigo-400' : isDark ? 'text-indigo-400' : 'text-indigo-500'
                )}
                size={20}
              />
              <Text
                className={cn(
                  'text-xs leading-relaxed',
                  isSelected ? 'text-slate-300' : isDark ? 'text-slate-300' : 'text-slate-500'
                )}>
                <Text
                  className={cn(
                    'font-bold',
                    isSelected ? 'text-white' : isDark ? 'text-white' : 'text-slate-900'
                  )}>
                  {item.label}:
                </Text>{' '}
                {item.desc}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </Pressable>
  );
}
