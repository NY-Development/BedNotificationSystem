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
} from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';

export default function RegisterScreen() {
  const router = useRouter();
  const registerMutation = useRegister();
  const { setUserEmail } = useAuthStore();
  const [showRolePicker, setShowRolePicker] = useState(false);

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
      plan: 'month',
      agreeToTerms: undefined,
    },
  });

  const selectedRole = watch('role');

  const onSubmit = (data: RegisterFormData) => {
    const { agreeToTerms, ...payload } = data;
    registerMutation.mutate(payload, {
      onSuccess: () => {
        setUserEmail(data.email);
        router.push('/(auth)/verify-otp');
      },
    });
  };

  const roles = [
    { label: 'Staff', value: 'user' as const },
    { label: 'Supervisor', value: 'supervisor' as const },
    { label: 'Administrator', value: 'admin' as const },
  ];

  return (
    <SafeAreaView className="flex-1 bg-card" edges={['bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1">
        {/* Header Section */}
        <View className="rounded-b-xl bg-primary px-6 pb-8 pt-12">
          <View className="mb-4 flex-row items-center gap-3">
            <Icon as={Hospital} className="text-white" size={28} />
            <Text className="text-2xl font-bold tracking-tight text-white">BNS Portal</Text>
          </View>
          <Text className="text-3xl font-bold leading-tight text-white/90">Create Account</Text>
          <Text className="mt-2 text-sm text-white/70">Register for the Bed Management System</Text>
        </View>

        {/* Form */}
        <ScrollView
          className="flex-1 px-6 py-8"
          contentContainerClassName="gap-6 pb-8"
          keyboardShouldPersistTaps="handled">
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
            className="mt-4 h-14 w-full flex-row items-center justify-center gap-2 rounded-lg bg-primary shadow-lg active:opacity-90">
            <Text className="text-lg font-bold text-white">
              {registerMutation.isPending ? 'Registering...' : 'Register Account'}
            </Text>
            {!registerMutation.isPending && (
              <Icon as={ArrowRight} className="text-white" size={20} />
            )}
          </Pressable>

          {/* Login Link */}
          <View className="mb-8 mt-4 items-center">
            <Text className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Text onPress={() => router.push('/(auth)/login')} className="font-bold text-primary">
                Login
              </Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
