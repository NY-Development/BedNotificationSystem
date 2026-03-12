import React, { useState } from 'react';
import { View } from 'react-native';
import { Stack } from 'expo-router';
import { BottomNav } from '@/src/components/layout/BottomNav';
import { FloatingHelpButton, QuickHelpModal } from '@/src/components/ui/QuickHelpModal';

export default function AdminLayout() {
  const [isHelpVisible, setIsHelpVisible] = useState(false);

  return (
    <View className="flex-1">
      <Stack screenOptions={{ headerShown: false }} />
      <BottomNav variant="admin" />
      <FloatingHelpButton
        onPress={() => setIsHelpVisible(true)}
        className="bottom-20" // Adjust for bottom nav
      />
      <QuickHelpModal isVisible={isHelpVisible} onClose={() => setIsHelpVisible(false)} />
    </View>
  );
}
