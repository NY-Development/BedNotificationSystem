import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, Linking, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  Headset,
  ArrowLeft,
  MessageCircle,
  ExternalLink,
  Send,
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin,
  Twitter,
  Globe,
  Heart,
  Code,
} from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';
import { useThemeStore } from '@/src/store/themeStore';
import { cn } from '@/lib/utils';

export default function ContactScreen() {
  const router = useRouter();
  const { colorScheme } = useThemeStore();
  const isDark = colorScheme === 'dark';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const socialLinks = [
    {
      id: 'telegram',
      name: 'Telegram',
      icon: MessageCircle,
      url: 'https://t.me/NYDev_Chat',
      color: isDark ? 'text-blue-400' : 'text-blue-600',
      bg: isDark ? 'bg-blue-500/10' : 'bg-blue-50',
    },
    {
      id: 'github',
      name: 'GitHub',
      icon: Github,
      url: 'https://github.com/nydev',
      color: isDark ? 'text-slate-300' : 'text-slate-700',
      bg: isDark ? 'bg-slate-700/50' : 'bg-slate-100',
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      icon: Linkedin,
      url: 'https://linkedin.com/company/nydev',
      color: isDark ? 'text-blue-400' : 'text-blue-700',
      bg: isDark ? 'bg-blue-500/10' : 'bg-blue-50',
    },
    {
      id: 'twitter',
      name: 'Twitter',
      icon: Twitter,
      url: 'https://twitter.com/nydev_official',
      color: isDark ? 'text-sky-400' : 'text-sky-600',
      bg: isDark ? 'bg-sky-500/10' : 'bg-sky-50',
    },
  ];

  const contactMethods = [
    {
      icon: Mail,
      label: 'Email Support',
      value: 'nydevofficial@gmail.com',
      action: () => Linking.openURL('mailto:nydevofficial@gmail.com'),
    },
    {
      icon: Phone,
      label: 'Emergency Line',
      value: '+251 911 123 456',
      action: () => Linking.openURL('tel:+251911123456'),
    },
    {
      icon: MapPin,
      label: 'Head Office',
      value: 'Addis Ababa, Ethiopia',
      action: () => {},
    },
  ];

  const handleSocialLink = async (url: string) => {
    try {
      await Linking.openURL(url);
    } catch (error) {
      Alert.alert('Error', 'Could not open link');
    }
  };

  const handleSubmitMessage = async () => {
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate message submission
      await new Promise((resolve) => setTimeout(resolve, 1000));

      Alert.alert(
        'Message Sent',
        'Thank you for contacting us. We will get back to you within 24 hours.',
        [{ text: 'OK', onPress: () => setFormData({ name: '', email: '', message: '' }) }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
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
          <View
            className={cn('rounded-xl p-2', isDark ? 'bg-emerald-500/20' : 'bg-emerald-500/10')}>
            <Icon
              as={Headset}
              className={isDark ? 'text-emerald-400' : 'text-emerald-600'}
              size={24}
            />
          </View>
          <View>
            <Text className={cn('text-xl font-bold', isDark ? 'text-white' : 'text-slate-900')}>
              Contact Us
            </Text>
            <Text
              className={cn(
                'text-xs font-bold uppercase tracking-wider',
                isDark ? 'text-slate-500' : 'text-slate-400'
              )}>
              Get in Touch
            </Text>
          </View>
        </View>
        <View className="w-10" />
      </View>

      <ScrollView className="flex-1 p-6">
        {/* Welcome Message */}
        <View
          className={cn(
            'mb-6 rounded-2xl p-4',
            isDark
              ? 'border border-emerald-500/20 bg-emerald-500/10'
              : 'border border-emerald-100 bg-emerald-50'
          )}>
          <Text
            className={cn(
              'text-sm font-bold italic leading-relaxed',
              isDark ? 'text-emerald-300' : 'text-emerald-700'
            )}>
            We're here to help! Reach out for technical support, feature requests, or general
            inquiries about the BNS platform.
          </Text>
        </View>

        {/* Contact Methods */}
        <View className="mb-6 space-y-3">
          <Text className={cn('mb-2 text-lg font-bold', isDark ? 'text-white' : 'text-slate-900')}>
            Contact Information
          </Text>
          {contactMethods.map((method, index) => (
            <Pressable
              key={index}
              onPress={method.action}
              className={cn(
                'flex-row items-center gap-3 rounded-xl p-4',
                isDark ? 'bg-slate-800' : 'bg-slate-50'
              )}>
              <Icon
                as={method.icon}
                className={isDark ? 'text-emerald-400' : 'text-emerald-600'}
                size={20}
              />
              <View className="flex-1">
                <Text className={cn('font-bold', isDark ? 'text-white' : 'text-slate-900')}>
                  {method.label}
                </Text>
                <Text className={cn('text-sm', isDark ? 'text-slate-400' : 'text-slate-600')}>
                  {method.value}
                </Text>
              </View>
            </Pressable>
          ))}
        </View>

        {/* Social Media Links */}
        <View className="mb-6">
          <Text className={cn('mb-4 text-lg font-bold', isDark ? 'text-white' : 'text-slate-900')}>
            Follow Us
          </Text>
          <View className="flex-row flex-wrap gap-3">
            {socialLinks.map((social) => (
              <Pressable
                key={social.id}
                onPress={() => handleSocialLink(social.url)}
                className={cn(
                  'min-w-[45%] flex-1 flex-row items-center gap-2 rounded-xl p-3',
                  social.bg
                )}>
                <Icon as={social.icon} className={social.color} size={18} />
                <Text className={cn('text-xs font-bold', social.color)}>{social.name}</Text>
                <Icon as={ExternalLink} className={social.color} size={12} />
              </Pressable>
            ))}
          </View>
        </View>

        {/* Contact Form */}
        <View className="mb-6">
          <Text className={cn('mb-4 text-lg font-bold', isDark ? 'text-white' : 'text-slate-900')}>
            Send Us a Message
          </Text>

          <View className="space-y-4">
            {/* Name Input */}
            <View>
              <Text
                className={cn(
                  'mb-2 text-xs font-bold uppercase tracking-wider',
                  isDark ? 'text-slate-400' : 'text-slate-500'
                )}>
                Your Name
              </Text>
              <TextInput
                value={formData.name}
                onChangeText={(text) => setFormData((prev) => ({ ...prev, name: text }))}
                placeholder="Enter your full name"
                placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
                className={cn(
                  'rounded-xl border-2 p-4 font-semibold',
                  isDark
                    ? 'border-slate-700 bg-slate-800 text-white'
                    : 'border-slate-200 bg-slate-50 text-slate-900'
                )}
              />
            </View>

            {/* Email Input */}
            <View>
              <Text
                className={cn(
                  'mb-2 text-xs font-bold uppercase tracking-wider',
                  isDark ? 'text-slate-400' : 'text-slate-500'
                )}>
                Email Address
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

            {/* Message Input */}
            <View>
              <Text
                className={cn(
                  'mb-2 text-xs font-bold uppercase tracking-wider',
                  isDark ? 'text-slate-400' : 'text-slate-500'
                )}>
                Message
              </Text>
              <TextInput
                value={formData.message}
                onChangeText={(text) => setFormData((prev) => ({ ...prev, message: text }))}
                placeholder="Tell us how we can help you..."
                placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                className={cn(
                  'min-h-[120px] rounded-xl border-2 p-4 font-semibold',
                  isDark
                    ? 'border-slate-700 bg-slate-800 text-white'
                    : 'border-slate-200 bg-slate-50 text-slate-900'
                )}
              />
            </View>

            {/* Submit Button */}
            <Pressable
              onPress={handleSubmitMessage}
              disabled={isSubmitting}
              className={cn(
                'mt-4 flex-row items-center justify-center rounded-xl p-4',
                isSubmitting
                  ? isDark
                    ? 'bg-slate-700'
                    : 'bg-slate-300'
                  : isDark
                    ? 'bg-emerald-600'
                    : 'bg-emerald-600'
              )}>
              <Icon as={Send} className="mr-2 text-white" size={20} />
              <Text className="font-bold uppercase tracking-wider text-white">
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Developer Info */}
        <View
          className={cn(
            'mb-4 items-center rounded-2xl p-4',
            isDark ? 'bg-slate-800/50' : 'bg-slate-50'
          )}>
          <View className="mb-2 flex-row items-center gap-2">
            <Icon as={Code} className={isDark ? 'text-slate-400' : 'text-slate-600'} size={16} />
            <Text className={cn('text-sm font-bold', isDark ? 'text-slate-300' : 'text-slate-700')}>
              Developed with
            </Text>
            <Icon as={Heart} className="text-red-500" size={16} />
            <Text className={cn('text-sm font-bold', isDark ? 'text-slate-300' : 'text-slate-700')}>
              by NYDev
            </Text>
          </View>
          <Text className={cn('text-center text-xs', isDark ? 'text-slate-500' : 'text-slate-400')}>
            BNS v1.0.4 - Hospital Bed Notification System{'\n'}
            Ethiopian Healthcare Technology Solutions
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
