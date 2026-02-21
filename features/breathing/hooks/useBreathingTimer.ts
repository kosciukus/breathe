import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { PHASE_ORDER, TICK_MS } from "../lib/constants";
import { BREATHING_PRESETS } from "../data/presets";
import { BreathingPreset, DurationsSec, PhaseKey } from "../lib/types";
import { clampSec, isSamePresetConfig, nextPhase } from "../lib/utils";

export type BreathingTimerState = {
  active: DurationsSec;
  draft: DurationsSec;
  repeatMinutes: number;
  phase: PhaseKey;
  remainingMs: number;
  isPreparing: boolean;
  preStartRemainingSec: number | null;
  sessionRemainingMs: number | null;
  isRunning: boolean;
  progress: number;
  remainingSecDisplay: number;
  totalActiveSec: number;
  presets: BreathingPreset[];
  applyPreset: (name: string) => void;
  addPreset: (
    label: string,
    durations: DurationsSec,
    repeatMinutes: number,
    options?: { favorite?: boolean },
  ) => Promise<void>;
  removePreset: (name: string) => void;
  toggleFavorite: (name: string) => void;
  setRepeatMinutes: (next: number) => void;
  toggleRun: () => void;
  reset: () => void;
  resetAppDataState: () => void;
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

const MIN_TICK_MS = 16;
const PRE_START_COUNTDOWN_SEC = 3;
const DEFAULT_DRAFT: DurationsSec = {
  inhale: 4,
  hold1: 0,
  exhale: 6,
  hold2: 0,
};
const DEFAULT_REPEAT_MINUTES = 5;

const nowMs = () => {
  const perf = globalThis.performance;
  if (perf && typeof perf.now === "function") {
    return perf.now();
  }
  return Date.now();
};

export const useBreathingTimer = (): BreathingTimerState => {
  const [customPresets, setCustomPresets] = useState<BreathingPreset[]>([]);
  const [customPresetsLoaded, setCustomPresetsLoaded] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [hiddenPresets, setHiddenPresets] = useState<string[]>([]);
  const [hiddenPresetsLoaded, setHiddenPresetsLoaded] = useState(false);
  const [draft, setDraft] = useState<DurationsSec>(DEFAULT_DRAFT);
  const [active, setActive] = useState<DurationsSec>(draft);
  const [repeatMinutes, setRepeatMinutes] = useState(DEFAULT_REPEAT_MINUTES);
  const [phase, setPhase] = useState<PhaseKey>("inhale");
  const [remainingMs, setRemainingMs] = useState<number>(active.inhale * 1000);
  const [preStartRemainingMs, setPreStartRemainingMs] = useState<number | null>(
    null,
  );
  const [sessionRemainingMs, setSessionRemainingMs] = useState<number | null>(
    repeatMinutes > 0 ? repeatMinutes * 60 * 1000 : null,
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
    const basePresets = BREATHING_PRESETS.filter(
      (preset) => !hiddenSet.has(preset.name),
    );
    return [...withFavorites(basePresets), ...withFavorites(customPresets)];
  }, [customPresets, favoriteSet, hiddenSet]);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isRunningRef = useRef(isRunning);
  const phaseRef = useRef<PhaseKey>(phase);
  const draftRef = useRef<DurationsSec>(draft);
  const repeatMinutesRef = useRef(repeatMinutes);
  const sessionRemainingRef = useRef<number | null>(repeatMinutes * 60 * 1000);
  const presetsRef = useRef(presets);
  const preStartEndAtRef = useRef<number | null>(null);
  const phaseEndAtRef = useRef<number>(nowMs() + active.inhale * 1000);
  const sessionEndAtRef = useRef<number | null>(
    repeatMinutes > 0 ? nowMs() + repeatMinutes * 60 * 1000 : null,
  );

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
        const target =
          (lastName
            ? presets.find((preset) => preset.name === lastName)
            : null) ?? fallbackPreset;
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
    if (preStartRemainingMs !== null) return 0;
    const total = currentPhaseDurationMs;
    if (total <= 0) return 1;
    const elapsed = total - remainingMs;
    return Math.min(1, Math.max(0, elapsed / total));
  }, [currentPhaseDurationMs, preStartRemainingMs, remainingMs]);

  const remainingSecDisplay = useMemo(() => {
    return Math.ceil(remainingMs / 1000);
  }, [remainingMs]);

  const preStartRemainingSec = useMemo(() => {
    if (preStartRemainingMs === null) return null;
    return Math.max(1, Math.ceil(preStartRemainingMs / 1000));
  }, [preStartRemainingMs]);

  const clearTimer = useCallback(() => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const setPhaseAndRemaining = useCallback(
    (p: PhaseKey, durations: DurationsSec) => {
      setPhase(p);
      setRemainingMs(Math.max(0, durations[p] * 1000));
    },
    [],
  );

  const reset = useCallback(() => {
    clearTimer();
    setIsRunning(false);
    setActive(draftRef.current);
    setPhaseAndRemaining("inhale", draftRef.current);
    const nextSession =
      repeatMinutesRef.current > 0
        ? repeatMinutesRef.current * 60 * 1000
        : null;
    sessionRemainingRef.current = nextSession;
    setSessionRemainingMs(nextSession);
    preStartEndAtRef.current = null;
    setPreStartRemainingMs(null);
    phaseEndAtRef.current = nowMs() + draftRef.current.inhale * 1000;
    sessionEndAtRef.current =
      repeatMinutesRef.current > 0 ? nowMs() + nextSession! : null;
  }, [clearTimer, setPhaseAndRemaining]);

  const resetAppDataState = useCallback(() => {
    clearTimer();
    setIsRunning(false);

    const nextDraft: DurationsSec = { ...DEFAULT_DRAFT };
    const nextRepeatMinutes = DEFAULT_REPEAT_MINUTES;
    const nextSession =
      nextRepeatMinutes > 0 ? nextRepeatMinutes * 60 * 1000 : null;
    const nextInhaleMs = Math.max(0, nextDraft.inhale * 1000);

    setCustomPresets([]);
    setFavorites([]);
    setHiddenPresets([]);
    setDraft(nextDraft);
    setActive(nextDraft);
    setRepeatMinutes(nextRepeatMinutes);
    setPhase("inhale");
    setRemainingMs(nextInhaleMs);
    setPreStartRemainingMs(null);
    setSessionRemainingMs(nextSession);

    isRunningRef.current = false;
    phaseRef.current = "inhale";
    draftRef.current = nextDraft;
    repeatMinutesRef.current = nextRepeatMinutes;
    sessionRemainingRef.current = nextSession;
    preStartEndAtRef.current = null;
    phaseEndAtRef.current = nowMs() + nextInhaleMs;
    sessionEndAtRef.current = nextSession === null ? null : nowMs() + nextSession;
  }, [clearTimer]);

  const start = useCallback(() => {
    if (isRunningRef.current) return;

    const d = draftRef.current;
    const now = nowMs();
    setActive(d);
    const nextMs = Math.max(0, d.inhale * 1000);
    phaseRef.current = "inhale";
    setPhase("inhale");
    setRemainingMs(nextMs);
    phaseEndAtRef.current = now + nextMs;
    const prepMs = PRE_START_COUNTDOWN_SEC * 1000;
    preStartEndAtRef.current = now + prepMs;
    setPreStartRemainingMs(prepMs);
    const nextSession =
      repeatMinutesRef.current > 0
        ? repeatMinutesRef.current * 60 * 1000
        : null;
    sessionRemainingRef.current = nextSession;
    setSessionRemainingMs(nextSession);
    sessionEndAtRef.current = null;

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

    const scheduleNextTick = (phaseRemainingMs?: number) => {
      const remaining =
        phaseRemainingMs ?? Math.max(0, phaseEndAtRef.current - nowMs());
      const nextDelay = Math.min(TICK_MS, Math.max(MIN_TICK_MS, remaining));
      timeoutRef.current = setTimeout(tick, nextDelay);
    };

    const tick = () => {
      const now = nowMs();

      if (preStartEndAtRef.current !== null) {
        const preStartRemaining = Math.max(0, preStartEndAtRef.current - now);
        if (preStartRemaining > 0) {
          setPreStartRemainingMs(preStartRemaining);
          scheduleNextTick(preStartRemaining);
          return;
        }

        preStartEndAtRef.current = null;
        setPreStartRemainingMs(null);

        const startActive = draftRef.current;
        setActive(startActive);
        phaseRef.current = "inhale";
        setPhase("inhale");
        const inhaleMs = Math.max(0, startActive.inhale * 1000);
        setRemainingMs(inhaleMs);
        phaseEndAtRef.current = now + inhaleMs;
        const nextSession =
          repeatMinutesRef.current > 0
            ? repeatMinutesRef.current * 60 * 1000
            : null;
        sessionRemainingRef.current = nextSession;
        setSessionRemainingMs(nextSession);
        sessionEndAtRef.current = nextSession === null ? null : now + nextSession;

        if (inhaleMs > 0) {
          scheduleNextTick(inhaleMs);
          return;
        }
      }

      if (sessionEndAtRef.current !== null) {
        const nextSession = Math.max(0, sessionEndAtRef.current - now);
        sessionRemainingRef.current = nextSession;
        setSessionRemainingMs(nextSession);
        if (nextSession <= 0) {
          setIsRunning(false);
          setRemainingMs(0);
          return;
        }
      }

      const phaseEndAt = phaseEndAtRef.current;
      const phaseRemaining = phaseEndAt - now;

      if (phaseRemaining > 0) {
        setRemainingMs(phaseRemaining);
        scheduleNextTick(phaseRemaining);
        return;
      }

      const nextActive = draftRef.current;
      setActive(nextActive);

      const totalSec =
        nextActive.inhale +
        nextActive.hold1 +
        nextActive.exhale +
        nextActive.hold2;
      if (totalSec <= 0) {
        setIsRunning(false);
        return;
      }

      const cycleMs = totalSec * 1000;
      let spillMs = now - phaseEndAt;
      if (spillMs >= cycleMs) {
        spillMs = spillMs % cycleMs;
      }
      let phaseCursor = phaseRef.current;

      for (let i = 0; i < PHASE_ORDER.length + 1; i++) {
        phaseCursor = nextPhase(phaseCursor);

        let phaseDurationMs = Math.max(0, nextActive[phaseCursor] * 1000);
        if (phaseDurationMs <= 0) continue;

        if (spillMs < phaseDurationMs) {
          const nextRemaining = Math.max(0, phaseDurationMs - spillMs);
          phaseRef.current = phaseCursor;
          setPhase(phaseCursor);
          setRemainingMs(nextRemaining);
          phaseEndAtRef.current = now + nextRemaining;
          scheduleNextTick(nextRemaining);
          return;
        }

        spillMs -= phaseDurationMs;
      }

      // Fallback: if we couldn't find a non-zero phase (should be impossible with totalSec > 0).
      setIsRunning(false);
    };

    tick();

    return () => {
      clearTimer();
    };
  }, [clearTimer, isRunning]);

  useEffect(() => {
    if (isRunningRef.current) return;

    const targetMs = Math.max(0, active[phase] * 1000);
    if (remainingMs !== targetMs) {
      setRemainingMs(targetMs);
      phaseEndAtRef.current = nowMs() + targetMs;
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
    async (
      label: string,
      durations: DurationsSec,
      nextRepeatMinutes: number,
      options?: { favorite?: boolean },
    ) => {
      const normalizedDurations = {
        inhale: clampSec(durations.inhale),
        hold1: clampSec(durations.hold1),
        exhale: clampSec(durations.exhale),
        hold2: clampSec(durations.hold2),
      };
      const normalizedRepeat = clampSec(nextRepeatMinutes);

      setCustomPresets((prev) => {
        const existing = prev.find(
          (preset) =>
            isSamePresetConfig(preset, normalizedDurations, normalizedRepeat),
        );
        if (existing) {
          if (options?.favorite) {
            setFavorites((prevFavorites) => {
              if (prevFavorites.includes(existing.name)) return prevFavorites;
              const nextFavorites = [...prevFavorites, existing.name];
              SecureStore.setItemAsync(
                FAVORITE_PRESETS_KEY,
                JSON.stringify(nextFavorites),
              ).catch(() => undefined);
              return nextFavorites;
            });
          }
          return prev;
        }

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
            next.map(
              ({
                name,
                label: storedLabel,
                durations: storedDurations,
                repeatMinutes,
              }) => ({
                name,
                label: storedLabel,
                durations: storedDurations,
                repeatMinutes,
              }),
            ),
          ),
        ).catch(() => undefined);
        if (options?.favorite) {
          setFavorites((prevFavorites) => {
            if (prevFavorites.includes(nextPreset.name)) return prevFavorites;
            const nextFavorites = [...prevFavorites, nextPreset.name];
            SecureStore.setItemAsync(
              FAVORITE_PRESETS_KEY,
              JSON.stringify(nextFavorites),
            ).catch(() => undefined);
            return nextFavorites;
          });
        }
        return next;
      });
    },
    [],
  );

  const removePreset = useCallback((name: string) => {
    setCustomPresets((prev) => {
      const next = prev.filter((preset) => preset.name !== name);
      if (next.length === prev.length) return prev;
      SecureStore.setItemAsync(
        CUSTOM_PRESETS_KEY,
        JSON.stringify(
          next.map(
            ({
              name: storedName,
              label: storedLabel,
              durations: storedDurations,
              repeatMinutes,
            }) => ({
              name: storedName,
              label: storedLabel,
              durations: storedDurations,
              repeatMinutes,
            }),
          ),
        ),
      ).catch(() => undefined);
      return next;
    });
    setHiddenPresets((prev) => {
      if (prev.includes(name)) return prev;
      const isBasePreset = BREATHING_PRESETS.some(
        (preset) => preset.name === name,
      );
      if (!isBasePreset) return prev;
      const next = [...prev, name];
      SecureStore.setItemAsync(HIDDEN_PRESETS_KEY, JSON.stringify(next)).catch(
        () => undefined,
      );
      return next;
    });
    setFavorites((prev) => {
      if (!prev.includes(name)) return prev;
      const next = prev.filter((item) => item !== name);
      SecureStore.setItemAsync(
        FAVORITE_PRESETS_KEY,
        JSON.stringify(next),
      ).catch(() => undefined);
      return next;
    });
  }, []);

  const toggleFavorite = useCallback((name: string) => {
    setFavorites((prev) => {
      const exists = prev.includes(name);
      const next = exists
        ? prev.filter((item) => item !== name)
        : [...prev, name];
      SecureStore.setItemAsync(
        FAVORITE_PRESETS_KEY,
        JSON.stringify(next),
      ).catch(() => undefined);
      return next;
    });
  }, []);

  const totalActiveSec =
    active.inhale + active.hold1 + active.exhale + active.hold2;

  const isPreparing = preStartRemainingMs !== null;

  return {
    active,
    draft,
    repeatMinutes,
    phase,
    remainingMs,
    isPreparing,
    preStartRemainingSec,
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
    resetAppDataState,
    setDraftField,
  };
};
