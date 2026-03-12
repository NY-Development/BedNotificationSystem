import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface University {
  id: string;
  name: string;
  description: string;
  image: string;
}

interface UniversityStore {
  selectedUniversity: string | null;
  universities: University[];
  setSelectedUniversity: (university: string) => Promise<void>;
  loadSelectedUniversity: () => Promise<void>;
  setUniversities: (universities: University[]) => void;
}

export const useUniversityStore = create<UniversityStore>((set, get) => ({
  selectedUniversity: null,
  universities: [
    {
      id: '1',
      name: 'Addis Ababa University',
      description:
        'Leading medical education institution in Ethiopia with comprehensive clinical training facilities.',
      image: 'https://via.placeholder.com/400x200/3B82F6/ffffff?text=AAU',
    },
    {
      id: '2',
      name: 'Jimma University',
      description:
        'Renowned for its medical school and healthcare research programs across Ethiopia.',
      image: 'https://via.placeholder.com/400x200/10B981/ffffff?text=JU',
    },
    {
      id: '3',
      name: 'Gondar University',
      description:
        'Specialized medical training with focus on rural healthcare delivery and community medicine.',
      image: 'https://via.placeholder.com/400x200/F59E0B/ffffff?text=GU',
    },
  ],

  setSelectedUniversity: async (university: string) => {
    try {
      await AsyncStorage.setItem('selectedUniversity', university);
      set({ selectedUniversity: university });
    } catch (error) {
      console.error('Error saving selected university:', error);
    }
  },

  loadSelectedUniversity: async () => {
    try {
      const university = await AsyncStorage.getItem('selectedUniversity');
      if (university) {
        set({ selectedUniversity: university });
      }
    } catch (error) {
      console.error('Error loading selected university:', error);
    }
  },

  setUniversities: (universities: University[]) => {
    set({ universities });
  },
}));
