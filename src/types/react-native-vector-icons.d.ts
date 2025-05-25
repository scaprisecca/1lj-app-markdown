import { ComponentType } from 'react';
import { TextProps } from 'react-native';

interface IconProps extends TextProps {
  name: string;
  size?: number;
  color?: string;
}

declare module '@expo/vector-icons/MaterialCommunityIcons' {
  const MaterialCommunityIcons: ComponentType<IconProps>;
  export default MaterialCommunityIcons;
}
