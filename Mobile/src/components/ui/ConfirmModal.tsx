import React from 'react';
import { View, Text, TouchableOpacity, Modal, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/src/store/themeStore';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDestructive?: boolean;
}

const { width } = Dimensions.get('window');

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  isDestructive = true,
}) => {
  const { theme } = useTheme();

  if (!isOpen) return null;

  const confirmStyles = isDestructive
    ? 'bg-rose-600 active:bg-rose-700'
    : 'bg-indigo-600 active:bg-indigo-700';

  const accentColor = isDestructive ? '#ef4444' : '#6366f1';
  const borderColor = isDestructive
    ? 'border-rose-100 dark:border-rose-800'
    : 'border-indigo-100 dark:border-indigo-800';

  const handleConfirm = () => {
    onConfirm();
    onCancel();
  };

  return (
    <Modal visible={isOpen} transparent animationType="fade" onRequestClose={onCancel}>
      <View className="flex-1 items-center justify-center bg-slate-900/60 p-4">
        <TouchableOpacity className="absolute inset-0" activeOpacity={1} onPress={onCancel} />

        <View
          className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-800"
          style={{ width: width * 0.9, maxWidth: 400 }}>
          {/* Top Progress Accent */}
          <View className="h-1.5 w-full" style={{ backgroundColor: accentColor }} />

          <View className="p-8">
            <View className="mb-6 flex-row items-start justify-between">
              <View
                className={`rounded-2xl border bg-slate-50 p-4 dark:bg-gray-700 ${borderColor}`}>
                <Ionicons
                  name={isDestructive ? 'warning' : 'shield-checkmark'}
                  size={28}
                  color={accentColor}
                />
              </View>
              <TouchableOpacity
                onPress={onCancel}
                className="p-2"
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <Ionicons name="close" size={20} color={theme === 'dark' ? '#9ca3af' : '#6b7280'} />
              </TouchableOpacity>
            </View>

            <Text className="mb-2 text-2xl font-black uppercase leading-tight tracking-tight text-slate-900 dark:text-gray-100">
              {title}
            </Text>
            <Text className="mb-6 text-xs font-black uppercase tracking-widest text-slate-400 dark:text-gray-500">
              Protocol Authorization Required
            </Text>

            <View className="mb-8 rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-gray-600 dark:bg-gray-700">
              <Text className="text-sm font-bold leading-relaxed text-slate-500 dark:text-gray-300">
                {message}
              </Text>
            </View>

            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={onCancel}
                className="flex-1 rounded-2xl border border-slate-200 bg-white py-4 active:bg-slate-50 dark:border-gray-600 dark:bg-gray-700 dark:active:bg-gray-600">
                <Text className="text-center text-xs font-black uppercase tracking-widest text-slate-500 dark:text-gray-300">
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleConfirm}
                className={`flex-1 rounded-2xl py-4 shadow-lg ${confirmStyles}`}>
                <Text className="text-center text-xs font-black uppercase tracking-widest text-white">
                  {isDestructive ? 'Confirm Delete' : 'Confirm Choice'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View className="flex-row justify-center border-t border-slate-100 bg-slate-50 px-8 py-3 dark:border-gray-600 dark:bg-gray-700">
            <Text className="text-xs font-black uppercase tracking-widest text-slate-300 dark:text-gray-500">
              Security Hash: {Math.random().toString(36).substring(7).toUpperCase()}
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ConfirmModal;
