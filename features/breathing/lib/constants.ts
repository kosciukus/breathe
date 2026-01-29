import { PhaseKey, SliderItem } from "./types";

export const PHASE_LABEL_KEYS: Record<PhaseKey, string> = {
  inhale: "phase.inhale",
  hold1: "phase.hold",
  exhale: "phase.exhale",
  hold2: "phase.hold",
};

export const PHASE_ORDER: PhaseKey[] = ["inhale", "hold1", "exhale", "hold2"];

export const TICK_MS = 100;

export const SLIDER_ITEMS: SliderItem[] = [
  { key: "inhale", labelKey: "label.inhale", min: 0, max: 20 },
  { key: "hold1", labelKey: "label.hold1", min: 0, max: 300 },
  { key: "exhale", labelKey: "label.exhale", min: 0, max: 20 },
  { key: "hold2", labelKey: "label.hold2", min: 0, max: 300 },
];

export const PHASE_SOUNDS: Record<PhaseKey, number> = {
  inhale: require("../../../assets/sounds/phase-inhale.mp3"),
  hold1: require("../../../assets/sounds/phase-hold.mp3"),
  exhale: require("../../../assets/sounds/phase-exhale.mp3"),
  hold2: require("../../../assets/sounds/phase-hold.mp3"),
};
