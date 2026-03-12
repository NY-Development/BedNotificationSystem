import React, { useRef, useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useVerifyOtp, useResendOtp } from '@/src/hooks/useAuth';
import { useAuthStore } from '@/src/store/authStore';
import { Header } from '@/src/components/layout/Header';
import { ShieldCheck, ChevronRight, Headset } from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';

export default function VerifyOtpScreen() {
  const router = useRouter();
  const { userEmail } = useAuthStore();
  const verifyMutation = useVerifyOtp();
  const resendMutation = useResendOtp();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(59);
  const inputs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    const code = otp.join('');
    if (code.length === 6 && userEmail) {
      verifyMutation.mutate(
        { email: userEmail, otp: code },
        { onSuccess: () => router.replace('/(auth)/login') }
      );
    }
  };

  const handleResend = () => {
    if (timer === 0 && userEmail) {
      resendMutation.mutate(userEmail);
      setTimer(59);
    }
  };

  const maskedEmail = userEmail ? userEmail.replace(/(.{2})(.*)(@.*)/, '$1***$3') : 'your email';

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1">
        <Header title="Verification" showBack />

        <View className="flex-1 px-6 pb-10 pt-8">
          {/* Icon */}
          <View className="mb-8 items-center">
            <View className="rounded-full bg-primary/10 p-4">
              <Icon as={ShieldCheck} className="text-primary" size={48} />
            </View>
          </View>

          {/* Headers */}
          <View className="mb-10 items-center gap-3">
            <Text className="text-center text-3xl font-bold text-foreground">Enter Code</Text>
            <Text className="text-center text-base leading-relaxed text-muted-foreground">
              We've sent a 6-digit verification code to your hospital email{'\n'}
              <Text className="font-medium text-foreground">{maskedEmail}</Text>
            </Text>
          </View>

          {/* OTP Inputs */}
          <View className="mb-10 flex-row justify-between gap-2">
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => {
                  inputs.current[index] = ref;
                }}
                className="h-16 flex-1 rounded-xl border-2 border-border bg-card text-center text-2xl font-bold text-foreground"
                maxLength={1}
                keyboardType="number-pad"
                value={digit}
                onChangeText={(text) => handleChange(text, index)}
                onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
                placeholder="•"
                placeholderTextColor="#94A3B8"
              />
            ))}
          </View>

          {/* Timer & Resend */}
          <View className="mb-12 items-center gap-6">
            <View className="w-full flex-row items-center gap-4">
              <View className="h-px flex-1 bg-border" />
              <Text className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
                Expires In
              </Text>
              <View className="h-px flex-1 bg-border" />
            </View>

            <View className="flex-row gap-4">
              <View className="items-center">
                <View className="h-12 w-16 items-center justify-center rounded-lg border border-border bg-accent">
                  <Text className="text-xl font-bold text-primary">00</Text>
                </View>
                <Text className="mt-2 text-[10px] font-bold uppercase text-muted-foreground">
                  Min
                </Text>
              </View>
              <View className="items-center">
                <View className="h-12 w-16 items-center justify-center rounded-lg border border-border bg-accent">
                  <Text className="text-xl font-bold text-primary">
                    {timer.toString().padStart(2, '0')}
                  </Text>
                </View>
                <Text className="mt-2 text-[10px] font-bold uppercase text-muted-foreground">
                  Sec
                </Text>
              </View>
            </View>

            <Text className="text-sm text-muted-foreground">
              Didn't receive the code?{' '}
              <Text
                onPress={handleResend}
                className={timer === 0 ? 'font-semibold text-primary' : 'text-muted-foreground'}>
                Resend Code
              </Text>
            </Text>
          </View>

          {/* Verify Button */}
          <Pressable
            onPress={handleVerify}
            disabled={!!verifyMutation.isPending}
            className="h-14 w-full flex-row items-center justify-center gap-2 rounded-xl bg-primary shadow-lg active:opacity-90">
            <Text className="font-bold text-white">
              {verifyMutation.isPending ? 'Verifying...' : 'Verify & Proceed'}
            </Text>
            <Icon as={ChevronRight} className="text-white" size={20} />
          </Pressable>

          {/* Footer Help */}
          <View className="mt-auto items-center pt-10">
            <Pressable className="flex-row items-center gap-2">
              <Icon as={Headset} className="text-muted-foreground" size={18} />
              <Text className="text-sm font-medium text-muted-foreground">
                Contact Hospital IT Support
              </Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
