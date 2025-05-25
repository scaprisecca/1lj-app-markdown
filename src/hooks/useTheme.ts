import { useColorScheme } from 'react-native';
import { Colors, ColorScheme } from '@/constants/Colors';

type Theme = {
  colorScheme: ColorScheme;
  colors: typeof Colors.light | typeof Colors.dark;
  isDark: boolean;
};

export function useTheme(): Theme {
  const colorScheme = (useColorScheme() as ColorScheme) ?? 'light';
  const colors = Colors[colorScheme];
  
  return {
    colorScheme,
    colors,
    isDark: colorScheme === 'dark',
  };
}
