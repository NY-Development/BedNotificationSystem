import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  Info,
  ArrowLeft,
  BedDouble,
  Activity,
  Bell,
  Shield,
  Users,
  Target,
  Award,
  Heart,
  Code,
  ExternalLink,
  CheckCircle,
  Stethoscope,
  Building2,
  Zap,
} from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';
import { useThemeStore } from '@/src/store/themeStore';
import { cn } from '@/lib/utils';

export default function AboutScreen() {
  const router = useRouter();
  const { colorScheme } = useThemeStore();
  const isDark = colorScheme === 'dark';

  const features = [
    {
      icon: BedDouble,
      title: 'Real-time Bed Management',
      description:
        'Track bed availability across all departments with live updates and instant notifications.',
      color: isDark ? 'text-blue-400' : 'text-blue-600',
      bg: isDark ? 'bg-blue-500/10' : 'bg-blue-50',
    },
    {
      icon: Activity,
      title: 'Patient Assignment System',
      description: 'Streamlined patient-to-bed assignments with automated workflow management.',
      color: isDark ? 'text-emerald-400' : 'text-emerald-600',
      bg: isDark ? 'bg-emerald-500/10' : 'bg-emerald-50',
    },
    {
      icon: Bell,
      title: 'Smart Notifications',
      description:
        'Instant alerts for critical updates, bed status changes, and emergency situations.',
      color: isDark ? 'text-orange-400' : 'text-orange-600',
      bg: isDark ? 'bg-orange-500/10' : 'bg-orange-50',
    },
    {
      icon: Shield,
      title: 'HIPAA Compliant Security',
      description:
        'Medical-grade data encryption and security protocols for patient information protection.',
      color: isDark ? 'text-purple-400' : 'text-purple-600',
      bg: isDark ? 'bg-purple-500/10' : 'bg-purple-50',
    },
  ];

  const stats = [
    { label: 'Hospitals Served', value: '25+', icon: Building2 },
    { label: 'Beds Managed', value: '10k+', icon: BedDouble },
    { label: 'Active Users', value: '500+', icon: Users },
    { label: 'Uptime', value: '99.9%', icon: Zap },
  ];

  const teamValues = [
    {
      title: 'Innovation in Healthcare',
      description:
        'Leveraging cutting-edge technology to solve real-world hospital management challenges.',
      icon: Target,
    },
    {
      title: 'Patient-Centered Design',
      description:
        'Every feature is designed with patient care quality and safety as the primary focus.',
      icon: Heart,
    },
    {
      title: 'Ethiopian Healthcare Excellence',
      description:
        'Built specifically for Ethiopian hospitals with local expertise and cultural understanding.',
      icon: Award,
    },
  ];

  const handleExternalLink = async (url: string) => {
    try {
      await Linking.openURL(url);
    } catch (error) {
      console.error('Could not open link:', error);
    }
  };

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
            <Icon as={Info} className={isDark ? 'text-indigo-400' : 'text-indigo-600'} size={24} />
          </View>
          <View>
            <Text className={cn('text-xl font-bold', isDark ? 'text-white' : 'text-slate-900')}>
              About BNS
            </Text>
            <Text
              className={cn(
                'text-xs font-bold uppercase tracking-wider',
                isDark ? 'text-slate-500' : 'text-slate-400'
              )}>
              Version 1.0.4
            </Text>
          </View>
        </View>
        <View className="w-10" /> {/* Spacer for centering */}
      </View>

      <ScrollView className="flex-1 p-6">
        {/* Hero Section */}
        <View className="mb-8 items-center">
          <View
            className={cn(
              'mb-4 h-20 w-20 items-center justify-center rounded-3xl shadow-xl',
              isDark ? 'border border-slate-700 bg-slate-800' : 'border border-slate-200 bg-white'
            )}>
            <Icon
              as={BedDouble}
              className={isDark ? 'text-indigo-400' : 'text-indigo-600'}
              size={40}
            />
          </View>
          <Text
            className={cn(
              'mb-2 text-center text-3xl font-bold',
              isDark ? 'text-white' : 'text-slate-900'
            )}>
            Hospital Bed{'\n'}Notification System
          </Text>
          <Text
            className={cn(
              'max-w-sm text-center text-sm leading-relaxed',
              isDark ? 'text-slate-400' : 'text-slate-600'
            )}>
            Revolutionizing hospital bed management across Ethiopia with real-time tracking,
            intelligent notifications, and seamless workflow automation.
          </Text>
        </View>

        {/* Stats */}
        <View className="mb-8 grid grid-cols-2 gap-3">
          {stats.map((stat, index) => (
            <View
              key={index}
              className={cn(
                'items-center rounded-xl p-4',
                isDark ? 'bg-slate-800' : 'bg-slate-50'
              )}>
              <Icon
                as={stat.icon}
                className={isDark ? 'text-indigo-400' : 'text-indigo-600'}
                size={24}
              />
              <Text
                className={cn(
                  'mt-2 text-2xl font-black',
                  isDark ? 'text-white' : 'text-slate-900'
                )}>
                {stat.value}
              </Text>
              <Text
                className={cn(
                  'text-center text-xs font-bold',
                  isDark ? 'text-slate-400' : 'text-slate-500'
                )}>
                {stat.label}
              </Text>
            </View>
          ))}
        </View>

        {/* Features */}
        <View className="mb-8">
          <Text className={cn('mb-4 text-lg font-bold', isDark ? 'text-white' : 'text-slate-900')}>
            Key Features
          </Text>
          <View className="space-y-4">
            {features.map((feature, index) => (
              <View key={index} className={cn('rounded-xl p-4', feature.bg)}>
                <View className="flex-row items-start gap-3">
                  <Icon as={feature.icon} className={feature.color} size={24} />
                  <View className="flex-1">
                    <Text
                      className={cn('mb-1 font-bold', isDark ? 'text-white' : 'text-slate-900')}>
                      {feature.title}
                    </Text>
                    <Text
                      className={cn(
                        'text-sm leading-relaxed',
                        isDark ? 'text-slate-300' : 'text-slate-600'
                      )}>
                      {feature.description}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Mission & Values */}
        <View className="mb-8">
          <Text className={cn('mb-4 text-lg font-bold', isDark ? 'text-white' : 'text-slate-900')}>
            Our Mission
          </Text>
          <View className="space-y-4">
            {teamValues.map((value, index) => (
              <View key={index} className="flex-row items-start gap-3">
                <Icon
                  as={value.icon}
                  className={isDark ? 'text-emerald-400' : 'text-emerald-600'}
                  size={20}
                />
                <View className="flex-1">
                  <Text className={cn('mb-1 font-bold', isDark ? 'text-white' : 'text-slate-900')}>
                    {value.title}
                  </Text>
                  <Text
                    className={cn(
                      'text-sm leading-relaxed',
                      isDark ? 'text-slate-400' : 'text-slate-600'
                    )}>
                    {value.description}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Technology Stack */}
        <View
          className={cn(
            'mb-8 rounded-2xl p-6',
            isDark
              ? 'border border-slate-700 bg-slate-800/50'
              : 'border border-slate-200 bg-slate-50'
          )}>
          <Text className={cn('mb-4 text-lg font-bold', isDark ? 'text-white' : 'text-slate-900')}>
            Built With Modern Technology
          </Text>
          <View className="space-y-2">
            {[
              'React Native & Expo for cross-platform mobile development',
              'Node.js & Express.js for robust backend infrastructure',
              'MongoDB for scalable data management',
              'Real-time WebSocket connections for instant updates',
              'End-to-end encryption for data security',
            ].map((tech, index) => (
              <View key={index} className="flex-row items-start gap-2">
                <Icon
                  as={CheckCircle}
                  className={isDark ? 'text-emerald-400' : 'text-emerald-600'}
                  size={16}
                />
                <Text
                  className={cn('flex-1 text-sm', isDark ? 'text-slate-300' : 'text-slate-600')}>
                  {tech}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Company Info */}
        <View
          className={cn(
            'mb-8 items-center rounded-2xl p-6',
            isDark
              ? 'border border-indigo-500/20 bg-indigo-500/10'
              : 'border border-indigo-100 bg-indigo-50'
          )}>
          <View className="mb-4 flex-row items-center gap-2">
            <Icon as={Code} className={isDark ? 'text-indigo-400' : 'text-indigo-600'} size={20} />
            <Text
              className={cn('text-lg font-bold', isDark ? 'text-indigo-300' : 'text-indigo-700')}>
              NYDev Solutions
            </Text>
          </View>
          <Text
            className={cn(
              'mb-4 text-center text-sm leading-relaxed',
              isDark ? 'text-indigo-300/80' : 'text-indigo-700/80'
            )}>
            Ethiopian healthcare technology company specializing in hospital management systems,
            patient care optimization, and medical workflow automation.
          </Text>
          <Pressable
            onPress={() => handleExternalLink('https://nydev.et')}
            className={cn(
              'flex-row items-center gap-2 rounded-xl px-4 py-2',
              isDark ? 'bg-indigo-600' : 'bg-indigo-600'
            )}>
            <Text className="text-sm font-bold text-white">Visit Website</Text>
            <Icon as={ExternalLink} className="text-white" size={16} />
          </Pressable>
        </View>

        {/* Footer */}
        <View className="items-center pb-8">
          <Text
            className={cn(
              'mb-2 text-center text-xs',
              isDark ? 'text-slate-500' : 'text-slate-400'
            )}>
            © 2024 NYDev Solutions. All rights reserved.{'\n'}
            Licensed for Ethiopian Healthcare Institutions
          </Text>
          <View className="flex-row items-center gap-1">
            <Text className={cn('text-xs', isDark ? 'text-slate-500' : 'text-slate-400')}>
              Made with
            </Text>
            <Icon as={Heart} className="text-red-500" size={12} />
            <Text className={cn('text-xs', isDark ? 'text-slate-500' : 'text-slate-400')}>
              in Addis Ababa
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
