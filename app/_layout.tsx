import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import "@/i18n";

import { BreathingProvider, useBreathing } from "@/features/breathing";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  return (
    <BreathingProvider>
      <RootLayoutContent />
    </BreathingProvider>
  );
}

function RootLayoutContent() {
  const { darkModeEnabled, darkModeReady } = useBreathing();
  const activeColorScheme = darkModeEnabled ? "dark" : "light";

  if (!darkModeReady) {
    return null;
  }

  return (
    <ThemeProvider
      value={activeColorScheme === "dark" ? DarkTheme : DefaultTheme}
    >
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="modal"
          options={{ presentation: "modal", title: "Modal" }}
        />
      </Stack>
      <StatusBar style={activeColorScheme === "dark" ? "light" : "dark"} />
    </ThemeProvider>
  );
}
