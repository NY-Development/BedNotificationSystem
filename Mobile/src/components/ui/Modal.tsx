import React from 'react';
import {
  View,
  Text,
  Modal as RNModal,
  Pressable,
  type ModalProps as RNModalProps,
} from 'react-native';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';

interface ModalProps extends Omit<RNModalProps, 'children'> {
  title?: string;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

export function Modal({ title, onClose, children, className, ...props }: ModalProps) {
  return (
    <RNModal transparent animationType="fade" {...props}>
      <View className="flex-1 items-center justify-center bg-black/50 px-6">
        <View className={cn('w-full max-w-sm rounded-2xl bg-card p-6 shadow-xl', className)}>
          <View className="mb-4 flex-row items-center justify-between">
            {!!title && <Text className="text-lg font-bold text-foreground">{title}</Text>}
            <Pressable onPress={onClose} className="p-1">
              <Icon as={X} className="text-muted-foreground" size={22} />
            </Pressable>
          </View>
          {children}
        </View>
      </View>
    </RNModal>
  );
}
