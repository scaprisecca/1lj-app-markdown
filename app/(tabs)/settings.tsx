import { View, Text } from 'react-native';
import { useHeaderOptions } from '../../src/hooks/useHeaderOptions';

export default function SettingsScreen() {
  useHeaderOptions({
    title: 'Settings',
  });

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Settings Screen</Text>
    </View>
  );
}
