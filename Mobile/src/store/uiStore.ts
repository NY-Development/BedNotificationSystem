import { create } from 'zustand';

interface UIState {
  isModalOpen: boolean;
  modalContent: string | null;
  toastMessage: string | null;
  toastType: 'success' | 'error' | 'info' | 'warning' | null;
  showModal: (content: string) => void;
  hideModal: () => void;
  showToast: (message: string, type: 'success' | 'error' | 'info' | 'warning') => void;
  hideToast: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isModalOpen: false,
  modalContent: null,
  toastMessage: null,
  toastType: null,

  showModal: (content) => set({ isModalOpen: true, modalContent: content }),
  hideModal: () => set({ isModalOpen: false, modalContent: null }),
  showToast: (message, type) => set({ toastMessage: message, toastType: type }),
  hideToast: () => set({ toastMessage: null, toastType: null }),
}));
