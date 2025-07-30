import { View, Text } from 'react-native';
import { useHeaderOptions } from '../../hooks/useHeaderOptions';

export default function AddEntryScreen() {
  useHeaderOptions({
    title: 'Add Entry',
  });

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Add Entry Screen</Text>
    </View>
  );
}
