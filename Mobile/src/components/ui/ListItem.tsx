import React from 'react';
import { View, Text, Pressable, type PressableProps } from 'react-native';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';
import { ChevronRight } from 'lucide-react-native';

interface ListItemProps extends PressableProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  iconBgClassName?: string;
  rightElement?: React.ReactNode;
  showChevron?: boolean;
  className?: string;
}

export function ListItem({
  title,
  subtitle,
  icon,
  iconBgClassName,
  rightElement,
  showChevron = false,
  className,
  ...props
}: ListItemProps) {
  return (
    <Pressable
      className={cn(
        'flex-row items-center justify-between rounded-2xl border border-border bg-card p-4 active:opacity-80',
        className
      )}
      {...props}>
      <View className="flex-1 flex-row items-center gap-3">
        {!!icon && (
          <View
            className={cn(
              'h-10 w-10 items-center justify-center rounded-xl',
              iconBgClassName ?? 'bg-primary/10'
            )}>
            <Icon as={icon} className="text-primary" size={22} />
          </View>
        )}
        <View className="flex-1">
          <Text className="text-base font-semibold text-foreground">{title}</Text>
          {!!subtitle && <Text className="mt-0.5 text-sm text-muted-foreground">{subtitle}</Text>}
        </View>
      </View>
      {rightElement}
      {!!showChevron && <Icon as={ChevronRight} className="ml-2 text-muted-foreground" size={20} />}
    </Pressable>
  );
}
