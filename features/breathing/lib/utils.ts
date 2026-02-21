import { PHASE_ORDER } from "./constants";
import { BreathingPreset, DurationsSec, PhaseKey } from "./types";

export const clampSec = (n: number) => Math.max(0, Math.round(n));

export const nextPhase = (current: PhaseKey): PhaseKey => {
  const idx = PHASE_ORDER.indexOf(current);
  return PHASE_ORDER[(idx + 1) % PHASE_ORDER.length];
};

export const isSameDurations = (a: DurationsSec, b: DurationsSec) => {
  return (
    a.inhale === b.inhale &&
    a.hold1 === b.hold1 &&
    a.exhale === b.exhale &&
    a.hold2 === b.hold2
  );
};

export const isSamePresetConfig = (
  preset: BreathingPreset,
  durations: DurationsSec,
  repeatMinutes: number,
) => {
  return (
    isSameDurations(preset.durations, durations) &&
    preset.repeatMinutes === repeatMinutes
  );
};

export const formatMinutesSeconds = (ms: number) => {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
};
