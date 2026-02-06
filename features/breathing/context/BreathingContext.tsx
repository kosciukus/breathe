import React, {
  createContext,
  useCallback,
  useEffect,
  PropsWithChildren,
  useContext,
  useMemo,
  useState,
} from "react";
import * as SecureStore from "expo-secure-store";
import { AppState, AppStateStatus } from "react-native";
import { activateKeepAwakeAsync, deactivateKeepAwake } from "expo-keep-awake";

import {
  BreathingTimerState,
  useBreathingTimer,
} from "../hooks/useBreathingTimer";

export type BreathingContextValue = BreathingTimerState & {
  soundEnabled: boolean;
  setSoundEnabled: (next: boolean) => void;
  vibrationEnabled: boolean;
  setVibrationEnabled: (next: boolean) => void;
  darkModeEnabled: boolean;
  setDarkModeEnabled: (next: boolean) => void;
  darkModeReady: boolean;
  presetsOpen: boolean;
  setPresetsOpen: (next: boolean) => void;
  preferencesOpen: boolean;
  setPreferencesOpen: (next: boolean) => void;
  languageOpen: boolean;
  setLanguageOpen: (next: boolean) => void;
};

const BreathingContext = createContext<BreathingContextValue | null>(null);
const DARK_MODE_KEY = "breathe.theme.darkMode";
const SOUND_ENABLED_KEY = "breathe.preferences.soundEnabled";
const VIBRATION_ENABLED_KEY = "breathe.preferences.vibrationEnabled";
const KEEP_AWAKE_TAG = "breathing-session";

export function BreathingProvider({ children }: PropsWithChildren) {
  const timer = useBreathingTimer();
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [hasLoadedDarkMode, setHasLoadedDarkMode] = useState(false);
  const [hasLoadedSoundEnabled, setHasLoadedSoundEnabled] = useState(false);
  const [hasLoadedVibrationEnabled, setHasLoadedVibrationEnabled] =
    useState(false);
  const [presetsOpen, setPresetsOpen] = useState(false);
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);

  const clearKeepAwake = useCallback(() => {
    deactivateKeepAwake(KEEP_AWAKE_TAG);
    deactivateKeepAwake();
  }, []);

  useEffect(() => {
    const shouldKeepAwake =
      timer.isRunning &&
      (timer.sessionRemainingMs === null || timer.sessionRemainingMs > 0);

    if (!shouldKeepAwake) {
      clearKeepAwake();
      return;
    }

    if (AppState.currentState !== "active") {
      clearKeepAwake();
      return;
    }

    activateKeepAwakeAsync(KEEP_AWAKE_TAG).catch(() => undefined);
  }, [timer.isRunning, timer.sessionRemainingMs, clearKeepAwake]);

  useEffect(() => {
    const handleAppState = (state: AppStateStatus) => {
      if (state !== "active") {
        clearKeepAwake();
        return;
      }

      if (
        timer.isRunning &&
        (timer.sessionRemainingMs === null || timer.sessionRemainingMs > 0)
      ) {
        activateKeepAwakeAsync(KEEP_AWAKE_TAG).catch(() => undefined);
      } else {
        clearKeepAwake();
      }
    };

    const subscription = AppState.addEventListener("change", handleAppState);
    return () => {
      subscription.remove();
      clearKeepAwake();
    };
  }, [timer.isRunning, timer.sessionRemainingMs, clearKeepAwake]);

  useEffect(() => {
    SecureStore.getItemAsync(DARK_MODE_KEY)
      .then((saved) => {
        setDarkModeEnabled(saved === "true");
      })
      .finally(() => setHasLoadedDarkMode(true))
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    if (!hasLoadedDarkMode) return;
    SecureStore.setItemAsync(DARK_MODE_KEY, String(darkModeEnabled)).catch(
      () => undefined,
    );
  }, [darkModeEnabled, hasLoadedDarkMode]);

  useEffect(() => {
    SecureStore.getItemAsync(SOUND_ENABLED_KEY)
      .then((saved) => {
        if (saved === null) return;
        setSoundEnabled(saved === "true");
      })
      .finally(() => setHasLoadedSoundEnabled(true))
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    if (!hasLoadedSoundEnabled) return;
    SecureStore.setItemAsync(SOUND_ENABLED_KEY, String(soundEnabled)).catch(
      () => undefined,
    );
  }, [soundEnabled, hasLoadedSoundEnabled]);

  useEffect(() => {
    SecureStore.getItemAsync(VIBRATION_ENABLED_KEY)
      .then((saved) => {
        if (saved === null) return;
        setVibrationEnabled(saved === "true");
      })
      .finally(() => setHasLoadedVibrationEnabled(true))
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    if (!hasLoadedVibrationEnabled) return;
    SecureStore.setItemAsync(
      VIBRATION_ENABLED_KEY,
      String(vibrationEnabled),
    ).catch(() => undefined);
  }, [vibrationEnabled, hasLoadedVibrationEnabled]);

  const value = useMemo(
    () => ({
      ...timer,
      soundEnabled,
      setSoundEnabled,
      vibrationEnabled,
      setVibrationEnabled,
      darkModeEnabled,
      setDarkModeEnabled,
      darkModeReady: hasLoadedDarkMode,
      presetsOpen,
      setPresetsOpen,
      preferencesOpen,
      setPreferencesOpen,
      languageOpen,
      setLanguageOpen,
    }),
    [
      timer,
      soundEnabled,
      vibrationEnabled,
      darkModeEnabled,
      presetsOpen,
      preferencesOpen,
      languageOpen,
    ],
  );

  return (
    <BreathingContext.Provider value={value}>
      {children}
    </BreathingContext.Provider>
  );
}

export function useBreathing() {
  const ctx = useContext(BreathingContext);
  if (!ctx) {
    throw new Error("useBreathing must be used within BreathingProvider");
  }
  return ctx;
}
