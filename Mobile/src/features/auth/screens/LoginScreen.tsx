import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginFormData } from '@/src/features/auth/schemas/authSchemas';
import { useLogin } from '@/src/hooks/useAuth';
import { Input } from '@/src/components/ui/Input';
import { Hospital, Mail, Lock, LogIn, Eye, EyeOff, ScanFace } from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';

export default function LoginScreen() {
  const router = useRouter();
  const loginMutation = useLogin();
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data, {
      onSuccess: () => router.replace('/dashboard'),
      onError: () => {},
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1">
        {/* Header Section */}
        <View className="overflow-hidden rounded-b-[2.5rem] bg-primary px-6 pb-12 pt-14">
          <View className="items-center gap-4">
            <View className="rounded-2xl bg-white/20 p-3">
              <Icon as={Hospital} className="text-white" size={36} />
            </View>
            <View className="items-center">
              <Text className="text-3xl font-bold tracking-tight text-white">BNS</Text>
              <Text className="mt-1 text-sm font-medium uppercase tracking-wide text-blue-100">
                Bed Navigation System
              </Text>
            </View>
          </View>
        </View>

        {/* Main Content */}
        <ScrollView
          className="-mt-8 flex-1 px-5 pb-8"
          contentContainerClassName="items-center"
          keyboardShouldPersistTaps="handled">
          {/* Login Card */}
          <View className="w-full gap-6 rounded-2xl border border-border bg-card p-6 shadow-xl">
            <View className="items-center pb-2">
              <Text className="text-xl font-bold text-foreground">Welcome Back</Text>
              <Text className="mt-1 text-sm text-muted-foreground">
                Please sign in to access staff tools.
              </Text>
            </View>

            {/* Form */}
            <View className="gap-4">
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Staff ID / Email"
                    icon={Mail}
                    placeholder="Enter your ID or Email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.email?.message}
                  />
                )}
              />

              <View className="gap-1.5">
                <Controller
                  control={control}
                  name="password"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <View className="gap-1.5">
                      <Text className="ml-1 text-sm font-medium text-foreground">Password</Text>
                      <View className="h-14 w-full justify-center rounded-xl border border-border bg-card pr-12">
                        <Input
                          className="h-14 border-0 pl-11 pr-12"
                          icon={Lock}
                          placeholder="Enter your password"
                          secureTextEntry={!showPassword}
                          value={value}
                          onChangeText={onChange}
                          onBlur={onBlur}
                          error={errors.password?.message}
                        />
                      </View>
                      <Pressable
                        onPress={() => setShowPassword(!showPassword)}
                        className="absolute bottom-0 right-3 top-0 justify-center">
                        <Icon
                          as={showPassword ? Eye : EyeOff}
                          className="text-muted-foreground"
                          size={20}
                        />
                      </Pressable>
                    </View>
                  )}
                />
              </View>

              <View className="items-end">
                <Pressable onPress={() => router.push('/(auth)/forgot-password')}>
                  <Text className="text-sm font-medium text-primary">Forgot Password?</Text>
                </Pressable>
              </View>

              <Pressable
                onPress={handleSubmit(onSubmit)}
                disabled={!!loginMutation.isPending}
                className="mt-2 h-14 w-full flex-row items-center justify-center gap-2 rounded-xl bg-primary shadow-md active:opacity-90">
                <Text className="text-base font-semibold text-white">
                  {loginMutation.isPending ? 'Signing In...' : 'Sign In'}
                </Text>
                {!loginMutation.isPending && <Icon as={LogIn} className="text-white" size={20} />}
              </Pressable>
            </View>

            {/* Divider */}
            <View className="flex-row items-center py-2">
              <View className="flex-1 border-t border-border" />
              <Text className="mx-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Or
              </Text>
              <View className="flex-1 border-t border-border" />
            </View>

            {/* Biometric Button */}
            <Pressable className="h-12 w-full flex-row items-center justify-center gap-2 rounded-xl border border-border bg-accent active:opacity-80">
              <Icon as={ScanFace} className="text-primary" size={22} />
              <Text className="font-medium text-foreground">Use Face ID</Text>
            </Pressable>
          </View>

          {/* Help Link */}
          <View className="mt-8 items-center">
            <Text className="text-sm text-muted-foreground">
              Having trouble? <Text className="font-medium text-primary">Contact IT Support</Text>
            </Text>
          </View>
        </ScrollView>

        {/* Footer */}
        <View className="items-center py-6">
          <Text className="text-xs text-muted-foreground">v1.0.4 | Secure 256-bit Encryption</Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
