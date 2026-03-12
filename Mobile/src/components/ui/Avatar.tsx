import React from 'react';
import { View, Image, Text } from 'react-native';
import { cn } from '@/lib/utils';

interface AvatarProps {
  uri?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showStatus?: boolean;
  isOnline?: boolean;
}

const sizeMap = {
  sm: 'h-8 w-8',
  md: 'h-12 w-12',
  lg: 'h-16 w-16',
};

const textSizeMap = {
  sm: 'text-xs',
  md: 'text-base',
  lg: 'text-xl',
};

export function Avatar({
  uri,
  name,
  size = 'md',
  className,
  showStatus = false,
  isOnline = false,
}: AvatarProps) {
  const initials = name
    ? name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : '?';

  return (
    <View className={cn('relative', className)}>
      {uri ? (
        <Image
          source={{ uri }}
          className={cn('rounded-full border-2 border-card', sizeMap[size])}
        />
      ) : (
        <View
          className={cn('items-center justify-center rounded-full bg-primary/10', sizeMap[size])}>
          <Text className={cn('font-bold text-primary', textSizeMap[size])}>{initials}</Text>
        </View>
      )}
      {!!showStatus && (
        <View
          className={cn(
            'absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-card',
            isOnline ? 'bg-success' : 'bg-muted-foreground'
          )}
        />
      )}
    </View>
  );
}
