import React, { useEffect, useMemo, useState } from 'react';
import { View, Pressable, Text, Platform, ActivityIndicator } from 'react-native';
import { cn } from '@/lib/utils';
import { usePathname, useRouter } from 'expo-router';
import type { LucideIcon } from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';
import {
  LayoutDashboard,
  BedDouble,
  Bell,
  ClipboardList,
  UserCog,
  Users,
  Headset,
  UserCircle,
} from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface TabItem {
  label: string;
  icon: LucideIcon;
  path: string;
}

const staffTabs: TabItem[] = [
  { label: 'Home', icon: LayoutDashboard, path: '/(staff)/dashboard' },
  { label: 'Beds', icon: BedDouble, path: '/(staff)/beds' },
  { label: 'Alerts', icon: Bell, path: '/(staff)/notifications' },
  { label: 'Tasks', icon: ClipboardList, path: '/(staff)/assignments' },
  { label: 'Profile', icon: UserCircle, path: '/(staff)/profile' },
];

const adminTabs: TabItem[] = [
  { label: 'Home', icon: LayoutDashboard, path: '/(admin)/dashboard' },
  { label: 'Users', icon: Users, path: '/(admin)/users' },
  { label: 'Tasks', icon: ClipboardList, path: '/(admin)/assignments' },
  { label: 'Support', icon: Headset, path: '/(admin)/support-inbox' },
  { label: 'Profile', icon: UserCog, path: '/(admin)/profile' },
];

interface BottomNavProps {
  variant?: 'staff' | 'admin';
}

export function BottomNav({ variant = 'staff' }: BottomNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const tabs = variant === 'admin' ? adminTabs : staffTabs;
  const [isBedsNavigating, setIsBedsNavigating] = useState(false);

  const isOnBedsRoute = useMemo(() => pathname.includes('/beds'), [pathname]);

  useEffect(() => {
    if (isBedsNavigating && isOnBedsRoute) {
      setIsBedsNavigating(false);
    }
  }, [isBedsNavigating, isOnBedsRoute]);

  useEffect(() => {
    if (!isBedsNavigating) return;

    const timeout = setTimeout(() => {
      setIsBedsNavigating(false);
    }, 30000);

    return () => clearTimeout(timeout);
  }, [isBedsNavigating]);

  const handleTabPress = (tab: TabItem) => {
    if (tab.path.includes('/beds')) {
      setIsBedsNavigating(true);
    }

    router.push(tab.path as never);
  };

  return (
    <>
      {isBedsNavigating && (
        <View className="absolute inset-0 z-50 items-center justify-center bg-background/80">
          <View className="items-center gap-3 rounded-2xl border border-border bg-card px-6 py-5">
            <ActivityIndicator size="large" color="hsl(221, 83%, 53%)" />
            <Text className="text-sm font-semibold text-foreground">Opening Bed Management...</Text>
            <Text className="text-xs text-muted-foreground">
              Preparing cached and latest ward data
            </Text>
          </View>
        </View>
      )}

      <SafeAreaView
        className="absolute bottom-0 left-0 right-0 border-t border-border bg-card"
        style={Platform.OS === 'ios' ? { paddingBottom: 20 } : { paddingBottom: 6 }}>
        <View className="flex-row items-end justify-around px-2">
          {tabs.map((tab) => {
            const isActive =
              pathname === tab.path.replace(/\(.*?\)/, '').replace('//', '/') ||
              pathname.startsWith(tab.path.split(')')[1] || '___');
            const segment = tab.path.split('/').pop() ?? '';
            const active = pathname.includes(segment);

            return (
              <Pressable
                key={tab.path}
                onPress={() => handleTabPress(tab)}
                className="flex-1 items-center pb-1">
                <View
                  className={cn(
                    'mb-1 items-center justify-center rounded-2xl px-5 transition-colors',
                    active ? 'bg-primary/10' : 'bg-transparent'
                  )}>
                  <Icon
                    as={tab.icon}
                    className={cn(active ? 'text-primary' : 'text-muted-foreground')}
                    size={22}
                  />
                </View>
                <Text
                  className={cn(
                    'text-[10px]',
                    active ? 'font-bold text-primary' : 'font-medium text-muted-foreground'
                  )}>
                  {tab.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </SafeAreaView>
    </>
  );
}
