import { useMemo } from "react";

import { useBreathing } from "../context/BreathingContext";
import {
  createBreathingStyles,
  DARK_COLORS,
  LIGHT_COLORS,
} from "../lib/styles";

export function useBreathingTheme() {
  const { darkModeEnabled } = useBreathing();
  const colors = darkModeEnabled ? DARK_COLORS : LIGHT_COLORS;
  const styles = useMemo(() => createBreathingStyles(colors), [colors]);

  return { colors, styles };
}
