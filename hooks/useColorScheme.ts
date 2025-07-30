import { useColorScheme as _useColorScheme } from 'react-native';
import { ColorScheme } from '../constants/Colors'; // Adjusted path

/**
 * A custom hook that returns the current color scheme of the app.
 * It falls back to 'light' if the color scheme is not available.
 */
export function useColorScheme(): ColorScheme {
  const colorScheme = _useColorScheme();
  return colorScheme || 'light';
}
