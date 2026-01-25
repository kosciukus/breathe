import { PHASE_ORDER } from "./constants";
import { DurationsSec, PhaseKey } from "./types";

export const clampSec = (n: number) => Math.max(0, Math.round(n));

export const nextPhase = (current: PhaseKey): PhaseKey => {
  const idx = PHASE_ORDER.indexOf(current);
  return PHASE_ORDER[(idx + 1) % PHASE_ORDER.length];
};

export const isSameDurations = (a: DurationsSec, b: DurationsSec) => {
  return a.inhale === b.inhale && a.hold1 === b.hold1 && a.exhale === b.exhale && a.hold2 === b.hold2;
};
