import React from 'react';
import { View, Pressable, Text } from 'react-native';
import { cn } from '@/lib/utils';
import { usePathname, useRouter } from 'expo-router';
import type { LucideIcon } from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';
import { LayoutDashboard, BedDouble, Bell, Users, Settings } from 'lucide-react-native';

interface TabItem {
  label: string;
  icon: LucideIcon;
  path: string;
}

const staffTabs: TabItem[] = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/(staff)/dashboard' },
  { label: 'Beds', icon: BedDouble, path: '/(staff)/beds' },
  { label: 'Alerts', icon: Bell, path: '/(staff)/notifications' },
  { label: 'Staff', icon: Users, path: '/(staff)/assignments' },
  { label: 'Settings', icon: Settings, path: '/(staff)/profile' },
];

const adminTabs: TabItem[] = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/(admin)/dashboard' },
  { label: 'Users', icon: Users, path: '/(admin)/users' },
  { label: 'Alerts', icon: Bell, path: '/(admin)/assignments' },
  { label: 'Support', icon: Settings, path: '/(admin)/support' },
  { label: 'Profile', icon: Settings, path: '/(admin)/profile' },
];

interface BottomNavProps {
  variant?: 'staff' | 'admin';
}

export function BottomNav({ variant = 'staff' }: BottomNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const tabs = variant === 'admin' ? adminTabs : staffTabs;

  return (
    <View className="border-t border-border bg-card pb-6">
      <View className="h-16 flex-row items-center justify-around">
        {tabs.map((tab) => {
          const isActive = pathname.startsWith(tab.path);
          return (
            <Pressable
              key={tab.path}
              onPress={() => router.push(tab.path as never)}
              className="flex-1 items-center justify-center gap-1">
              <Icon
                as={tab.icon}
                className={cn(isActive ? 'text-primary' : 'text-muted-foreground')}
                size={22}
              />
              <Text
                className={cn(
                  'text-[10px] font-medium',
                  isActive ? 'font-bold text-primary' : 'text-muted-foreground'
                )}>
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
