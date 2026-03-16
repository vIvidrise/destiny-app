import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppConfig } from '@/constants/appConfig';

interface AnalysisScreenLayoutProps {
  children: React.ReactNode;
  /** 기본 패딩 사용 (false면 각 화면이 자체 패딩 사용) */
  noPadding?: boolean;
  style?: ViewStyle;
}

const LAYOUT = {
  backgroundColor: AppConfig.ui.backgroundColor,
  paddingHorizontal: 20,
  paddingTop: 24,
  paddingBottom: 24,
} as const;

export function AnalysisScreenLayout({
  children,
  noPadding = true,
  style,
}: AnalysisScreenLayoutProps) {
  const insets = useSafeAreaInsets();

  const containerStyle = [
    styles.container,
    { paddingBottom: Math.max(LAYOUT.paddingBottom, insets.bottom) },
    !noPadding && {
      paddingHorizontal: LAYOUT.paddingHorizontal,
      paddingTop: LAYOUT.paddingTop,
    },
    style,
  ];

  return <View style={containerStyle}>{children}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: LAYOUT.backgroundColor,
  },
});
