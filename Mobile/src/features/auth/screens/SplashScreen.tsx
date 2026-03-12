import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScreenWrapper } from '@/src/components/layout/ScreenWrapper';
import { OnboardingScreen } from '@/src/components/ui/OnboardingScreen';
import { BedDouble, Activity } from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';
import { ThemeToggle } from '@/src/components/ui/ThemeToggle';

export default function SplashScreen() {
  const router = useRouter();
  const progress = useRef(new Animated.Value(0)).current;
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Check if user has seen the tour
        const hasSeenTour = await AsyncStorage.getItem('hasSeenBnsTour');

        // Start the splash animation
        Animated.timing(progress, {
          toValue: 1,
          duration: 2500,
          useNativeDriver: false,
        }).start(() => {
          if (hasSeenTour === 'true') {
            // User has seen onboarding, go to welcome screen
            router.replace('/(onboarding)/welcome');
          } else {
            // Show onboarding
            setShowOnboarding(true);
            setIsLoading(false);
          }
        });
      } catch (error) {
        console.error('Error checking onboarding status:', error);
        // On error, show onboarding to be safe
        setShowOnboarding(true);
        setIsLoading(false);
      }
    };

    initializeApp();
  }, [progress, router]);

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    router.replace('/(onboarding)/welcome');
  };

  // Show onboarding if needed
  if (showOnboarding && !isLoading) {
    return <OnboardingScreen onComplete={handleOnboardingComplete} />;
  }

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
      <View className="h-12 w-full items-end">
        <ThemeToggle variant="ghost" />
      </View>
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
