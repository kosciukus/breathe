import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { PHASE_ORDER, TICK_MS } from "../lib/constants";
import { BREATHING_PRESETS } from "../data/presets";
import { BreathingPreset, DurationsSec, PhaseKey } from "../lib/types";
import { clampSec, isSameDurations, nextPhase } from "../lib/utils";

export type BreathingTimerState = {
  active: DurationsSec;
  draft: DurationsSec;
  repeatMinutes: number;
  phase: PhaseKey;
  remainingMs: number;
  sessionRemainingMs: number | null;
  isRunning: boolean;
  progress: number;
  remainingSecDisplay: number;
  totalActiveSec: number;
  presets: BreathingPreset[];
  applyPreset: (name: string) => void;
  addPreset: (label: string, durations: DurationsSec, repeatMinutes: number) => Promise<void>;
  removePreset: (name: string) => void;
  toggleFavorite: (name: string) => void;
  setRepeatMinutes: (next: number) => void;
  toggleRun: () => void;
  reset: () => void;
  setDraftField: (key: keyof DurationsSec, v: number) => void;
};

const CUSTOM_PRESETS_KEY = "breathe.presets.custom";
const FAVORITE_PRESETS_KEY = "breathe.presets.favorites";
const LAST_PRESET_KEY = "breathe.presets.last";
const HIDDEN_PRESETS_KEY = "breathe.presets.hidden";

const sanitizeCustomPreset = (value: unknown): BreathingPreset | null => {
  if (!value || typeof value !== "object") return null;
  const record = value as Record<string, unknown>;
  if (typeof record.name !== "string") return null;
  if (!record.durations || typeof record.durations !== "object") return null;
  const durationsRecord = record.durations as Record<string, unknown>;
  const inhale = Number(durationsRecord.inhale);
  const hold1 = Number(durationsRecord.hold1);
  const exhale = Number(durationsRecord.exhale);
  const hold2 = Number(durationsRecord.hold2);
  const repeatMinutes = Number(record.repeatMinutes);
  if (
    !Number.isFinite(inhale) ||
    !Number.isFinite(hold1) ||
    !Number.isFinite(exhale) ||
    !Number.isFinite(hold2) ||
    !Number.isFinite(repeatMinutes)
  ) {
    return null;
  }
  const label = typeof record.label === "string" ? record.label : undefined;
  return {
    name: record.name,
    label,
    durations: {
      inhale: clampSec(inhale),
      hold1: clampSec(hold1),
      exhale: clampSec(exhale),
      hold2: clampSec(hold2),
    },
    repeatMinutes: clampSec(repeatMinutes),
    isCustom: true,
  };
};

export const useBreathingTimer = (): BreathingTimerState => {
  const [customPresets, setCustomPresets] = useState<BreathingPreset[]>([]);
  const [customPresetsLoaded, setCustomPresetsLoaded] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [hiddenPresets, setHiddenPresets] = useState<string[]>([]);
  const [hiddenPresetsLoaded, setHiddenPresetsLoaded] = useState(false);
  const [draft, setDraft] = useState<DurationsSec>({
    inhale: 4,
    hold1: 0,
    exhale: 6,
    hold2: 0,
  });
  const [active, setActive] = useState<DurationsSec>(draft);
  const [repeatMinutes, setRepeatMinutes] = useState(5);
  const [phase, setPhase] = useState<PhaseKey>("inhale");
  const [remainingMs, setRemainingMs] = useState<number>(active.inhale * 1000);
  const [sessionRemainingMs, setSessionRemainingMs] = useState<number | null>(
    repeatMinutes > 0 ? repeatMinutes * 60 * 1000 : null
  );
  const [isRunning, setIsRunning] = useState(false);

  const favoriteSet = useMemo(() => new Set(favorites), [favorites]);
  const hiddenSet = useMemo(() => new Set(hiddenPresets), [hiddenPresets]);
  const presets = useMemo(() => {
    const withFavorites = (items: BreathingPreset[]) =>
      items.map((preset) => ({
        ...preset,
        isFavorite: favoriteSet.has(preset.name),
      }));
    const basePresets = BREATHING_PRESETS.filter((preset) => !hiddenSet.has(preset.name));
    return [...withFavorites(basePresets), ...withFavorites(customPresets)];
  }, [customPresets, favoriteSet, hiddenSet]);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isRunningRef = useRef(isRunning);
  const phaseRef = useRef<PhaseKey>(phase);
  const remainingRef = useRef<number>(remainingMs);
  const draftRef = useRef<DurationsSec>(draft);
  const repeatMinutesRef = useRef(repeatMinutes);
  const sessionRemainingRef = useRef<number | null>(repeatMinutes * 60 * 1000);
  const presetsRef = useRef(presets);

  useEffect(() => {
    presetsRef.current = presets;
  }, [presets]);

  useEffect(() => {
    let cancelled = false;
    const loadCustomPresets = async () => {
      try {
        const raw = await SecureStore.getItemAsync(CUSTOM_PRESETS_KEY);
        if (!raw) return;
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) return;
        const nextCustom = parsed
          .map((item) => sanitizeCustomPreset(item))
          .filter((item): item is BreathingPreset => Boolean(item));
        if (!cancelled) {
          setCustomPresets(nextCustom);
        }
      } catch {
        // Ignore storage errors and fall back to base presets.
      } finally {
        if (!cancelled) setCustomPresetsLoaded(true);
      }
    };
    loadCustomPresets();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    const loadFavorites = async () => {
      try {
        const raw = await SecureStore.getItemAsync(FAVORITE_PRESETS_KEY);
        if (!raw) return;
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) return;
        const nextFavorites = parsed.filter((name) => typeof name === "string");
        if (!cancelled) {
          setFavorites(nextFavorites);
        }
      } catch {
        // Ignore storage errors and fall back to no favorites.
      }
    };
    loadFavorites();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    const loadHiddenPresets = async () => {
      try {
        const raw = await SecureStore.getItemAsync(HIDDEN_PRESETS_KEY);
        if (!raw) return;
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) return;
        const nextHidden = parsed.filter((name) => typeof name === "string");
        if (!cancelled) {
          setHiddenPresets(nextHidden);
        }
      } catch {
        // Ignore storage errors and fall back to showing all base presets.
      } finally {
        if (!cancelled) setHiddenPresetsLoaded(true);
      }
    };
    loadHiddenPresets();
    return () => {
      cancelled = true;
    };
  }, []);

  const initialPresetLoadedRef = useRef(false);
  useEffect(() => {
    if (initialPresetLoadedRef.current) return;
    if (!customPresetsLoaded || !hiddenPresetsLoaded) return;
    initialPresetLoadedRef.current = true;
    let cancelled = false;
    const loadLastPreset = async () => {
      try {
        const lastName = await SecureStore.getItemAsync(LAST_PRESET_KEY);
        if (cancelled) return;
        const fallbackPreset = presets[0] ?? BREATHING_PRESETS[0];
        const target = (lastName ? presets.find((preset) => preset.name === lastName) : null) ??
          fallbackPreset;
        if (target) {
          setDraft(target.durations);
          setRepeatMinutes(target.repeatMinutes);
        }
      } catch {
        // Ignore storage errors and fall back to defaults.
      }
    };
    loadLastPreset();
    return () => {
      cancelled = true;
    };
  }, [customPresetsLoaded, hiddenPresetsLoaded, presets]);

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

  useEffect(() => {
    repeatMinutesRef.current = repeatMinutes;
    if (!isRunningRef.current) {
      const nextSession = repeatMinutes > 0 ? repeatMinutes * 60 * 1000 : null;
      sessionRemainingRef.current = nextSession;
      setSessionRemainingMs(nextSession);
    }
  }, [repeatMinutes]);

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
    const nextSession =
      repeatMinutesRef.current > 0 ? repeatMinutesRef.current * 60 * 1000 : null;
    sessionRemainingRef.current = nextSession;
    setSessionRemainingMs(nextSession);
  }, [clearTimer, setPhaseAndRemaining]);

  const start = useCallback(() => {
    if (isRunningRef.current) return;

    const d = draftRef.current;
    setActive(d);
    const nextMs = Math.max(0, d[phaseRef.current] * 1000);
    setRemainingMs(nextMs);
    remainingRef.current = nextMs;
    const nextSession =
      repeatMinutesRef.current > 0 ? repeatMinutesRef.current * 60 * 1000 : null;
    sessionRemainingRef.current = nextSession;
    setSessionRemainingMs(nextSession);

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
      if (sessionRemainingRef.current !== null) {
        const nextSession = sessionRemainingRef.current - TICK_MS;
        sessionRemainingRef.current = nextSession;
        setSessionRemainingMs(nextSession);
        if (nextSession <= 0) {
          setIsRunning(false);
          setRemainingMs(0);
          remainingRef.current = 0;
          return;
        }
      }

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

    const targetMs = Math.max(0, active[phase] * 1000);
    if (remainingMs !== targetMs) {
      setRemainingMs(targetMs);
      remainingRef.current = targetMs;
    }
  }, [active, phase, remainingMs]);

  const setDraftField = useCallback((key: keyof DurationsSec, v: number) => {
    setDraft((prev) => ({ ...prev, [key]: clampSec(v) }));
  }, []);

  const applyPreset = useCallback((name: string) => {
    const preset = presetsRef.current.find((item) => item.name === name);
    if (!preset) return;
    setDraft(preset.durations);
    setRepeatMinutes(preset.repeatMinutes);
    SecureStore.setItemAsync(LAST_PRESET_KEY, name).catch(() => undefined);
  }, []);

  const addPreset = useCallback(
    async (label: string, durations: DurationsSec, nextRepeatMinutes: number) => {
      const normalizedDurations = {
        inhale: clampSec(durations.inhale),
        hold1: clampSec(durations.hold1),
        exhale: clampSec(durations.exhale),
        hold2: clampSec(durations.hold2),
      };
      const normalizedRepeat = clampSec(nextRepeatMinutes);

      setCustomPresets((prev) => {
        const exists = prev.some(
          (preset) =>
            isSameDurations(preset.durations, normalizedDurations) &&
            preset.repeatMinutes === normalizedRepeat
        );
        if (exists) return prev;

        const nextPreset: BreathingPreset = {
          name: `custom_${Date.now()}`,
          label,
          durations: normalizedDurations,
          repeatMinutes: normalizedRepeat,
          isCustom: true,
        };

        const next = [...prev, nextPreset];
        SecureStore.setItemAsync(
          CUSTOM_PRESETS_KEY,
          JSON.stringify(
            next.map(({ name, label: storedLabel, durations: storedDurations, repeatMinutes }) => ({
              name,
              label: storedLabel,
              durations: storedDurations,
              repeatMinutes,
            }))
          )
        ).catch(() => undefined);
        return next;
      });
    },
    []
  );

  const removePreset = useCallback((name: string) => {
    setCustomPresets((prev) => {
      const next = prev.filter((preset) => preset.name !== name);
      if (next.length === prev.length) return prev;
      SecureStore.setItemAsync(
        CUSTOM_PRESETS_KEY,
        JSON.stringify(
          next.map(({ name: storedName, label: storedLabel, durations: storedDurations, repeatMinutes }) => ({
            name: storedName,
            label: storedLabel,
            durations: storedDurations,
            repeatMinutes,
          }))
        )
      ).catch(() => undefined);
      return next;
    });
    setHiddenPresets((prev) => {
      if (prev.includes(name)) return prev;
      const isBasePreset = BREATHING_PRESETS.some((preset) => preset.name === name);
      if (!isBasePreset) return prev;
      const next = [...prev, name];
      SecureStore.setItemAsync(HIDDEN_PRESETS_KEY, JSON.stringify(next)).catch(() => undefined);
      return next;
    });
    setFavorites((prev) => {
      if (!prev.includes(name)) return prev;
      const next = prev.filter((item) => item !== name);
      SecureStore.setItemAsync(FAVORITE_PRESETS_KEY, JSON.stringify(next)).catch(() => undefined);
      return next;
    });
  }, []);

  const toggleFavorite = useCallback((name: string) => {
    setFavorites((prev) => {
      const exists = prev.includes(name);
      const next = exists ? prev.filter((item) => item !== name) : [...prev, name];
      SecureStore.setItemAsync(FAVORITE_PRESETS_KEY, JSON.stringify(next)).catch(() => undefined);
      return next;
    });
  }, []);

  const totalActiveSec = active.inhale + active.hold1 + active.exhale + active.hold2;

  return {
    active,
    draft,
    repeatMinutes,
    phase,
    remainingMs,
    isRunning,
    progress,
    remainingSecDisplay,
    totalActiveSec,
    sessionRemainingMs,
    presets,
    applyPreset,
    addPreset,
    removePreset,
    toggleFavorite,
    setRepeatMinutes,
    toggleRun,
    reset,
    setDraftField,
  };
};
