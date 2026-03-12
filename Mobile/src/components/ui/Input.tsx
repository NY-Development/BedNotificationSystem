import React from 'react';
import { TextInput, View, Text, type TextInputProps } from 'react-native';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  icon?: LucideIcon;
  containerClassName?: string;
}

export function Input({ label, error, icon, containerClassName, className, ...props }: InputProps) {
  return (
    <View className={cn('gap-1.5', containerClassName)}>
      {!!label && <Text className="ml-1 text-sm font-medium text-foreground">{label}</Text>}
      <View className="relative">
        {!!icon && (
          <View className="absolute bottom-0 left-3 top-0 z-10 justify-center">
            <Icon as={icon} className="text-muted-foreground" size={20} />
          </View>
        )}
        <TextInput
          className={cn(
            'h-14 w-full rounded-xl border border-border bg-card px-4 text-base text-foreground',
            'placeholder:text-muted-foreground',
            !!icon && 'pl-11',
            !!error && 'border-destructive',
            className
          )}
          placeholderTextColor="#94A3B8"
          {...props}
        />
      </View>
      {!!error && <Text className="ml-1 text-xs text-destructive">{error}</Text>}
    </View>
  );
}
