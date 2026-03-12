import '@/global.css';

import { NAV_THEME } from '@/lib/theme';
import { ThemeProvider } from '@react-navigation/native';
import { PortalHost } from '@rn-primitives/portal';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/src/lib/queryClient';
import { useEffect } from 'react';
import { useAuthStore } from '@/src/store/authStore';
import { useThemeStore } from '@/src/store/themeStore';
import { ToastProvider } from '@/src/components/ui/Toast';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

export { ErrorBoundary } from 'expo-router';

export default function RootLayout() {
  const { colorScheme, setColorScheme } = useColorScheme();
  const { loadToken, isLoading } = useAuthStore();
  const { loadTheme } = useThemeStore();

  useEffect(() => {
    loadToken();
    loadTheme().then(() => {
      const saved = useThemeStore.getState().colorScheme;
      if (saved && saved !== colorScheme) {
        setColorScheme(saved);
      }
    });
  }, []);

  useEffect(() => {
    if (!isLoading) {
      SplashScreen.hideAsync();
    }
  }, [isLoading]);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={NAV_THEME[colorScheme ?? 'light']}>
        <ToastProvider>
          <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(onboarding)" />
            <Stack.Screen name="(staff)" />
            <Stack.Screen name="(admin)" />
            <Stack.Screen name="(system)" />
          </Stack>
          <PortalHost />
        </ToastProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
