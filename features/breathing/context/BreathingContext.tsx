import React, { createContext, PropsWithChildren, useContext, useMemo, useState } from "react";

import { BreathingTimerState, useBreathingTimer } from "../hooks/useBreathingTimer";

export type BreathingContextValue = BreathingTimerState & {
  soundEnabled: boolean;
  setSoundEnabled: (next: boolean) => void;
  vibrationEnabled: boolean;
  setVibrationEnabled: (next: boolean) => void;
  presetsOpen: boolean;
  setPresetsOpen: (next: boolean) => void;
  preferencesOpen: boolean;
  setPreferencesOpen: (next: boolean) => void;
  languageOpen: boolean;
  setLanguageOpen: (next: boolean) => void;
};

const BreathingContext = createContext<BreathingContextValue | null>(null);

export function BreathingProvider({ children }: PropsWithChildren) {
  const timer = useBreathingTimer();
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [presetsOpen, setPresetsOpen] = useState(false);
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);

  const value = useMemo(
    () => ({
      ...timer,
      soundEnabled,
      setSoundEnabled,
      vibrationEnabled,
      setVibrationEnabled,
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
      presetsOpen,
      preferencesOpen,
      languageOpen,
    ]
  );

  return <BreathingContext.Provider value={value}>{children}</BreathingContext.Provider>;
}

export function useBreathing() {
  const ctx = useContext(BreathingContext);
  if (!ctx) {
    throw new Error("useBreathing must be used within BreathingProvider");
  }
  return ctx;
}
