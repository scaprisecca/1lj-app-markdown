import { ComponentType } from 'react';
import { TextProps } from 'react-native';

declare module '@expo/vector-icons/MaterialCommunityIcons' {
  export interface MaterialCommunityIconsProps extends TextProps {
    name: string;
    size?: number;
    color?: string;
  }

  const MaterialCommunityIcons: ComponentType<MaterialCommunityIconsProps>;
  export default MaterialCommunityIcons;
}
