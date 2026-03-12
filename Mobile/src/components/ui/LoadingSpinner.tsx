import React from 'react';
import { ActivityIndicator, View, Text } from 'react-native';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'small' | 'large';
  className?: string;
}

export function LoadingSpinner({ message, size = 'large', className }: LoadingSpinnerProps) {
  return (
    <View className={cn('flex-1 items-center justify-center', className)}>
      <ActivityIndicator size={size} color="#2563EB" />
      {!!message && <Text className="mt-3 text-sm text-muted-foreground">{message}</Text>}
    </View>
  );
}
