import React from 'react';
import { View, ViewProps } from 'react-native';
import { useTheme } from '@hooks/useTheme';

type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({
  style,
  lightColor,
  darkColor,
  ...otherProps
}: ThemedViewProps) {
  const { colors, isDark } = useTheme();
  const backgroundColor = darkColor && lightColor 
    ? (isDark ? darkColor : lightColor)
    : colors.background;

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
