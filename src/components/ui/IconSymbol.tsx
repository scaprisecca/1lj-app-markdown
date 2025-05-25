import { StyleProp, TextStyle } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type MaterialCommunityIconName = keyof typeof MaterialCommunityIcons.glyphMap;

type IconSymbolProps = {
  name: MaterialCommunityIconName | string;
  size?: number;
  color?: string;
  style?: StyleProp<TextStyle>;
};

export const IconSymbol = ({
  name,
  size = 24,
  color = '#000',
  style,
}: IconSymbolProps) => {
  return (
    <MaterialCommunityIcons
      name={name as MaterialCommunityIconName}
      size={size}
      color={color}
      style={style}
    />
  );
};
