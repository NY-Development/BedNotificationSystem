import React, { useState } from 'react';
import { View } from 'react-native';
import { Stack } from 'expo-router';
import { BottomNav } from '@/src/components/layout/BottomNav';
import { FloatingHelpButton, QuickHelpModal } from '@/src/components/ui/QuickHelpModal';

export default function StaffLayout() {
  const [isHelpVisible, setIsHelpVisible] = useState(false);

  return (
    <View className="flex-1">
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="assignments" />
        <Stack.Screen name="notifications" />
        <Stack.Screen name="profile" />
        <Stack.Screen name="subscription" />
        <Stack.Screen name="support" />
        <Stack.Screen name="UpdateExpiryScreen" />
      </Stack>
      <BottomNav variant="staff" />
      <FloatingHelpButton
        onPress={() => setIsHelpVisible(true)}
        className="bottom-20" // Adjust for bottom nav
      />
      <QuickHelpModal isVisible={isHelpVisible} onClose={() => setIsHelpVisible(false)} />
    </View>
  );
}
