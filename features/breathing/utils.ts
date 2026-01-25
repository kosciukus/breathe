import { PHASE_ORDER } from "./constants";
import { PhaseKey } from "./types";

export const clampSec = (n: number) => Math.max(0, Math.round(n));

export const nextPhase = (current: PhaseKey): PhaseKey => {
  const idx = PHASE_ORDER.indexOf(current);
  return PHASE_ORDER[(idx + 1) % PHASE_ORDER.length];
};
