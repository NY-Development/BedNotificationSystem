import React from 'react';
import { View, type ViewProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { cn } from '@/lib/utils';

interface ScreenWrapperProps extends ViewProps {
  safeArea?: boolean;
}

export function ScreenWrapper({
  safeArea = true,
  className,
  children,
  ...props
}: ScreenWrapperProps) {
  const Wrapper = safeArea ? SafeAreaView : View;
  return (
    <Wrapper className={cn('flex-1 bg-background', className)} {...props}>
      {children}
    </Wrapper>
  );
}
