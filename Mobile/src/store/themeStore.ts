import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'nativewind';

type ColorScheme = 'light' | 'dark';

interface ThemeState {
  colorScheme: ColorScheme;
  setColorScheme: (scheme: ColorScheme) => void;
  loadTheme: () => Promise<void>;
}

export const useThemeStore = create<ThemeState>((set) => ({
  colorScheme: 'light',

  setColorScheme: async (scheme) => {
    await AsyncStorage.setItem('theme', scheme);
    set({ colorScheme: scheme });
  },

  loadTheme: async () => {
    const saved = await AsyncStorage.getItem('theme');
    if (saved === 'light' || saved === 'dark') {
      set({ colorScheme: saved });
    }
  },
}));
