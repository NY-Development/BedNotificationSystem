import React from 'react';
import { View, Text } from 'react-native';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  iconBgClassName?: string;
  className?: string;
}

export function StatCard({
  title,
  value,
  icon,
  trend,
  trendUp,
  iconBgClassName,
  className,
}: StatCardProps) {
  return (
    <View
      className={cn(
        'min-w-[140px] flex-1 rounded-xl border border-border bg-card p-4 shadow-sm',
        className
      )}>
      <View className="mb-2 flex-row items-center justify-between">
        <Text className="text-sm font-medium text-muted-foreground">{title}</Text>
        {!!icon && (
          <View
            className={cn(
              'h-8 w-8 items-center justify-center rounded-lg',
              iconBgClassName ?? 'bg-primary/10'
            )}>
            <Icon as={icon} className="text-primary" size={16} />
          </View>
        )}
      </View>
      <Text className="text-2xl font-bold text-foreground">{value}</Text>
      {!!trend && (
        <Text
          className={cn('mt-1 text-xs font-medium', trendUp ? 'text-success' : 'text-destructive')}>
          {trend}
        </Text>
      )}
    </View>
  );
}
