export type PhaseKey = "inhale" | "hold1" | "exhale" | "hold2";

export type DurationsSec = {
  inhale: number;
  hold1: number;
  exhale: number;
  hold2: number;
};

export type SliderItem = {
  key: keyof DurationsSec;
  labelKey: string;
  min: number;
  max: number;
};

export type BreathingPreset = {
  name: string;
  labelKey?: string;
  label?: string;
  durations: DurationsSec;
  repeatMinutes: number;
  isCustom?: boolean;
  isFavorite?: boolean;
};
