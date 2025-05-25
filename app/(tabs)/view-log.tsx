import { View, Text } from 'react-native';
import { useHeaderOptions } from '../../src/hooks/useHeaderOptions';

export default function ViewLogScreen() {
  useHeaderOptions({
    title: 'View Log',
  });

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>View Log Screen</Text>
    </View>
  );
}
