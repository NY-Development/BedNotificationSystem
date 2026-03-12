import { create } from 'zustand';
import type { Department } from '@/src/types';

interface BedState {
  departments: Department[];
  selectedDepartment: Department | null;
  isLoading: boolean;
  setDepartments: (departments: Department[]) => void;
  setSelectedDepartment: (dept: Department | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useBedStore = create<BedState>((set) => ({
  departments: [],
  selectedDepartment: null,
  isLoading: true,

  setDepartments: (departments) => set({ departments }),
  setSelectedDepartment: (selectedDepartment) => set({ selectedDepartment }),
  setLoading: (isLoading) => set({ isLoading }),
}));
