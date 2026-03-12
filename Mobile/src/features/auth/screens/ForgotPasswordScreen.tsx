import React from 'react';
import { View, Text, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  forgotPasswordSchema,
  type ForgotPasswordFormData,
} from '@/src/features/auth/schemas/authSchemas';
import { useForgotPassword } from '@/src/hooks/useAuth';
import { useAuthStore } from '@/src/store/authStore';
import { Header } from '@/src/components/layout/Header';
import { Input } from '@/src/components/ui/Input';
import { LockKeyhole, Send, ChevronRight } from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { setUserEmail } = useAuthStore();
  const forgotMutation = useForgotPassword();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = (data: ForgotPasswordFormData) => {
    forgotMutation.mutate(data.email, {
      onSuccess: () => {
        setUserEmail(data.email);
        router.push('/(auth)/reset-password');
      },
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1">
        <Header title="Reset Password" showBack />

        <View className="flex-1 px-6 pb-10 pt-8">
          {/* Icon */}
          <View className="mb-8 items-center">
            <View className="rounded-full bg-primary/10 p-4">
              <Icon as={LockKeyhole} className="text-primary" size={48} />
            </View>
          </View>

          {/* Headers */}
          <View className="mb-10 items-center gap-3">
            <Text className="text-center text-3xl font-bold text-foreground">Forgot Password?</Text>
            <Text className="text-center text-base leading-relaxed text-muted-foreground">
              Enter your hospital email address and we'll send you a verification code to reset your
              password
            </Text>
          </View>

          {/* Email Input */}
          <View className="mb-8 gap-2">
            <Text className="text-sm font-semibold text-foreground">Hospital Email</Text>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  placeholder="john.doe@hospital.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  error={errors.email?.message}
                />
              )}
            />
          </View>

          {/* Security Note */}
          <View className="mb-10 flex-row items-start gap-3 rounded-xl bg-primary/5 p-4">
            <Icon as={LockKeyhole} className="mt-0.5 text-primary" size={18} />
            <Text className="flex-1 text-sm leading-relaxed text-muted-foreground">
              For security purposes, the reset code will only be sent to your registered hospital
              email address.
            </Text>
          </View>

          {/* Submit Button */}
          <Pressable
            onPress={handleSubmit(onSubmit)}
            disabled={!!forgotMutation.isPending}
            className="h-14 w-full flex-row items-center justify-center gap-2 rounded-xl bg-primary shadow-lg active:opacity-90">
            <Icon as={Send} className="text-white" size={20} />
            <Text className="text-base font-bold text-white">
              {forgotMutation.isPending ? 'Sending...' : 'Send Reset Code'}
            </Text>
          </Pressable>

          {/* Back to Login */}
          <Pressable
            onPress={() => router.back()}
            className="mt-6 flex-row items-center justify-center gap-2">
            <Text className="text-sm text-muted-foreground">Remember your password?</Text>
            <Text className="text-sm font-semibold text-primary">Sign In</Text>
            <Icon as={ChevronRight} className="text-primary" size={16} />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
