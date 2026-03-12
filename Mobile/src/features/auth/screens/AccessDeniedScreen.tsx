import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ShieldX, ArrowLeft, Headset } from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';

export default function AccessDeniedScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 items-center justify-center px-6 pb-10">
        {/* Icon */}
        <View className="mb-8 rounded-full bg-destructive/10 p-6">
          <Icon as={ShieldX} className="text-destructive" size={64} />
        </View>

        {/* Error Code */}
        <View className="mb-4 rounded-full bg-destructive/10 px-4 py-1.5">
          <Text className="text-sm font-bold text-destructive">Error 403</Text>
        </View>

        {/* Title */}
        <Text className="mb-3 text-center text-3xl font-bold text-foreground">Access Denied</Text>

        {/* Description */}
        <Text className="mb-10 max-w-xs text-center text-base leading-relaxed text-muted-foreground">
          You don't have permission to access this resource. Contact your hospital administrator for
          assistance.
        </Text>

        {/* Actions */}
        <View className="w-full gap-3">
          <Pressable
            onPress={() => router.replace('/')}
            className="h-14 w-full flex-row items-center justify-center gap-2 rounded-xl bg-primary shadow-lg active:opacity-90">
            <Icon as={ArrowLeft} className="text-white" size={20} />
            <Text className="text-base font-bold text-white">Go Back to Dashboard</Text>
          </Pressable>

          <Pressable
            onPress={() => router.push('/(system)/support-center')}
            className="h-14 w-full flex-row items-center justify-center gap-2 rounded-xl border-2 border-border active:opacity-90">
            <Icon as={Headset} className="text-foreground" size={20} />
            <Text className="text-base font-bold text-foreground">Contact Admin</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
