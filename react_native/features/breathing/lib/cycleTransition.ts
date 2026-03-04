import type { DurationsSec, PhaseKey } from "./types";

const PHASE_ORDER: PhaseKey[] = ["inhale", "hold1", "exhale", "hold2"];

export type CycleTransitionResult =
  | { action: "stop" }
  | { action: "continue"; phase: PhaseKey; remainingMs: number };

const totalCycleMs = (durations: DurationsSec) => {
  return (
    durations.inhale + durations.hold1 + durations.exhale + durations.hold2
  ) * 1000;
};

export const firstActivePhase = (durations: DurationsSec): PhaseKey | null => {
  for (const candidate of PHASE_ORDER) {
    if (durations[candidate] > 0) {
      return candidate;
    }
  }
  return null;
};

export const resolveCycleTransition = ({
  currentPhase,
  durations,
  spillMs,
  stopAfterCycle,
}: {
  currentPhase: PhaseKey;
  durations: DurationsSec;
  spillMs: number;
  stopAfterCycle: boolean;
}): CycleTransitionResult => {
  const cycleMs = totalCycleMs(durations);
  if (cycleMs <= 0) {
    return { action: "stop" };
  }

  const nextCycleStart = firstActivePhase(durations);
  if (!nextCycleStart) {
    return { action: "stop" };
  }

  let nextSpillMs = Math.max(0, spillMs);
  if (!stopAfterCycle && nextSpillMs >= cycleMs) {
    nextSpillMs %= cycleMs;
  }

  let phaseIndex = PHASE_ORDER.indexOf(currentPhase);
  if (phaseIndex < 0) {
    phaseIndex = 0;
  }

  for (let i = 0; i < PHASE_ORDER.length + 1; i++) {
    phaseIndex = (phaseIndex + 1) % PHASE_ORDER.length;
    const phase = PHASE_ORDER[phaseIndex];
    const phaseDurationMs = Math.max(0, durations[phase] * 1000);
    if (phaseDurationMs <= 0) {
      continue;
    }

    if (stopAfterCycle && phase === nextCycleStart) {
      return { action: "stop" };
    }

    if (nextSpillMs < phaseDurationMs) {
      return {
        action: "continue",
        phase,
        remainingMs: phaseDurationMs - nextSpillMs,
      };
    }

    nextSpillMs -= phaseDurationMs;
  }

  return { action: "stop" };
};
