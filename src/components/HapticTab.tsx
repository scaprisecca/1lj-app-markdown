import { TouchableOpacity, TouchableOpacityProps, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

interface HapticTabProps extends TouchableOpacityProps {
  children: React.ReactNode;
}

export function HapticTab({ children, onPress, ...props }: HapticTabProps) {
  const handlePress = (e: any) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress?.(e);
  };

  return (
    <TouchableOpacity activeOpacity={0.7} onPress={handlePress} {...props}>
      {children}
    </TouchableOpacity>
  );
}
