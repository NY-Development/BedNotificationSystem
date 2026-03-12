import React, { useEffect, useRef } from 'react';
import { View, Text, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenWrapper } from '@/src/components/layout/ScreenWrapper';
import { BedDouble, Activity } from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';

export default function SplashScreen() {
  const router = useRouter();
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: 1,
      duration: 2500,
      useNativeDriver: false,
    }).start(() => {
      router.replace('/(onboarding)/welcome');
    });
  }, [progress, router]);

  const widthInterpolation = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const percentText = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 100],
  });

  return (
    <ScreenWrapper className="items-center justify-between p-8">
      <View className="h-12 w-full" />
      <View className="flex-1 items-center justify-center">
        <View className="mb-8 h-32 w-32 items-center justify-center rounded-[2.5rem] bg-card shadow-xl">
          <Icon as={BedDouble} className="text-primary" size={64} />
        </View>
        <View className="items-center">
          <Text className="text-5xl font-extrabold tracking-tight text-foreground">BNS</Text>
          <Text className="mt-3 text-sm font-bold uppercase tracking-widest text-foreground">
            Bed Notification System
          </Text>
        </View>
      </View>

      <View className="w-full max-w-xs gap-6">
        <View className="gap-3">
          <View className="flex-row items-center justify-between">
            <Text className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Initializing System
            </Text>
            <Animated.Text className="text-[10px] font-bold text-primary">
              {percentText.interpolate({
                inputRange: [0, 100],
                outputRange: ['0%', '100%'],
              })}
            </Animated.Text>
          </View>
          <View className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <Animated.View
              className="h-full rounded-full bg-primary"
              style={{ width: widthInterpolation }}
            />
          </View>
        </View>
        <Text className="text-center text-xs font-medium text-muted-foreground">
          Syncing hospital database...
        </Text>
      </View>

      <View className="mt-auto items-center pb-8">
        <View className="flex-row items-center gap-2">
          <Icon as={Activity} className="text-muted-foreground" size={14} />
          <Text className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            Powered by Hospital Operations Systems
          </Text>
        </View>
      </View>
    </ScreenWrapper>
  );
}
