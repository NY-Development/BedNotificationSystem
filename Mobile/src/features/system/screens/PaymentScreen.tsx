import React, { useMemo, useState } from 'react';
import { View, Text, Pressable, ScrollView, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Header } from '@/src/components/layout/Header';
import { Icon } from '@/components/ui/icon';
import { CreditCard, Lock, ShieldCheck, CalendarClock, CircleCheckBig } from 'lucide-react-native';

type PlanId = 'basic' | 'pro' | 'enterprise';

const plans: Array<{ id: PlanId; name: string; monthly: number; description: string }> = [
  {
    id: 'basic',
    name: 'Basic',
    monthly: 29,
    description: 'Essential workflow tools for small clinics.',
  },
  {
    id: 'pro',
    name: 'Pro',
    monthly: 99,
    description: 'Unlimited beds, assignments, and priority support.',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    monthly: 249,
    description: 'Multi-site capacity with extended integrations.',
  },
];

export default function PaymentScreen() {
  const router = useRouter();

  const [selectedPlan, setSelectedPlan] = useState<PlanId>('pro');
  const [cardNumber, setCardNumber] = useState('');
  const [cardholder, setCardholder] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const currentPlan = useMemo(
    () => plans.find((plan) => plan.id === selectedPlan) ?? plans[0],
    [selectedPlan]
  );

  const yearlyPrice = currentPlan.monthly * 12;

  const handlePay = () => {
    if (!cardNumber || !cardholder || !expiry || !cvv) {
      Alert.alert('Incomplete Payment', 'Please fill all card details before continuing.');
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      Alert.alert('Payment Successful', 'Your subscription is now active.', [
        {
          text: 'Continue',
          onPress: () => router.replace('/(staff)/dashboard'),
        },
      ]);
    }, 1300);
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <Header title="Complete Payment" subtitle="Secure renewal checkout" showBack />

      <ScrollView className="flex-1" contentContainerClassName="px-4 pb-20 pt-4">
        <View className="rounded-2xl border border-border bg-card p-4 shadow-sm">
          <View className="mb-3 flex-row items-center gap-2">
            <Icon as={CalendarClock} className="text-warning" size={18} />
            <Text className="text-xs font-bold uppercase tracking-widest text-warning">
              Subscription Renewal
            </Text>
          </View>
          <Text className="text-xl font-bold text-foreground">Choose Billing Plan</Text>
          <Text className="mt-1 text-sm text-muted-foreground">
            Select your preferred package and complete secure checkout.
          </Text>

          <View className="mt-4 gap-2">
            {plans.map((plan) => {
              const selected = plan.id === selectedPlan;
              return (
                <Pressable
                  key={plan.id}
                  onPress={() => setSelectedPlan(plan.id)}
                  className={`rounded-xl border p-3 ${
                    selected ? 'border-primary bg-primary/10' : 'border-border bg-background'
                  }`}>
                  <View className="flex-row items-center justify-between">
                    <Text
                      className={`text-sm font-bold ${selected ? 'text-primary' : 'text-foreground'}`}>
                      {plan.name}
                    </Text>
                    <Text
                      className={`text-sm font-bold ${selected ? 'text-primary' : 'text-foreground'}`}>
                      ${plan.monthly}/mo
                    </Text>
                  </View>
                  <Text className="mt-1 text-xs text-muted-foreground">{plan.description}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View className="mt-4 rounded-2xl border border-border bg-card p-4 shadow-sm">
          <View className="mb-4 flex-row items-center gap-2">
            <Icon as={CreditCard} className="text-primary" size={18} />
            <Text className="text-sm font-bold text-foreground">Card Information</Text>
          </View>

          <View className="gap-3">
            <TextInput
              value={cardNumber}
              onChangeText={setCardNumber}
              keyboardType="number-pad"
              placeholder="Card Number"
              className="rounded-xl border border-border bg-background px-3 py-3 text-foreground"
            />
            <TextInput
              value={cardholder}
              onChangeText={setCardholder}
              placeholder="Cardholder Name"
              className="rounded-xl border border-border bg-background px-3 py-3 text-foreground"
            />
            <View className="flex-row gap-3">
              <TextInput
                value={expiry}
                onChangeText={setExpiry}
                placeholder="MM/YY"
                className="flex-1 rounded-xl border border-border bg-background px-3 py-3 text-foreground"
              />
              <TextInput
                value={cvv}
                onChangeText={setCvv}
                keyboardType="number-pad"
                placeholder="CVV"
                secureTextEntry
                className="w-28 rounded-xl border border-border bg-background px-3 py-3 text-foreground"
              />
            </View>
          </View>

          <View className="mt-4 rounded-xl border border-border bg-background p-3">
            <View className="mb-2 flex-row items-center justify-between">
              <Text className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Plan Summary
              </Text>
              <Icon as={CircleCheckBig} className="text-success" size={16} />
            </View>
            <View className="flex-row items-center justify-between">
              <Text className="text-sm text-foreground">{currentPlan.name} (Yearly)</Text>
              <Text className="text-sm font-bold text-foreground">${yearlyPrice}</Text>
            </View>
            <Text className="mt-1 text-xs text-muted-foreground">
              Billed annually. You can manage plans anytime.
            </Text>
          </View>

          <Pressable
            onPress={handlePay}
            disabled={isProcessing}
            className="mt-4 h-12 items-center justify-center rounded-xl bg-primary active:opacity-90">
            <Text className="font-bold text-primary-foreground">
              {isProcessing ? 'Processing Payment...' : `Pay $${yearlyPrice}`}
            </Text>
          </Pressable>

          <Pressable
            onPress={() => router.push('/(system)/subscription-plans')}
            className="mt-3 h-11 items-center justify-center rounded-xl border border-border active:opacity-90">
            <Text className="text-sm font-semibold text-foreground">Manage Billing Plans</Text>
          </Pressable>

          <View className="mt-4 flex-row items-center justify-center gap-2">
            <Icon as={Lock} className="text-muted-foreground" size={14} />
            <Icon as={ShieldCheck} className="text-muted-foreground" size={14} />
            <Text className="text-xs text-muted-foreground">End-to-end encrypted checkout</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
