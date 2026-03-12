import React from 'react';
import { View, Text, type ViewProps } from 'react-native';
import { cn } from '@/lib/utils';

interface CardProps extends ViewProps {
  title?: string;
  subtitle?: string;
}

export function Card({ title, subtitle, className, children, ...props }: CardProps) {
  return (
    <View
      className={cn('rounded-2xl border border-border bg-card p-5 shadow-sm', className)}
      {...props}>
      {!!title && (
        <View className="mb-3">
          <Text className="text-lg font-bold text-foreground">{title}</Text>
          {!!subtitle && <Text className="mt-1 text-sm text-muted-foreground">{subtitle}</Text>}
        </View>
      )}
      {children}
    </View>
  );
}
