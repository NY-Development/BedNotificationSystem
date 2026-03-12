import React from 'react';
import { View, Text } from 'react-native';
import { cn } from '@/lib/utils';

type BadgeVariant = 'default' | 'success' | 'warning' | 'destructive' | 'info' | 'outline';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-primary',
  success: 'bg-success',
  warning: 'bg-warning',
  destructive: 'bg-destructive',
  info: 'bg-info',
  outline: 'bg-transparent border border-border',
};

const textStyles: Record<BadgeVariant, string> = {
  default: 'text-primary-foreground',
  success: 'text-white',
  warning: 'text-white',
  destructive: 'text-white',
  info: 'text-white',
  outline: 'text-foreground',
};

export function Badge({ label, variant = 'default', className }: BadgeProps) {
  return (
    <View className={cn('self-start rounded-full px-2.5 py-1', variantStyles[variant], className)}>
      <Text className={cn('text-xs font-bold', textStyles[variant])}>{label}</Text>
    </View>
  );
}
