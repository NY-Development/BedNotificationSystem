import React from 'react';
import { Pressable } from 'react-native';
import { useColorScheme } from 'nativewind';
import { Sun, Moon } from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';
import { cn } from '@/lib/utils';
import { useThemeStore } from '@/src/store/themeStore';

interface ThemeToggleProps {
  className?: string;
  size?: number;
  variant?: 'default' | 'outline' | 'ghost';
}

export function ThemeToggle({ className, size = 20, variant = 'default' }: ThemeToggleProps) {
  const { colorScheme, setColorScheme: setNWScheme } = useColorScheme();
  const { setColorScheme: persistScheme } = useThemeStore();
  const isDark = colorScheme === 'dark';

  const toggle = () => {
    const next = isDark ? 'light' : 'dark';
    setNWScheme(next);
    persistScheme(next);
  };

  return (
    <Pressable
      onPress={toggle}
      className={cn(
        'items-center justify-center rounded-full',
        variant === 'outline' && 'border border-border bg-card',
        variant === 'default' && 'bg-accent',
        variant === 'ghost' && '',
        'h-10 w-10',
        className
      )}
      accessibilityLabel={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      accessibilityRole="button">
      <Icon
        as={isDark ? Sun : Moon}
        className={isDark ? 'text-yellow-400' : 'text-foreground'}
        size={size}
      />
    </Pressable>
  );
}
