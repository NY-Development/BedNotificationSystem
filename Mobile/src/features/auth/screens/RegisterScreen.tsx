import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, type RegisterFormData } from '@/src/features/auth/schemas/authSchemas';
import { useRegister } from '@/src/hooks/useAuth';
import { useAuthStore } from '@/src/store/authStore';
import { Input } from '@/src/components/ui/Input';
import {
  Hospital,
  User,
  BadgeCheck,
  Mail,
  Stethoscope,
  ArrowRight,
  Lock,
  Phone,
  ChevronDown,
  Building2,
} from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';
import { ThemeToggle } from '@/src/components/ui/ThemeToggle';
import { FloatingHelpButton, QuickHelpModal } from '@/src/components/ui/QuickHelpModal';
import { MonthSubscriptionCard } from '@/src/components/ui/MonthSubscriptionCard';
import { useUniversityStore } from '@/src/store/universityStore';

export default function RegisterScreen() {
  const router = useRouter();
  const registerMutation = useRegister();
  const { setUserEmail } = useAuthStore();
  const { selectedUniversity, loadSelectedUniversity } = useUniversityStore();
  const [showRolePicker, setShowRolePicker] = useState(false);
  const [isHelpVisible, setIsHelpVisible] = useState(false);
  const [subscriptionPlan, setSubscriptionPlan] = useState<'monthly' | 'yearly'>('monthly');

  // Load selected university on mount
  React.useEffect(() => {
    loadSelectedUniversity();
  }, []);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      phone: '',
      role: undefined,
      subscriptionPlan: 'monthly',
      agreeToTerms: undefined,
    },
  });

  const selectedRole = watch('role');

  const onSubmit = (data: RegisterFormData) => {
    const { agreeToTerms, ...payload } = data;

    // Add subscription plan to payload (for non-intern roles)
    const finalPayload = {
      ...payload,
      plan: selectedRole !== 'intern' ? subscriptionPlan : 'monthly',
    };

    registerMutation.mutate(finalPayload, {
      onSuccess: () => {
        setUserEmail(data.email);
        router.push('/(auth)/verify-otp');
      },
    });
  };

  const roles = [
    { label: 'Clinical Year 1 (C1)', value: 'c1' as const },
    { label: 'Clinical Year 2 (C2)', value: 'c2' as const },
    { label: 'Medical Staff', value: 'intern' as const },
  ];

  return (
    <SafeAreaView className="flex-1 bg-card" edges={['bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1">
        {/* Header Section */}
        <View className="rounded-b-[2.5rem] bg-[#135bec] px-6 pb-10 pt-14 shadow-xl">
          {/* Top Row: Branding and Controls */}
          <View className="mb-8 flex-row items-start justify-between">
            {/* Left: Branding */}
            <View className="flex-row items-center gap-3">
              <View className="rounded-xl bg-white/20 p-2">
                <Icon as={Hospital} className="text-white" size={24} />
              </View>
              <Text className="text-xl font-bold tracking-tight text-white">BNS Portal</Text>
            </View>

            {/* Right: Controls (University + Theme) */}
            <View className="flex-row items-center gap-2">
              <Pressable
                onPress={() => router.push('/(auth)/university-choice')}
                className="flex-row items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 active:bg-white/30">
                <Icon as={Building2} className="text-white/80" size={14} />
                <Text
                  className="max-w-[80px] text-[10px] font-black uppercase tracking-wider text-white"
                  numberOfLines={1}>
                  {selectedUniversity || 'Select'}
                </Text>
              </Pressable>

              <View className="rounded-full bg-white/10">
                <ThemeToggle variant="ghost" size={18} />
              </View>
            </View>
          </View>

          {/* Hero Content */}
          <View>
            <Text className="text-4xl font-black tracking-tighter text-white">Create Account</Text>
            <Text className="mt-1 text-base font-medium text-white/70">
              Register for the Bed Management System
            </Text>
          </View>
        </View>
        {/* Form */}
        <ScrollView
          className="flex-1 px-6 py-4"
          contentContainerClassName="gap-6 pb-8"
          keyboardShouldPersistTaps="handled">
          {/* Login Link */}
          <View className="mt-4 items-center">
            <Text className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Text onPress={() => router.push('/(auth)/login')} className="font-bold text-primary">
                Login
              </Text>
            </Text>
          </View>
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Full Name"
                icon={User}
                placeholder="Enter your full name"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.name?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="phone"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Staff ID / Phone"
                icon={Phone}
                placeholder="e.g. BNS-12345"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.phone?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Hospital Email"
                icon={Mail}
                placeholder="name@hospital.org"
                keyboardType="email-address"
                autoCapitalize="none"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.email?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Password"
                icon={Lock}
                placeholder="Create a strong password"
                secureTextEntry
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.password?.message}
              />
            )}
          />

          {/* Role Selection */}
          <View className="gap-2">
            <View className="flex-row items-center gap-2">
              <Icon as={Stethoscope} className="text-primary" size={18} />
              <Text className="text-sm font-semibold text-foreground">Role Selection</Text>
            </View>
            <Pressable
              onPress={() => setShowRolePicker(!showRolePicker)}
              className="h-14 w-full flex-row items-center justify-between rounded-lg border border-border bg-card px-4">
              <Text className={selectedRole ? 'text-foreground' : 'text-muted-foreground'}>
                {selectedRole
                  ? roles.find((r) => r.value === selectedRole)?.label
                  : 'Select your role'}
              </Text>
              <Icon as={ChevronDown} className="text-muted-foreground" size={20} />
            </Pressable>
            {!!showRolePicker && (
              <View className="overflow-hidden rounded-lg border border-border bg-card">
                {roles.map((role) => (
                  <Pressable
                    key={role.value}
                    onPress={() => {
                      setValue('role', role.value);
                      setShowRolePicker(false);
                    }}
                    className="border-b border-border px-4 py-3 active:bg-accent">
                    <Text
                      className={
                        selectedRole === role.value
                          ? 'font-semibold text-primary'
                          : 'text-foreground'
                      }>
                      {role.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            )}
            {!!errors.role && (
              <Text className="ml-1 text-xs text-destructive">{errors.role.message}</Text>
            )}
          </View>

          {/* Subscription Plan Selection */}
          {selectedRole !== 'intern' ? (
            <View className="gap-4">
              <View className="flex-row items-center gap-2">
                <View className="h-[2px] flex-1 bg-border" />
                <Text className="px-2 text-xs font-bold uppercase tracking-widest text-primary">
                  Plan Selection
                </Text>
                <View className="h-[2px] flex-1 bg-border" />
              </View>

              <View className="flex-row justify-center">
                <MonthSubscriptionCard
                  isSelected={subscriptionPlan === 'monthly'}
                  onSelect={() => {
                    setSubscriptionPlan('monthly');
                    setValue('subscriptionPlan', 'monthly');
                  }}
                />
              </View>
            </View>
          ) : (
            <View className="rounded-[2rem] border-2 border-indigo-200 bg-indigo-50 p-6 dark:border-indigo-500/20 dark:bg-indigo-500/10">
              <View className="flex-row items-center gap-4">
                <View className="rounded-full bg-indigo-600 px-3 py-1">
                  <Text className="text-xs font-black uppercase tracking-wider text-white">
                    Verified Free
                  </Text>
                </View>
                <Text className="flex-1 text-sm font-bold italic leading-tight text-indigo-900 dark:text-indigo-300">
                  Standard medical staff access enabled (No subscription required).
                </Text>
              </View>
            </View>
          )}

          {/* Terms */}
          <Controller
            control={control}
            name="agreeToTerms"
            render={({ field: { onChange, value } }) => (
              <Pressable
                onPress={() => onChange(value ? undefined : true)}
                className="flex-row items-start gap-3 pt-2">
                <View
                  className={`mt-1 h-5 w-5 items-center justify-center rounded border ${
                    value === true ? 'border-primary bg-primary' : 'border-border'
                  }`}>
                  {value === true && <Text className="text-xs font-bold text-white">✓</Text>}
                </View>
                <Text className="flex-1 text-xs leading-relaxed text-muted-foreground">
                  I agree to the <Text className="font-medium text-primary">Terms of Service</Text>{' '}
                  and <Text className="font-medium text-primary">Privacy Policy</Text> regarding
                  clinical data handling.
                </Text>
              </Pressable>
            )}
          />
          {!!errors.agreeToTerms && (
            <Text className="ml-1 text-xs text-destructive">{errors.agreeToTerms.message}</Text>
          )}

          {/* Register Button */}
          <Pressable
            onPress={handleSubmit(onSubmit)}
            disabled={!!registerMutation.isPending}
            className="mb-4 mt-4 h-14 w-full flex-row items-center justify-center gap-2 rounded-lg bg-primary shadow-lg active:opacity-90">
            <Text className="text-lg font-bold text-white">
              {registerMutation.isPending ? 'Registering...' : 'Register Account'}
            </Text>
            {!registerMutation.isPending && (
              <Icon as={ArrowRight} className="text-white" size={20} />
            )}
          </Pressable>

          {/* Error Message */}
          {!!registerMutation.error && (
            <View className="mt-4 rounded-lg bg-destructive/10 px-4 py-3">
              <Text className="text-sm font-medium text-destructive">
                {registerMutation.error instanceof Error
                  ? registerMutation.error.message
                  : 'An unexpected error occurred. Please try again.'}
              </Text>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Quick Help Support */}
      <FloatingHelpButton onPress={() => setIsHelpVisible(true)} />
      <QuickHelpModal isVisible={isHelpVisible} onClose={() => setIsHelpVisible(false)} />
    </SafeAreaView>
  );
}
