import React from 'react';
import { View, Text } from 'react-native';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';
import { Inbox } from 'lucide-react-native';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  message?: string;
  className?: string;
  children?: React.ReactNode;
}

export function EmptyState({ icon, title, message, className, children }: EmptyStateProps) {
  return (
    <View className={cn('flex-1 items-center justify-center px-6 py-12', className)}>
      <View className="mb-4 h-20 w-20 items-center justify-center rounded-full bg-muted">
        <Icon as={icon ?? Inbox} className="text-muted-foreground" size={36} />
      </View>
      <Text className="mb-2 text-center text-lg font-bold text-foreground">{title}</Text>
      {!!message && (
        <Text className="max-w-[280px] text-center text-sm text-muted-foreground">{message}</Text>
      )}
      {children}
    </View>
  );
}
