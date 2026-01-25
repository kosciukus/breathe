import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { PHASE_ORDER, TICK_MS } from "../constants";
import { BREATHING_PRESETS } from "../presets";
import { DurationsSec, PhaseKey } from "../types";
import { clampSec, nextPhase } from "../utils";

type BreathingTimerState = {
  active: DurationsSec;
  draft: DurationsSec;
  phase: PhaseKey;
  remainingMs: number;
  isRunning: boolean;
  progress: number;
  remainingSecDisplay: number;
  totalActiveSec: number;
  presets: typeof BREATHING_PRESETS;
  applyPreset: (name: string) => void;
  toggleRun: () => void;
  reset: () => void;
  setDraftField: (key: keyof DurationsSec, v: number) => void;
};

export const useBreathingTimer = (): BreathingTimerState => {
  const [draft, setDraft] = useState<DurationsSec>({
    inhale: 4,
    hold1: 0,
    exhale: 6,
    hold2: 0,
  });
  const [active, setActive] = useState<DurationsSec>(draft);
  const [phase, setPhase] = useState<PhaseKey>("inhale");
  const [remainingMs, setRemainingMs] = useState<number>(active.inhale * 1000);
  const [isRunning, setIsRunning] = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isRunningRef = useRef(isRunning);
  const phaseRef = useRef<PhaseKey>(phase);
  const remainingRef = useRef<number>(remainingMs);
  const draftRef = useRef<DurationsSec>(draft);

  useEffect(() => {
    isRunningRef.current = isRunning;
  }, [isRunning]);

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  useEffect(() => {
    remainingRef.current = remainingMs;
  }, [remainingMs]);

  useEffect(() => {
    draftRef.current = draft;
  }, [draft]);

  const currentPhaseDurationMs = useMemo(() => {
    return Math.max(0, active[phase] * 1000);
  }, [active, phase]);

  const progress = useMemo(() => {
    const total = currentPhaseDurationMs;
    if (total <= 0) return 1;
    const elapsed = total - remainingMs;
    return Math.min(1, Math.max(0, elapsed / total));
  }, [currentPhaseDurationMs, remainingMs]);

  const remainingSecDisplay = useMemo(() => {
    return Math.ceil(remainingMs / 1000);
  }, [remainingMs]);

  const clearTimer = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const setPhaseAndRemaining = useCallback((p: PhaseKey, durations: DurationsSec) => {
    setPhase(p);
    setRemainingMs(Math.max(0, durations[p] * 1000));
  }, []);

  const reset = useCallback(() => {
    clearTimer();
    setIsRunning(false);
    setActive(draftRef.current);
    setPhaseAndRemaining("inhale", draftRef.current);
  }, [clearTimer, setPhaseAndRemaining]);

  const start = useCallback(() => {
    if (isRunningRef.current) return;

    const d = draftRef.current;
    setActive(d);
    const nextMs = Math.max(0, d[phaseRef.current] * 1000);
    setRemainingMs(nextMs);
    remainingRef.current = nextMs;

    setIsRunning(true);
  }, []);

  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const toggleRun = useCallback(() => {
    if (isRunningRef.current) pause();
    else start();
  }, [pause, start]);

  useEffect(() => {
    clearTimer();

    if (!isRunning) return;

    intervalRef.current = setInterval(() => {
      const rem = remainingRef.current;

      if (rem <= 0) {
        const nextActive = draftRef.current;
        setActive(nextActive);

        const p = phaseRef.current;
        let np = nextPhase(p);

        for (let i = 0; i < PHASE_ORDER.length; i++) {
          if (nextActive[np] > 0) break;
          np = nextPhase(np);
        }

        const totalSec =
          nextActive.inhale + nextActive.hold1 + nextActive.exhale + nextActive.hold2;
        if (totalSec <= 0) {
          setIsRunning(false);
          return;
        }

        setPhase(np);
        setRemainingMs(Math.max(0, nextActive[np] * 1000));
        return;
      }

      const nextRem = rem - TICK_MS;
      remainingRef.current = nextRem;
      setRemainingMs(nextRem);
    }, TICK_MS);

    return () => {
      clearTimer();
    };
  }, [clearTimer, isRunning]);

  useEffect(() => {
    if (isRunningRef.current) return;

    const maxMs = active[phase] * 1000;
    if (remainingMs > maxMs) setRemainingMs(maxMs);
  }, [active, phase, remainingMs]);

  const setDraftField = useCallback((key: keyof DurationsSec, v: number) => {
    setDraft((prev) => ({ ...prev, [key]: clampSec(v) }));
  }, []);

  const applyPreset = useCallback((name: string) => {
    const preset = BREATHING_PRESETS.find((item) => item.name === name);
    if (!preset) return;
    setDraft(preset.durations);
  }, []);

  const totalActiveSec = active.inhale + active.hold1 + active.exhale + active.hold2;

  return {
    active,
    draft,
    phase,
    remainingMs,
    isRunning,
    progress,
    remainingSecDisplay,
    totalActiveSec,
    presets: BREATHING_PRESETS,
    applyPreset,
    toggleRun,
    reset,
    setDraftField,
  };
};
