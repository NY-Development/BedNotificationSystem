import React, { createContext, useContext, useState, ReactNode } from 'react';
import { View, Text, Animated, Pressable, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CheckCircle, AlertTriangle, XCircle, Info, X } from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';
import { useThemeStore } from '@/src/store/themeStore';
import { cn } from '@/lib/utils';

const { width: screenWidth } = Dimensions.get('window');

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onPress: () => void;
  };
}

interface ToastContextType {
  showToast: (toast: Omit<Toast, 'id'>) => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
  dismissToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

interface ToastItemProps {
  toast: Toast & { animatedValue: Animated.Value };
  onDismiss: (id: string) => void;
}

function ToastItem({ toast, onDismiss }: ToastItemProps) {
  const { colorScheme } = useThemeStore();
  const isDark = colorScheme === 'dark';

  const iconConfig = {
    success: {
      icon: CheckCircle,
      color: isDark ? 'text-emerald-400' : 'text-emerald-600',
      bg: isDark ? 'bg-emerald-500/20 border-emerald-500/30' : 'bg-emerald-50 border-emerald-200',
    },
    error: {
      icon: XCircle,
      color: isDark ? 'text-red-400' : 'text-red-600',
      bg: isDark ? 'bg-red-500/20 border-red-500/30' : 'bg-red-50 border-red-200',
    },
    warning: {
      icon: AlertTriangle,
      color: isDark ? 'text-yellow-400' : 'text-yellow-600',
      bg: isDark ? 'bg-yellow-500/20 border-yellow-500/30' : 'bg-yellow-50 border-yellow-200',
    },
    info: {
      icon: Info,
      color: isDark ? 'text-blue-400' : 'text-blue-600',
      bg: isDark ? 'bg-blue-500/20 border-blue-500/30' : 'bg-blue-50 border-blue-200',
    },
  };

  const config = iconConfig[toast.type];

  const translateX = toast.animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [screenWidth, 0],
  });

  const opacity = toast.animatedValue.interpolate({
    inputRange: [0, 0.1, 0.9, 1],
    outputRange: [0, 1, 1, 0],
  });

  return (
    <Animated.View
      style={{
        transform: [{ translateX }],
        opacity,
      }}
      className="mb-3">
      <View
        className={cn(
          'mx-4 rounded-2xl border-2 shadow-lg',
          config.bg,
          isDark ? 'shadow-black/50' : 'shadow-slate-500/20'
        )}>
        <View className="flex-row items-start p-4">
          {/* Icon */}
          <View className="mr-3 mt-0.5">
            <Icon as={config.icon} className={config.color} size={20} />
          </View>

          {/* Content */}
          <View className="flex-1">
            <Text className={cn('text-sm font-bold', isDark ? 'text-white' : 'text-slate-900')}>
              {toast.title}
            </Text>
            {toast.message && (
              <Text
                className={cn(
                  'mt-1 text-sm leading-relaxed',
                  isDark ? 'text-slate-300' : 'text-slate-600'
                )}>
                {toast.message}
              </Text>
            )}

            {/* Action Button */}
            {toast.action && (
              <Pressable
                onPress={toast.action.onPress}
                className={cn(
                  'mt-3 self-start rounded-lg px-3 py-1.5',
                  isDark ? 'bg-white/10' : 'bg-black/5'
                )}>
                <Text className={cn('text-xs font-bold', config.color)}>{toast.action.label}</Text>
              </Pressable>
            )}
          </View>

          {/* Close Button */}
          <Pressable
            onPress={() => onDismiss(toast.id)}
            className={cn('ml-2 rounded-full p-1', isDark ? 'bg-white/10' : 'bg-black/5')}>
            <Icon as={X} className={isDark ? 'text-slate-400' : 'text-slate-500'} size={16} />
          </Pressable>
        </View>
      </View>
    </Animated.View>
  );
}

interface ToastProviderProps {
  children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<(Toast & { animatedValue: Animated.Value })[]>([]);

  const showToast = (toastData: Omit<Toast, 'id'>) => {
    const id = Date.now().toString();
    const animatedValue = new Animated.Value(0);
    const duration = toastData.duration || 4000;

    const newToast = {
      ...toastData,
      id,
      animatedValue,
    };

    setToasts((prev) => [...prev, newToast]);

    // Animate in
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    // Auto dismiss
    setTimeout(() => {
      dismissToast(id);
    }, duration);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => {
      const toast = prev.find((t) => t.id === id);
      if (toast) {
        // Animate out
        Animated.timing(toast.animatedValue, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start(() => {
          setToasts((current) => current.filter((t) => t.id !== id));
        });
      }
      return prev;
    });
  };

  const success = (title: string, message?: string) => {
    showToast({ type: 'success', title, message });
  };

  const error = (title: string, message?: string) => {
    showToast({ type: 'error', title, message });
  };

  const warning = (title: string, message?: string) => {
    showToast({ type: 'warning', title, message });
  };

  const info = (title: string, message?: string) => {
    showToast({ type: 'info', title, message });
  };

  return (
    <ToastContext.Provider
      value={{
        showToast,
        success,
        error,
        warning,
        info,
        dismissToast,
      }}>
      {children}

      {/* Toast Container */}
      {toasts.length > 0 && (
        <SafeAreaView className="pointer-events-none absolute inset-0" edges={['top']}>
          <View className="pointer-events-none flex-1 justify-start pt-4">
            {toasts.map((toast) => (
              <View key={toast.id} className="pointer-events-auto">
                <ToastItem toast={toast} onDismiss={dismissToast} />
              </View>
            ))}
          </View>
        </SafeAreaView>
      )}
    </ToastContext.Provider>
  );
}
