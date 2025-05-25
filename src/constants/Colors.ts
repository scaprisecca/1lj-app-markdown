export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    card: '#f8f9fa',
    tint: '#0a7ea4',
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: '#0a7ea4',
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    card: '#1e1e1e',
    tint: '#fff',
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: '#fff',
  },
} as const;

export type ColorScheme = keyof typeof Colors;
export type ColorKey = keyof typeof Colors.light;
