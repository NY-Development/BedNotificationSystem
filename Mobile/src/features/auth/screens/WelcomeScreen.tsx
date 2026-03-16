import React from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenWrapper } from '@/src/components/layout/ScreenWrapper';
import { Hospital, ArrowRight, CheckCircle2 } from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';
import { ThemeToggle } from '@/src/components/ui/ThemeToggle';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <ScreenWrapper>
      {/* 1. Header Row */}
      <View className="flex-row items-center justify-between px-6 pb-2 pt-4">
        <View className="flex-row items-center gap-2.5">
          <View className="h-10 w-10 items-center justify-center rounded-xl border border-primary/20 bg-primary/10">
            <Icon as={Hospital} className="text-primary" size={22} />
          </View>
          <Text className="text-xl font-black tracking-tighter text-foreground">BNS</Text>
        </View>
        <View className="rounded-full bg-secondary/50">
          <ThemeToggle variant="ghost" />
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="flex-grow justify-between px-6 py-8">
        {/* 2. Hero Visual Section */}
        <View className="items-center justify-center">
          <View className="relative aspect-square w-full max-w-[320px] items-center justify-center">
            {/* Ambient Background Glow */}
            <View className="absolute h-64 w-64 rounded-full bg-primary/10 blur-3xl" />

            {/* Main Card */}
            <View className="h-full w-full items-center justify-center overflow-hidden rounded-[40px] border border-border/50 bg-card/50 shadow-2xl">
              <View className="h-32 w-32 items-center justify-center rounded-full bg-primary/5">
                <Icon as={Hospital} className="text-primary/40" size={80} />
              </View>

              {/* Floating Dynamic Badge */}
              <View className="absolute bottom-6 left-6 right-6 rounded-2xl border border-white/20 bg-white/80 p-4 shadow-lg backdrop-blur-md dark:bg-slate-900/80">
                <View className="flex-row items-center gap-4">
                  <View className="h-10 w-10 items-center justify-center rounded-full bg-emerald-500/20">
                    <Icon as={CheckCircle2} className="text-emerald-500" size={20} />
                  </View>
                  <View>
                    <Text className="text-sm font-bold text-foreground">Bed 402 Available</Text>
                    <Text className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                      Real-time Sync • 2m ago
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* 3. Text Section */}
        <View className="mt-10 items-center">
          <Text className="text-center text-4xl font-black leading-[1.1] tracking-tighter text-foreground">
            Optimize{'\n'}
            <Text className="text-primary">Patient Care</Text>
          </Text>
          <Text className="mt-4 px-4 text-center text-base font-medium leading-relaxed text-muted-foreground">
            Streamline bed notifications and admissions with real-time updates for an efficient
            hospital workflow.
          </Text>
        </View>

        {/* 4. Action Area */}
        <View className="mt-12 gap-4">
          <Pressable
            onPress={() => router.push('/(auth)/register')}
            className="h-16 w-full flex-row items-center justify-center gap-3 rounded-2xl bg-primary shadow-xl shadow-primary/30 active:scale-[0.98] active:opacity-90">
            <Text className="text-lg font-bold tracking-tight text-primary-foreground">
              Get Started
            </Text>
            <Icon as={ArrowRight} className="text-primary-foreground" size={20} />
          </Pressable>

          <Pressable
            onPress={() => router.push('/(auth)/login')}
            className="h-16 w-full items-center justify-center rounded-2xl border-2 border-border bg-transparent active:bg-accent/50">
            <Text className="text-lg font-bold tracking-tight text-foreground">Log In</Text>
          </Pressable>

          <View className="items-center pt-2">
            <View className="flex-row items-center gap-2 rounded-full bg-muted/50 px-3 py-1">
              <View className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <Text className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                v2.4.0 • Enterprise Edition
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}
