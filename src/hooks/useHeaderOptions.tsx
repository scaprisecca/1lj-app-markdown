import { useNavigation } from 'expo-router';
import { useLayoutEffect } from 'react';
import { AppHeader } from '../components/header/AppHeader';

type HeaderOptions = {
  title?: string;
  showBackButton?: boolean;
  headerRight?: React.ReactNode;
  onDateSelect?: (date: string) => void;
};

export const useHeaderOptions = ({
  title,
  showBackButton = false,
  headerRight,
  onDateSelect = () => {}
}: HeaderOptions = {}) => {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      header: () => (
        <AppHeader 
          title={title}
          onDateSelect={onDateSelect}
        />
      ),
      headerBackTitle: showBackButton ? 'Back' : undefined,
      headerRight: () => headerRight || null,
    });
  }, [navigation, title, showBackButton, headerRight, onDateSelect]);
};
