import React from 'react';
import { View, Text, ScrollView, Pressable, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  ShieldCheck,
  ArrowLeft,
  MessageCircle,
  ExternalLink,
  FileText,
  Lock,
  Eye,
  Clock,
  Shield,
} from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';
import { useThemeStore } from '@/src/store/themeStore';
import { cn } from '@/lib/utils';

export default function PrivacyScreen() {
  const router = useRouter();
  const { colorScheme } = useThemeStore();
  const isDark = colorScheme === 'dark';

  const handleTelegramSupport = async () => {
    try {
      await Linking.openURL('https://t.me/NYDev_Chat');
    } catch (error) {
      console.error('Could not open Telegram link:', error);
    }
  };

  const policySection = [
    {
      id: '01',
      title: 'Information We Collect',
      icon: FileText,
      content:
        'We collect essential credentials (name, email, encrypted password) to manage your professional profile. Subscription data, including verification screenshots, are processed exclusively for account activation.',
    },
    {
      id: '02',
      title: 'Payment Screenshot Security',
      icon: Lock,
      content:
        'Uploaded verification images are used solely for manual payment confirmation. They are stored in private cloud buckets and are never accessible to unauthorized staff or public parties.',
    },
    {
      id: '03',
      title: 'Data Encryption & Safety',
      icon: Shield,
      content:
        'All transitions are secured via HTTPS. We employ restricted administrative access, ensuring only top-level system controllers can review sensitive verification documents.',
    },
    {
      id: '04',
      title: 'Account Responsibilities',
      icon: Eye,
      content:
        "Maintaining credential confidentiality is the user's duty. Unauthorized access resulting from credential sharing is not the platform's liability. Notify support immediately of any breaches.",
    },
    {
      id: '05',
      title: 'Data Retention Policy',
      icon: Clock,
      content:
        'Verification screenshots are purged after verification is complete or within 30 days of subscription expiry to protect your financial privacy.',
    },
  ];

  return (
    <SafeAreaView className={cn('flex-1', isDark ? 'bg-slate-900' : 'bg-white')}>
      {/* Header */}
      <View
        className={cn(
          'flex-row items-center justify-between border-b p-6',
          isDark ? 'border-slate-700' : 'border-slate-200'
        )}>
        <Pressable
          onPress={() => router.back()}
          className={cn('rounded-full p-2', isDark ? 'bg-slate-800' : 'bg-slate-100')}>
          <Icon as={ArrowLeft} className={isDark ? 'text-slate-300' : 'text-slate-600'} size={20} />
        </Pressable>
        <View className="flex-row items-center gap-3">
          <View className={cn('rounded-xl p-2', isDark ? 'bg-indigo-500/20' : 'bg-indigo-500/10')}>
            <Icon
              as={ShieldCheck}
              className={isDark ? 'text-indigo-400' : 'text-indigo-600'}
              size={24}
            />
          </View>
          <View>
            <Text className={cn('text-xl font-bold', isDark ? 'text-white' : 'text-slate-900')}>
              Legal & Privacy
            </Text>
            <Text
              className={cn(
                'text-xs font-bold uppercase tracking-wider',
                isDark ? 'text-slate-500' : 'text-slate-400'
              )}>
              Hospital Bed Notification System
            </Text>
          </View>
        </View>
        <View className="w-10" /> {/* Spacer for centering */}
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
            Welcome to the BNS. This policy ensures your data is handled with medical-grade
            transparency and security.
          </Text>
        </View>

        {/* Policy Sections */}
        <View className="space-y-6">
          {policySection.map((section) => (
            <View key={section.id}>
              <View className="mb-2 flex-row items-center gap-2">
                <Text
                  className={cn(
                    'text-xs font-bold',
                    isDark ? 'text-indigo-400' : 'text-indigo-500'
                  )}>
                  {section.id}
                </Text>
                <Icon
                  as={section.icon}
                  className={isDark ? 'text-slate-400' : 'text-slate-500'}
                  size={16}
                />
                <Text className={cn('font-bold', isDark ? 'text-white' : 'text-slate-900')}>
                  {section.title}
                </Text>
              </View>
              <Text
                className={cn(
                  'ml-2 text-sm leading-relaxed',
                  isDark ? 'text-slate-400' : 'text-slate-600'
                )}>
                {section.content}
              </Text>
            </View>
          ))}
        </View>

        {/* Contact Section */}
        <View
          className={cn(
            'mt-8 space-y-4 border-t pt-6',
            isDark ? 'border-slate-700' : 'border-slate-200'
          )}>
          <Text className={cn('mb-3 font-bold', isDark ? 'text-white' : 'text-slate-900')}>
            Questions or Data Removal Requests?
          </Text>

          <Pressable
            onPress={handleTelegramSupport}
            className={cn(
              'flex-row items-center justify-between rounded-xl p-4',
              isDark ? 'bg-slate-800' : 'bg-slate-50'
            )}>
            <View className="flex-row items-center gap-3">
              <Icon
                as={MessageCircle}
                className={isDark ? 'text-blue-400' : 'text-blue-600'}
                size={20}
              />
              <View>
                <Text className={cn('font-bold', isDark ? 'text-white' : 'text-slate-900')}>
                  Contact Support
                </Text>
                <Text className={cn('text-xs', isDark ? 'text-slate-400' : 'text-slate-500')}>
                  t.me/NYDev_Chat
                </Text>
              </View>
            </View>
            <Icon
              as={ExternalLink}
              className={isDark ? 'text-slate-400' : 'text-slate-500'}
              size={16}
            />
          </Pressable>
        </View>

        {/* Footer */}
        <View className="mt-8 items-center pb-8">
          <Text className={cn('text-center text-xs', isDark ? 'text-slate-500' : 'text-slate-400')}>
            Last updated: December 2024{'\n'}
            BNS v1.0.4 - Medical Grade Security
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
