import { Tabs } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const { t } = useTranslation();
  const colorScheme = useColorScheme() ?? 'light';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#111111',
        tabBarInactiveTintColor: Colors[colorScheme].tabIconDefault,
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopColor: '#EAE6E0',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: t('section.home'),
          tabBarIcon: ({ color }) => <IconSymbol size={22} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="presets"
        options={{
          title: t('section.presets'),
          tabBarIcon: ({ color }) => <IconSymbol size={22} name="leaf.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="preferences"
        options={{
          title: t('section.preferences'),
          tabBarIcon: ({ color }) => (
            <IconSymbol size={22} name="slider.horizontal.3" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="language"
        options={{
          title: t('section.language'),
          tabBarIcon: ({ color }) => <IconSymbol size={22} name="globe" color={color} />,
        }}
      />
    </Tabs>
  );
}
