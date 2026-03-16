import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Header } from '@/src/components/layout/Header';
import { CheckCircle, Lock } from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';

type PlanPeriod = 'monthly' | 'yearly';

interface Plan {
  name: string;
  subtitle: string;
  price: string;
  period?: string;
  features: string[];
  highlighted?: boolean;
  badge?: string;
  cta: string;
  ctaStyle: 'primary' | 'outline';
}

const PLANS: Plan[] = [
  {
    name: 'Basic',
    subtitle: 'Essential for small clinics.',
    price: '$29',
    period: '/ month',
    features: ['Up to 20 beds', 'Basic tagging', 'Email support'],
    cta: 'Current Plan',
    ctaStyle: 'outline',
  },
  {
    name: 'Pro',
    subtitle: 'For growing hospitals.',
    price: '$99',
    period: '/ month',
    features: ['Unlimited beds', 'Real-time analytics', 'Staff assignment', 'Priority support'],
    highlighted: true,
    badge: 'MOST POPULAR',
    cta: 'Upgrade to Pro',
    ctaStyle: 'primary',
  },
  {
    name: 'Enterprise',
    subtitle: 'For multi-location networks.',
    price: 'Custom',
    features: ['Multi-location', 'API Access', 'SSO Integration', 'Dedicated account manager'],
    cta: 'Contact Sales',
    ctaStyle: 'outline',
  },
];

export default function SubscriptionPlansScreen() {
  const router = useRouter();
  const [period, setPeriod] = useState<PlanPeriod>('monthly');

  return (
    <SafeAreaView className="flex-1 bg-background">
      <Header title="Subscription Plans" showBack />

      <ScrollView className="flex-1" contentContainerClassName="px-4 pb-24 pt-4">
        {/* Toggle */}
        <View className="mb-6 flex-row rounded-xl border border-border bg-card p-1.5">
          <Pressable
            onPress={() => setPeriod('monthly')}
            className={`h-9 flex-1 items-center justify-center rounded-lg ${
              period === 'monthly' ? 'bg-primary/10' : ''
            }`}>
            <Text
              className={`text-sm font-medium ${
                period === 'monthly' ? 'text-primary' : 'text-muted-foreground'
              }`}>
              Monthly
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setPeriod('yearly')}
            className={`relative h-9 flex-1 items-center justify-center rounded-lg ${
              period === 'yearly' ? 'bg-primary/10' : ''
            }`}>
            <Text
              className={`text-sm font-medium ${
                period === 'yearly' ? 'text-primary' : 'text-muted-foreground'
              }`}>
              Yearly
            </Text>
            <View className="absolute -right-2 -top-3 rounded-full bg-success px-1.5 py-0.5">
              <Text className="text-[10px] font-bold text-primary-foreground">-20%</Text>
            </View>
          </Pressable>
        </View>

        {/* Plan Cards */}
        <View className="gap-5">
          {PLANS.map((plan) => (
            <View
              key={plan.name}
              className={`rounded-2xl p-6 ${
                plan.highlighted
                  ? 'border-2 border-primary/20 bg-card shadow-lg'
                  : 'border border-border bg-card'
              } relative`}>
              {plan.badge && (
                <View className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1">
                  <Text className="text-xs font-bold text-primary-foreground">{plan.badge}</Text>
                </View>
              )}

              <View className={`flex-row items-start justify-between ${plan.badge ? 'mt-2' : ''}`}>
                <View>
                  <Text
                    className={`text-lg font-bold ${
                      plan.highlighted ? 'text-primary' : 'text-foreground'
                    }`}>
                    {plan.name}
                  </Text>
                  <Text className="text-sm text-muted-foreground">{plan.subtitle}</Text>
                </View>
              </View>

              <View className="mb-6 mt-4 flex-row items-baseline gap-1">
                <Text
                  className={`font-bold text-foreground ${
                    plan.highlighted ? 'text-4xl' : 'text-3xl'
                  }`}>
                  {plan.price === 'Custom'
                    ? plan.price
                    : period === 'yearly'
                      ? `$${Math.round(parseInt(plan.price.replace('$', ''), 10) * 0.8 * 12)}`
                      : plan.price}
                </Text>
                {plan.period && (
                  <Text className="text-sm text-muted-foreground">
                    {period === 'yearly' ? '/ year' : plan.period}
                  </Text>
                )}
              </View>

              <View className="mb-6 gap-3">
                {plan.features.map((feature) => (
                  <View key={feature} className="flex-row items-start gap-3">
                    <Icon as={CheckCircle} className="text-primary" size={18} />
                    <Text className="text-sm text-foreground">{feature}</Text>
                  </View>
                ))}
              </View>

              <Pressable
                onPress={() => router.push('/(system)/payment')}
                className={`h-12 items-center justify-center rounded-xl ${
                  plan.ctaStyle === 'primary' ? 'bg-primary shadow-lg' : 'border border-border'
                } active:opacity-90`}>
                <Text
                  className={`text-sm font-bold ${
                    plan.ctaStyle === 'primary' ? 'text-primary-foreground' : 'text-foreground'
                  }`}>
                  {plan.cta}
                </Text>
              </Pressable>
            </View>
          ))}
        </View>

        {/* Trust Footer */}
        <View className="mt-6 items-center gap-4">
          <Text className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Trusted Payment Methods
          </Text>
          <View className="flex-row gap-4 opacity-60">
            <View className="h-8 w-12 items-center justify-center rounded bg-muted">
              <Text className="text-xs font-bold italic text-muted-foreground">VISA</Text>
            </View>
            <View className="h-8 w-12 items-center justify-center rounded bg-muted">
              <Text className="text-xs font-bold text-muted-foreground">MC</Text>
            </View>
            <View className="h-8 w-12 items-center justify-center rounded bg-muted">
              <Text className="text-xs font-bold text-muted-foreground">stripe</Text>
            </View>
          </View>
          <View className="flex-row items-center gap-2">
            <Icon as={Lock} className="text-muted-foreground" size={14} />
            <Text className="text-xs text-muted-foreground">
              Secure payment via Stripe.{' '}
              <Text className="font-bold text-foreground">HIPAA Compliant.</Text>
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
