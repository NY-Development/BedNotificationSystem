import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginFormData } from '@/src/features/auth/schemas/authSchemas';
import { useLogin } from '@/src/hooks/useAuth';
import { Input } from '@/src/components/ui/Input';
import { Hospital, Mail, Lock, LogIn, Eye, EyeOff, ScanFace, Building2 } from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';
import { ThemeToggle } from '@/src/components/ui/ThemeToggle';
import { FloatingHelpButton, QuickHelpModal } from '@/src/components/ui/QuickHelpModal';
import { useUniversityStore } from '@/src/store/universityStore';

export default function LoginScreen() {
  const router = useRouter();
  const loginMutation = useLogin();
  const { selectedUniversity, loadSelectedUniversity } = useUniversityStore();
  const [showPassword, setShowPassword] = useState(false);
  const [isHelpVisible, setIsHelpVisible] = useState(false);

  // Load selected university on mount
  React.useEffect(() => {
    loadSelectedUniversity();
  }, []);

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
      onSuccess: (res) => {
        res?.role.toLowerCase() === 'admin'
          ? router.replace('/(admin)/dashboard')
          : router.replace('/(staff)/dashboard');
      },
      onError: () => {},
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1">
        {/* Header Section */}
        <View className="rounded-b-[2.5rem] bg-[#135bec] px-6 pb-10 pt-14 shadow-xl">
          {/* Top Row: Branding and Controls */}
          <View className="mb-8 flex-row flex-wrap items-start justify-between">
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
            <Text className="text-4xl font-black tracking-tighter text-white">Login</Text>
            <Text className="mt-1 text-base font-medium text-white/70">
              Sign in to access your account
            </Text>
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
              <Text className="font-bold text-foreground">Welcome Back</Text>
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
            {/* Login Link */}
            <View className="items-center">
              <Text className="text-sm text-muted-foreground">
                New to our app?{' '}
                <Text
                  onPress={() => router.push('/(auth)/register')}
                  className="font-bold text-primary">
                  Signup Here
                </Text>
              </Text>
            </View>
            {/* Biometric Button */}
            <Pressable className="h-12 w-full flex-row items-center justify-center gap-2 rounded-xl border border-border bg-accent active:opacity-80">
              <Icon as={ScanFace} className="text-primary" size={22} />
              <Text className="font-medium text-foreground">Use Face ID</Text>
            </Pressable>
          </View>

          {/* Help Link */}
          <View className="m-8 items-center">
            <Pressable onPress={() => router.push('/(system)/contact')}>
              <Text className="text-sm text-muted-foreground">
                Having trouble? <Text className="font-medium text-primary">Contact IT Support</Text>
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Quick Help Support */}
      <FloatingHelpButton onPress={() => setIsHelpVisible(true)} />
      <QuickHelpModal isVisible={isHelpVisible} onClose={() => setIsHelpVisible(false)} />
    </SafeAreaView>
  );
}
