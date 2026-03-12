import React from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  CalendarX,
  Lock,
  CreditCard,
  Headset,
  BedDouble,
  ClipboardList,
  Bell,
  BarChart3,
} from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';

const lockedFeatures = [
  { icon: BedDouble, label: 'Bed Management System' },
  { icon: ClipboardList, label: 'Patient Assignments' },
  { icon: Bell, label: 'Real-time Notifications' },
  { icon: BarChart3, label: 'Analytics Dashboard' },
];

export default function ExpiredSubscriptionScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView contentContainerClassName="flex-grow items-center justify-center px-6 py-10">
        {/* Icon */}
        <View className="mb-8 rounded-full bg-warning/10 p-6">
          <Icon as={CalendarX} className="text-warning" size={64} />
        </View>

        {/* Badge */}
        <View className="mb-4 rounded-full bg-warning/10 px-4 py-1.5">
          <Text className="text-sm font-bold text-warning">Subscription Expired</Text>
        </View>

        {/* Title */}
        <Text className="mb-3 text-center text-3xl font-bold text-foreground">Plan Expired</Text>

        {/* Description */}
        <Text className="mb-8 max-w-xs text-center text-base leading-relaxed text-muted-foreground">
          Your hospital's BNS subscription has expired. Renew to restore access to all features.
        </Text>

        {/* Locked Features */}
        <View className="mb-10 w-full gap-4 rounded-2xl border border-border bg-card p-5">
          <View className="mb-1 flex-row items-center gap-2">
            <Icon as={Lock} className="text-muted-foreground" size={16} />
            <Text className="text-sm font-semibold text-muted-foreground">Locked Features</Text>
          </View>
          {lockedFeatures.map((feature) => (
            <View key={feature.label} className="flex-row items-center gap-3 opacity-50">
              <View className="rounded-lg bg-accent p-2">
                <Icon as={feature.icon} className="text-muted-foreground" size={20} />
              </View>
              <Text className="text-sm font-medium text-foreground">{feature.label}</Text>
            </View>
          ))}
        </View>

        {/* Actions */}
        <View className="w-full gap-3">
          <Pressable
            onPress={() => router.push('/(system)/subscription-plans')}
            className="h-14 w-full flex-row items-center justify-center gap-2 rounded-xl bg-primary shadow-lg active:opacity-90">
            <Icon as={CreditCard} className="text-white" size={20} />
            <Text className="text-base font-bold text-white">Renew Subscription</Text>
          </Pressable>

          <Pressable
            onPress={() => router.push('/(system)/support-center')}
            className="h-14 w-full flex-row items-center justify-center gap-2 rounded-xl border-2 border-border active:opacity-90">
            <Icon as={Headset} className="text-foreground" size={20} />
            <Text className="text-base font-bold text-foreground">Contact Support</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
