import React from 'react';
import { View, Text, Pressable, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenWrapper } from '@/src/components/layout/ScreenWrapper';
import { Hospital, ArrowRight } from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';
import { ThemeToggle } from '@/src/components/ui/ThemeToggle';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <ScreenWrapper>
      <View className="h-12 w-full" />

      {/* Header Logo */}
      <View className="flex-row items-center justify-between px-6 py-4">
        <View className="flex-row items-center gap-2">
          <View className="h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Icon as={Hospital} className="text-primary" size={24} />
          </View>
          <Text className="text-xl font-bold tracking-tight text-foreground">BNS</Text>
        </View>
        <ThemeToggle variant="ghost" />
      </View>

      {/* Main Content */}
      <View className="mb-30 flex-1 items-center justify-center px-6 pb-8 pt-4">
        {/* Hero Image Placeholder */}
        <View className="mb-8 aspect-square w-full max-w-[320px] items-center justify-center overflow-hidden rounded-2xl border border-border bg-card shadow-lg">
          <View className="absolute inset-0 rounded-full bg-primary/10 opacity-60 blur-3xl" />
          <Icon as={Hospital} className="text-primary" size={80} />
          {/* Floating badge */}
          <View className="absolute bottom-4 left-4 right-4 rounded-lg border border-border bg-card/90 p-3">
            <View className="flex-row items-center gap-3">
              <View className="h-8 w-8 items-center justify-center rounded-full bg-success/20">
                <Text className="text-xs font-bold text-success">✓</Text>
              </View>
              <View>
                <Text className="text-xs font-semibold text-foreground">Bed 402 Available</Text>
                <Text className="text-[10px] text-muted-foreground">Updated 2m ago</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Text Block */}
        <View className="max-w-[300px] items-center">
          <Text className="mb-4 text-center text-3xl font-bold leading-tight tracking-tight text-foreground">
            Optimize{'\n'}
            <Text className="text-primary">Patient Care</Text>
          </Text>
          <Text className="text-center text-base leading-relaxed text-muted-foreground">
            Streamline bed notifications and admissions with real-time updates for efficient
            hospital workflow.
          </Text>
        </View>
      </View>

      {/* Bottom Action Area */}
      <View className="mt-22 gap-3 px-6 pb-8">
        <Pressable
          onPress={() => router.push('/(auth)/register')}
          className="h-14 w-full items-center justify-center rounded-xl bg-primary shadow-md active:opacity-90">
          <View className="flex-row items-center gap-2">
            <Text className="text-base font-bold tracking-wide text-primary-foreground">
              Get Started
            </Text>
            <Icon as={ArrowRight} className="text-primary-foreground" size={20} />
          </View>
        </Pressable>

        <Pressable
          onPress={() => router.push('/(auth)/login')}
          className="h-14 w-full items-center justify-center rounded-xl border-2 border-border active:bg-accent">
          <Text className="text-base font-semibold tracking-wide text-foreground">Log In</Text>
        </Pressable>

        <View className="items-center pt-4">
          <Text className="text-xs font-medium text-muted-foreground">
            v2.4.0 • Enterprise Edition
          </Text>
        </View>
      </View>

      <View className="h-6 w-full" />
    </ScreenWrapper>
  );
}
