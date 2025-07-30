import { View, StyleSheet, Platform } from 'react-native';
import { BlurView } from 'expo-blur';

interface TabBarBackgroundProps {
  style?: any;
  children?: React.ReactNode;
}

export default function TabBarBackground({ style, children }: TabBarBackgroundProps) {
  if (Platform.OS === 'ios') {
    return (
      <BlurView 
        intensity={80} 
        tint="light"
        style={[StyleSheet.absoluteFill, style]}
      >
        {children}
      </BlurView>
    );
  }

  return (
    <View style={[styles.androidBackground, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  androidBackground: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
});
