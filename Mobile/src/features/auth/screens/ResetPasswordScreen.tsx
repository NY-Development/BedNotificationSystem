import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  resetPasswordSchema,
  type ResetPasswordFormData,
} from '@/src/features/auth/schemas/authSchemas';
import { useResetPassword } from '@/src/hooks/useAuth';
import { useAuthStore } from '@/src/store/authStore';
import { Header } from '@/src/components/layout/Header';
import { Input } from '@/src/components/ui/Input';
import { LockKeyhole, Eye, EyeOff, ChevronRight, Check } from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';

function getPasswordStrength(password: string) {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score; // 0-4
}

const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
const strengthColors = ['bg-border', 'bg-destructive', 'bg-warning', 'bg-primary', 'bg-success'];

export default function ResetPasswordScreen() {
  const router = useRouter();
  const { userEmail } = useAuthStore();
  const resetMutation = useResetPassword();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { otp: '', password: '', confirmPassword: '' },
  });

  const password = watch('password');
  const strength = useMemo(() => getPasswordStrength(password || ''), [password]);

  const onSubmit = (data: ResetPasswordFormData) => {
    if (!userEmail) return;
    resetMutation.mutate(
      { email: userEmail, otp: data.otp, newPassword: data.password },
      { onSuccess: () => router.replace('/(auth)/login') }
    );
  };

  const requirements = [
    { label: 'At least 8 characters', met: (password || '').length >= 8 },
    { label: 'One uppercase letter', met: /[A-Z]/.test(password || '') },
    { label: 'One number', met: /[0-9]/.test(password || '') },
    { label: 'One special character', met: /[^A-Za-z0-9]/.test(password || '') },
  ];

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1">
        <Header title="New Password" showBack />

        <View className="flex-1 px-6 pb-10 pt-8">
          {/* Icon */}
          <View className="mb-8 items-center">
            <View className="rounded-full bg-primary/10 p-4">
              <Icon as={LockKeyhole} className="text-primary" size={48} />
            </View>
          </View>

          {/* Headers */}
          <View className="mb-8 items-center gap-3">
            <Text className="text-center text-3xl font-bold text-foreground">
              Create New Password
            </Text>
            <Text className="text-center text-base leading-relaxed text-muted-foreground">
              Your new password must be different from previous passwords
            </Text>
          </View>

          {/* OTP */}
          <View className="mb-4 gap-2">
            <Text className="text-sm font-semibold text-foreground">Verification Code</Text>
            <Controller
              control={control}
              name="otp"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  placeholder="Enter 6-digit code"
                  keyboardType="number-pad"
                  maxLength={6}
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  error={errors.otp?.message}
                />
              )}
            />
          </View>

          {/* New Password */}
          <View className="mb-4 gap-2">
            <Text className="text-sm font-semibold text-foreground">New Password</Text>
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <View className="relative">
                  <Input
                    placeholder="Password (min 8 characters)"
                    secureTextEntry={!showPassword}
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    error={errors.password?.message}
                  />
                  <Pressable
                    onPress={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3">
                    <Icon
                      as={showPassword ? EyeOff : Eye}
                      className="text-muted-foreground"
                      size={20}
                    />
                  </Pressable>
                </View>
              )}
            />
          </View>

          {/* Strength Indicator */}
          {password && password.length > 0 && (
            <View className="mb-4 gap-2">
              <View className="flex-row gap-1.5">
                {[0, 1, 2, 3].map((i) => (
                  <View
                    key={i}
                    className={`h-1 flex-1 rounded-full ${i < strength ? strengthColors[strength] : 'bg-border'}`}
                  />
                ))}
              </View>
              <Text className="text-xs text-muted-foreground">
                Password Strength: <Text className="font-semibold">{strengthLabels[strength]}</Text>
              </Text>
            </View>
          )}

          {/* Password Requirements */}
          <View className="mb-4 gap-1.5">
            {requirements.map((req) => (
              <View key={req.label} className="flex-row items-center gap-2">
                <Icon
                  as={Check}
                  className={req.met ? 'text-success' : 'text-muted-foreground'}
                  size={14}
                />
                <Text className={`text-xs ${req.met ? 'text-success' : 'text-muted-foreground'}`}>
                  {req.label}
                </Text>
              </View>
            ))}
          </View>

          {/* Confirm Password */}
          <View className="mb-8 gap-2">
            <Text className="text-sm font-semibold text-foreground">Confirm Password</Text>
            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { onChange, onBlur, value } }) => (
                <View className="relative">
                  <Input
                    placeholder="Confirm your password"
                    secureTextEntry={!showConfirm}
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    error={errors.confirmPassword?.message}
                  />
                  <Pressable
                    onPress={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-3">
                    <Icon
                      as={showConfirm ? EyeOff : Eye}
                      className="text-muted-foreground"
                      size={20}
                    />
                  </Pressable>
                </View>
              )}
            />
          </View>

          {/* Submit */}
          <Pressable
            onPress={handleSubmit(onSubmit)}
            disabled={!!resetMutation.isPending}
            className="h-14 w-full flex-row items-center justify-center gap-2 rounded-xl bg-primary shadow-lg active:opacity-90">
            <Text className="text-base font-bold text-white">
              {resetMutation.isPending ? 'Resetting...' : 'Reset Password'}
            </Text>
            <Icon as={ChevronRight} className="text-white" size={20} />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
