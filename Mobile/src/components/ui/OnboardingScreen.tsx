import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Pressable, ScrollView, Dimensions, Animated, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  BedDouble,
  Bell,
  Activity,
  ArrowRight,
  Skip,
  ChevronRight,
  Stethoscope,
  MapPin,
  Clock,
} from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';
import { useThemeStore } from '@/src/store/themeStore';
import { cn } from '@/lib/utils';

const { width: screenWidth } = Dimensions.get('window');

interface OnboardingSlide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  icon: typeof BedDouble;
  iconColor: string;
  iconBg: string;
}

const onboardingSlides: OnboardingSlide[] = [
  {
    id: 1,
    title: 'Welcome to BNS',
    subtitle: 'Hospital Bed Notification System',
    description:
      'Your comprehensive solution for real-time bed management, patient assignments, and seamless hospital workflow coordination.',
    icon: BedDouble,
    iconColor: 'text-blue-600',
    iconBg: 'bg-blue-50',
  },
  {
    id: 2,
    title: 'Real-time Tracking',
    subtitle: 'Live Bed & Patient Management',
    description:
      'Monitor bed availability across all departments, track patient assignments, and receive instant updates on capacity changes.',
    icon: Activity,
    iconColor: 'text-emerald-600',
    iconBg: 'bg-emerald-50',
  },
  {
    id: 3,
    title: 'Smart Notifications',
    subtitle: 'Never Miss Critical Updates',
    description:
      'Get instant notifications for bed assignments, emergency alerts, and department updates directly to your device.',
    icon: Bell,
    iconColor: 'text-orange-600',
    iconBg: 'bg-orange-50',
  },
];

interface OnboardingScreenProps {
  onComplete: () => void;
}

export function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const { colorScheme } = useThemeStore();
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  const isDark = colorScheme === 'dark';

  useEffect(() => {
    // Fade in animation on mount
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    // Slide animation when current slide changes
    Animated.spring(slideAnim, {
      toValue: currentSlide * screenWidth,
      useNativeDriver: true,
    }).start();
  }, [currentSlide]);

  const handleNext = () => {
    if (currentSlide < onboardingSlides.length - 1) {
      const nextSlide = currentSlide + 1;
      setCurrentSlide(nextSlide);
      scrollViewRef.current?.scrollTo({
        x: nextSlide * screenWidth,
        animated: true,
      });
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentSlide > 0) {
      const prevSlide = currentSlide - 1;
      setCurrentSlide(prevSlide);
      scrollViewRef.current?.scrollTo({
        x: prevSlide * screenWidth,
        animated: true,
      });
    }
  };

  const handleSkip = async () => {
    await AsyncStorage.setItem('hasSeenBnsTour', 'true');
    onComplete();
  };

  const handleComplete = async () => {
    await AsyncStorage.setItem('hasSeenBnsTour', 'true');
    onComplete();
  };

  const handleScroll = (event: any) => {
    const contentOffset = event.nativeEvent.contentOffset;
    const slideIndex = Math.round(contentOffset.x / screenWidth);

    if (slideIndex !== currentSlide && slideIndex >= 0 && slideIndex < onboardingSlides.length) {
      setCurrentSlide(slideIndex);
    }
  };

  const renderSlide = (slide: OnboardingSlide, index: number) => (
    <View
      key={slide.id}
      className="flex-1 items-center justify-center px-8"
      style={{ width: screenWidth }}>
      {/* Icon */}
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [
            {
              translateY: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [50, 0],
              }),
            },
          ],
        }}
        className={cn(
          'mb-8 items-center justify-center rounded-3xl p-8 shadow-lg',
          isDark ? slide.iconBg.replace('50', '500/20') : slide.iconBg,
          'border-2',
          isDark ? 'border-slate-700' : 'border-slate-100'
        )}>
        <Icon
          as={slide.icon}
          className={cn(
            slide.iconColor,
            isDark && slide.iconColor.includes('blue') && 'text-blue-400',
            isDark && slide.iconColor.includes('emerald') && 'text-emerald-400',
            isDark && slide.iconColor.includes('orange') && 'text-orange-400'
          )}
          size={64}
        />
      </Animated.View>

      {/* Content */}
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [
            {
              translateY: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [30, 0],
              }),
            },
          ],
        }}
        className="items-center">
        <Text
          className={cn(
            'mb-2 text-center text-3xl font-bold tracking-tight',
            isDark ? 'text-white' : 'text-slate-900'
          )}>
          {slide.title}
        </Text>

        <Text
          className={cn(
            'mb-6 text-center text-sm font-bold uppercase tracking-widest',
            isDark ? 'text-slate-400' : 'text-slate-500'
          )}>
          {slide.subtitle}
        </Text>

        <Text
          className={cn(
            'text-center text-lg leading-relaxed',
            isDark ? 'text-slate-300' : 'text-slate-600'
          )}>
          {slide.description}
        </Text>
      </Animated.View>

      {/* Features for specific slides */}
      {index === 1 && (
        <Animated.View style={{ opacity: fadeAnim }} className="mt-8 w-full space-y-3">
          {[
            { icon: MapPin, text: 'Department-wise bed tracking' },
            { icon: Clock, text: 'Real-time availability updates' },
            { icon: Stethoscope, text: 'Patient assignment management' },
          ].map((feature, idx) => (
            <View key={idx} className="flex-row items-center gap-3">
              <Icon
                as={feature.icon}
                className={isDark ? 'text-emerald-400' : 'text-emerald-600'}
                size={20}
              />
              <Text
                className={cn('text-sm font-medium', isDark ? 'text-slate-300' : 'text-slate-600')}>
                {feature.text}
              </Text>
            </View>
          ))}
        </Animated.View>
      )}
    </View>
  );

  return (
    <SafeAreaView className={cn('flex-1', isDark ? 'bg-slate-900' : 'bg-white')}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={isDark ? '#0f172a' : '#ffffff'}
      />

      {/* Header */}
      <View className="flex-row items-center justify-between px-6 py-4">
        <Text
          className={cn(
            'text-xs font-bold uppercase tracking-widest',
            isDark ? 'text-slate-500' : 'text-slate-400'
          )}>
          Getting Started
        </Text>

        <Pressable
          onPress={handleSkip}
          className={cn('rounded-full px-4 py-2', isDark ? 'bg-slate-800' : 'bg-slate-100')}>
          <Text className={cn('text-sm font-bold', isDark ? 'text-slate-300' : 'text-slate-600')}>
            Skip Tour
          </Text>
        </Pressable>
      </View>

      {/* Slides */}
      <View className="flex-1">
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          contentContainerStyle={{
            alignItems: 'center',
          }}>
          {onboardingSlides.map((slide, index) => renderSlide(slide, index))}
        </ScrollView>
      </View>

      {/* Pagination Indicators */}
      <View className="flex-row items-center justify-center space-x-2 py-6">
        {onboardingSlides.map((_, index) => (
          <Pressable
            key={index}
            onPress={() => {
              setCurrentSlide(index);
              scrollViewRef.current?.scrollTo({
                x: index * screenWidth,
                animated: true,
              });
            }}
            className={cn(
              'h-2 rounded-full transition-all',
              index === currentSlide
                ? isDark
                  ? 'w-8 bg-indigo-500'
                  : 'w-8 bg-indigo-600'
                : isDark
                  ? 'w-2 bg-slate-600'
                  : 'w-2 bg-slate-300'
            )}
          />
        ))}
      </View>

      {/* Navigation Buttons */}
      <View className="flex-row items-center justify-between px-6 pb-6">
        {/* Previous Button */}
        <Pressable
          onPress={handlePrevious}
          disabled={currentSlide === 0}
          className={cn(
            'flex-row items-center gap-2 rounded-xl px-6 py-3',
            currentSlide === 0
              ? isDark
                ? 'bg-slate-800/50'
                : 'bg-slate-100'
              : isDark
                ? 'bg-slate-800'
                : 'bg-slate-100'
          )}>
          <Text
            className={cn(
              'font-bold',
              currentSlide === 0
                ? isDark
                  ? 'text-slate-600'
                  : 'text-slate-400'
                : isDark
                  ? 'text-white'
                  : 'text-slate-700'
            )}>
            Previous
          </Text>
        </Pressable>

        {/* Slide Counter */}
        <Text className={cn('text-sm font-bold', isDark ? 'text-slate-400' : 'text-slate-500')}>
          {currentSlide + 1} of {onboardingSlides.length}
        </Text>

        {/* Next/Complete Button */}
        <Pressable
          onPress={handleNext}
          className={cn(
            'flex-row items-center gap-2 rounded-xl px-6 py-3',
            isDark ? 'bg-indigo-600' : 'bg-indigo-600'
          )}>
          <Text className="font-bold text-white">
            {currentSlide === onboardingSlides.length - 1 ? 'Get Started' : 'Next'}
          </Text>
          <Icon
            as={currentSlide === onboardingSlides.length - 1 ? ChevronRight : ArrowRight}
            className="text-white"
            size={20}
          />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
