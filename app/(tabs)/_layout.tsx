import React from 'react';
import { Platform, View } from 'react-native';

import { HapticTab } from '@components/HapticTab';
import { IconSymbol } from '@components/ui/IconSymbol';
import TabBarBackground from '@components/ui/TabBarBackground';
import { Colors } from '@constants/Colors';
import { useColorScheme } from '@hooks/useColorScheme';

import { Tabs } from 'expo-router';

type ColorScheme = 'light' | 'dark';

export default function TabLayout() {
  const colorScheme = useColorScheme() as ColorScheme;
  const colors = Colors[colorScheme] || Colors.light;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.tint,
        tabBarInactiveTintColor: colors.tabIconDefault,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: () => <TabBarBackground />,
        tabBarStyle: [
          {
            borderTopWidth: 0,
            backgroundColor: colors.background,
            paddingTop: 8,
            paddingBottom: Platform.OS === 'ios' ? 28 : 8,
            height: Platform.OS === 'ios' ? 80 : 60,
          },
          Platform.OS === 'ios' && {
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
          },
        ],
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginBottom: Platform.OS === 'ios' ? 4 : 0,
        },
        tabBarItemStyle: {
          paddingVertical: 4,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol 
              size={24} 
              name={focused ? 'home' : 'home-outline'} 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="add-entry"
        options={{
          title: 'Add Entry',
          tabBarIcon: ({ color, focused }) => (
            <View style={{
              backgroundColor: colors.tint,
              width: 50,
              height: 50,
              borderRadius: 25,
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: Platform.OS === 'ios' ? 20 : 0,
              ...Platform.select({
                ios: {
                  shadowColor: colors.tint,
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.3,
                  shadowRadius: 4,
                },
                android: {
                  elevation: 4,
                },
              }),
            }}>
              <IconSymbol size={24} name="plus" color="white" />
            </View>
          ),
          tabBarLabel: () => null,
        }}
      />
      <Tabs.Screen
        name="view-log"
        options={{
          title: 'View Log',
          tabBarIcon: ({ color }) => (
            <IconSymbol 
              size={24} 
              name="format-list-bulleted" 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => (
            <IconSymbol 
              size={24} 
              name="cog" 
              color={color} 
            />
          ),
        }}
      />
    </Tabs>
  );
}
