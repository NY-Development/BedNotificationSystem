import React, { useState } from 'react';
import { View, Text, Pressable, Modal, TextInput, ScrollView, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Headset,
  X,
  Send,
  RefreshCw,
  MessageCircle,
  ExternalLink,
  RotateCcw,
} from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';
import { cn } from '@/lib/utils';
import { useThemeStore } from '@/src/store/themeStore';
import { useToast } from '@/src/components/ui/Toast';

interface QuickHelpModalProps {
  isVisible: boolean;
  onClose: () => void;
}

interface SupportFormData {
  email: string;
  issue: string;
}

export function QuickHelpModal({ isVisible, onClose }: QuickHelpModalProps) {
  const { colorScheme } = useThemeStore();
  const { success, error } = useToast();
  const [formData, setFormData] = useState<SupportFormData>({
    email: '',
    issue: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRewatch = async () => {
    try {
      await AsyncStorage.removeItem('hasSeenBnsTour');
      success(
        'Tour Reset',
        'Product tour has been reset. You will see the onboarding tour on next app start.'
      );
      onClose();
    } catch (error) {
      console.error('Error clearing tour flag:', error);
      error('Error', 'Failed to reset tour. Please try again.');
    }
  };

  const handleTelegramSupport = async () => {
    try {
      await Linking.openURL('https://t.me/NYDev_Chat');
    } catch (error) {
      error('Error', 'Could not open Telegram link');
    }
  };

  const handleSubmitSupport = async () => {
    if (!formData.email.trim() || !formData.issue.trim()) {
      error('Missing Information', 'Please fill in both email and issue description');
      return;
    }

    setIsSubmitting(true);

    // Simulate support form submission
    try {
      // In a real app, this would send the form data to your API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      success(
        'Support Request Sent',
        'Your support request has been submitted. We will get back to you within 24 hours.'
      );

      setFormData({ email: '', issue: '' });
      onClose();
    } catch (err) {
      error('Error', 'Failed to send support request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isDark = colorScheme === 'dark';

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}>
      <SafeAreaView className={cn('flex-1', isDark ? 'bg-slate-900' : 'bg-white')}>
        {/* Header */}
        <View
          className={cn(
            'flex-row items-center justify-between border-b p-6',
            isDark ? 'border-slate-700' : 'border-slate-200'
          )}>
          <View className="flex-row items-center gap-3">
            <View
              className={cn('rounded-xl p-2', isDark ? 'bg-indigo-500/20' : 'bg-indigo-500/10')}>
              <Icon
                as={Headset}
                className={isDark ? 'text-indigo-400' : 'text-indigo-600'}
                size={24}
              />
            </View>
            <View>
              <Text className={cn('text-xl font-bold', isDark ? 'text-white' : 'text-slate-900')}>
                Quick Help
              </Text>
              <Text
                className={cn(
                  'text-xs font-bold uppercase tracking-wider',
                  isDark ? 'text-slate-500' : 'text-slate-400'
                )}>
                BNS Support Center
              </Text>
            </View>
          </View>

          <Pressable
            onPress={onClose}
            className={cn(
              'rounded-full p-2',
              isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-slate-100 hover:bg-slate-200'
            )}>
            <Icon as={X} className={isDark ? 'text-slate-400' : 'text-slate-600'} size={20} />
          </Pressable>
        </View>

        <ScrollView className="flex-1 p-6">
          {/* Welcome Message */}
          <View
            className={cn(
              'mb-6 rounded-2xl p-4',
              isDark
                ? 'border border-indigo-500/20 bg-indigo-500/10'
                : 'border border-indigo-100 bg-indigo-50'
            )}>
            <Text
              className={cn(
                'text-sm font-bold italic leading-relaxed',
                isDark ? 'text-indigo-300' : 'text-indigo-700'
              )}>
              Welcome to the BNS Help Center. Get instant support for technical issues, rewatch the
              product tour, or contact our team directly.
            </Text>
          </View>

          {/* Quick Actions */}
          <View className="mb-6">
            <Text
              className={cn('mb-4 text-lg font-bold', isDark ? 'text-white' : 'text-slate-900')}>
              Quick Actions
            </Text>

            <View className="space-y-3">
              {/* Rewatch Tour Button */}
              <Pressable
                onPress={handleRewatch}
                className={cn(
                  'flex-row items-center justify-between rounded-xl border-2 p-4',
                  isDark ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-slate-50'
                )}>
                <View className="flex-row items-center gap-3">
                  <Icon
                    as={RotateCcw}
                    className={isDark ? 'text-emerald-400' : 'text-emerald-600'}
                    size={20}
                  />
                  <Text className={cn('font-bold', isDark ? 'text-white' : 'text-slate-900')}>
                    Rewatch Product Tour
                  </Text>
                </View>
                <Icon
                  as={RefreshCw}
                  className={isDark ? 'text-slate-400' : 'text-slate-500'}
                  size={16}
                />
              </Pressable>

              {/* Telegram Support Button */}
              <Pressable
                onPress={handleTelegramSupport}
                className={cn(
                  'flex-row items-center justify-between rounded-xl border-2 p-4',
                  isDark ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-slate-50'
                )}>
                <View className="flex-row items-center gap-3">
                  <Icon
                    as={MessageCircle}
                    className={isDark ? 'text-blue-400' : 'text-blue-600'}
                    size={20}
                  />
                  <Text className={cn('font-bold', isDark ? 'text-white' : 'text-slate-900')}>
                    Quick Support (Telegram)
                  </Text>
                </View>
                <Icon
                  as={ExternalLink}
                  className={isDark ? 'text-slate-400' : 'text-slate-500'}
                  size={16}
                />
              </Pressable>
            </View>
          </View>

          {/* Support Form */}
          <View>
            <Text
              className={cn('mb-4 text-lg font-bold', isDark ? 'text-white' : 'text-slate-900')}>
              Report an Issue
            </Text>

            <View className="space-y-4">
              {/* Email Input */}
              <View>
                <Text
                  className={cn(
                    'mb-2 text-xs font-bold uppercase tracking-wider',
                    isDark ? 'text-slate-400' : 'text-slate-500'
                  )}>
                  Your Email
                </Text>
                <TextInput
                  value={formData.email}
                  onChangeText={(text) => setFormData((prev) => ({ ...prev, email: text }))}
                  placeholder="your.email@example.com"
                  placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  className={cn(
                    'rounded-xl border-2 p-4 font-semibold',
                    isDark
                      ? 'border-slate-700 bg-slate-800 text-white'
                      : 'border-slate-200 bg-slate-50 text-slate-900'
                  )}
                />
              </View>

              {/* Issue Description */}
              <View>
                <Text
                  className={cn(
                    'mb-2 text-xs font-bold uppercase tracking-wider',
                    isDark ? 'text-slate-400' : 'text-slate-500'
                  )}>
                  Issue Description
                </Text>
                <TextInput
                  value={formData.issue}
                  onChangeText={(text) => setFormData((prev) => ({ ...prev, issue: text }))}
                  placeholder="Describe your issue in detail..."
                  placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  className={cn(
                    'min-h-[100px] rounded-xl border-2 p-4 font-semibold',
                    isDark
                      ? 'border-slate-700 bg-slate-800 text-white'
                      : 'border-slate-200 bg-slate-50 text-slate-900'
                  )}
                />
              </View>

              {/* Submit Button */}
              <Pressable
                onPress={handleSubmitSupport}
                disabled={isSubmitting}
                className={cn(
                  'mt-4 flex-row items-center justify-center rounded-xl p-4',
                  isSubmitting
                    ? isDark
                      ? 'bg-slate-700'
                      : 'bg-slate-300'
                    : isDark
                      ? 'bg-indigo-600'
                      : 'bg-indigo-600'
                )}>
                {isSubmitting ? (
                  <Icon as={RefreshCw} className="animate-spin text-white" size={20} />
                ) : (
                  <>
                    <Icon as={Send} className="mr-2 text-white" size={20} />
                    <Text className="font-bold uppercase tracking-wider text-white">
                      Send Support Request
                    </Text>
                  </>
                )}
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

// Floating Help Button Component
interface FloatingHelpButtonProps {
  onPress: () => void;
  className?: string;
}

export function FloatingHelpButton({ onPress, className }: FloatingHelpButtonProps) {
  const { colorScheme } = useThemeStore();
  const isDark = colorScheme === 'dark';

  return (
    <Pressable
      onPress={onPress}
      className={cn(
        'absolute bottom-16 right-6 z-50 h-14 w-14 items-center justify-center rounded-full shadow-lg',
        isDark ? 'bg-indigo-600' : 'bg-indigo-600',
        className
      )}
      style={{
        shadowColor: isDark ? '#4f46e5' : '#4f46e5',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
      }}>
      <Icon as={Headset} className="text-white" size={24} />
    </Pressable>
  );
}
