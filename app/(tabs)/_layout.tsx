import { Tabs, useRouter } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useBreathing } from '@/features/breathing';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const { t } = useTranslation();
  const colorScheme = useColorScheme() ?? 'light';
  const router = useRouter();
  const { setPresetsOpen, setPreferencesOpen, setLanguageOpen } = useBreathing();

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
        listeners={{
          tabPress: (event) => {
            event.preventDefault();
            setPresetsOpen(true);
            setPreferencesOpen(false);
            setLanguageOpen(false);
            router.navigate('/');
          },
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
        listeners={{
          tabPress: (event) => {
            event.preventDefault();
            setPreferencesOpen(true);
            setPresetsOpen(false);
            setLanguageOpen(false);
            router.navigate('/');
          },
        }}
      />
      <Tabs.Screen
        name="language"
        options={{
          title: t('section.language'),
          tabBarIcon: ({ color }) => <IconSymbol size={22} name="globe" color={color} />,
        }}
        listeners={{
          tabPress: (event) => {
            event.preventDefault();
            setLanguageOpen(true);
            setPresetsOpen(false);
            setPreferencesOpen(false);
            router.navigate('/');
          },
        }}
      />
    </Tabs>
  );
}
