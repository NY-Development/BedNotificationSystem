import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { cn } from '@/lib/utils';
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';
import { ThemeToggle } from '@/src/components/ui/ThemeToggle';

interface HeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  rightElement?: React.ReactNode;
  rightAction?: React.ReactNode;
  showThemeToggle?: boolean;
  className?: string;
}

export function Header({
  title,
  subtitle,
  showBack = false,
  rightElement,
  rightAction,
  showThemeToggle = true,
  className,
}: HeaderProps) {
  const router = useRouter();

  const right = rightElement ?? rightAction;

  return (
    <View
      className={cn(
        'flex-row items-center justify-between border-b border-border bg-card px-4 py-3',
        className
      )}>
      <View className="flex-1 flex-row items-center gap-2">
        {!!showBack && (
          <Pressable onPress={() => router.back()} className="-ml-2 p-2">
            <Icon as={ChevronLeft} className="text-primary" size={24} />
          </Pressable>
        )}
        <View className="flex-1">
          <Text className="text-lg font-bold text-foreground" numberOfLines={1}>
            {title}
          </Text>
          {!!subtitle && <Text className="text-xs text-muted-foreground">{subtitle}</Text>}
        </View>
      </View>
      <View className="flex-row items-center gap-2">
        {right}
        {showThemeToggle && <ThemeToggle variant="ghost" />}
      </View>
    </View>
  );
}
