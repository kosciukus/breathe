import { PhaseKey, SliderItem } from "./types";

export const PHASE_LABEL: Record<PhaseKey, string> = {
  inhale: "INHALE",
  hold1: "HOLD",
  exhale: "EXHALE",
  hold2: "HOLD",
};

export const PHASE_ORDER: PhaseKey[] = ["inhale", "hold1", "exhale", "hold2"];

export const TICK_MS = 100;

export const SLIDER_ITEMS: SliderItem[] = [
  { key: "inhale", label: "Inhale", min: 0, max: 20 },
  { key: "hold1", label: "Pause after inhale", min: 0, max: 20 },
  { key: "exhale", label: "Exhale", min: 0, max: 20 },
  { key: "hold2", label: "Pause after exhale", min: 0, max: 20 },
];

export const PHASE_TONE = require("../../assets/sounds/phase-tone.wav");
