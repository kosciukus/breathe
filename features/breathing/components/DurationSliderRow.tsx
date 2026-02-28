import Slider from "@react-native-community/slider";
import React from "react";
import { Platform, Text, View } from "react-native";
import { useBreathingTheme } from "../hooks/useBreathingTheme";
import { clampSec, formatMinutesSeconds } from "../lib/utils";

type DurationSliderRowProps = {
  label: string;
  value: number;
  min?: number;
  max?: number;
  onChange: (v: number) => void;
  onInteractionStart?: () => void;
  onInteractionEnd?: () => void;
  onSlidingStart?: () => void;
  onSlidingComplete?: () => void;
  unitLabel?: string;
};

const DurationSliderRow = ({
  label,
  value,
  onChange,
  onInteractionStart,
  onInteractionEnd,
  onSlidingStart,
  onSlidingComplete,
  min = 0,
  max = 20,
  unitLabel = "s",
}: DurationSliderRowProps) => {
  const { colors, styles } = useBreathingTheme();
  const displayValue =
    value > 60 ? formatMinutesSeconds(value * 1000) : `${value}${unitLabel}`;
  return (
    <View style={styles.row}>
      <View style={styles.rowHeader}>
        <Text style={styles.rowLabel}>{label}</Text>
        <Text style={styles.rowValue}>{displayValue}</Text>
      </View>
      <View
        onTouchStart={onInteractionStart}
        onTouchEnd={onInteractionEnd}
        onTouchCancel={onInteractionEnd}
      >
        <Slider
          style={styles.durationSlider}
          hitSlop={
            Platform.OS === "android"
              ? { top: 12, bottom: 12, left: 10, right: 10 }
              : undefined
          }
          value={value}
          onValueChange={(v) => onChange(clampSec(v))}
          onSlidingStart={() => {
            onInteractionStart?.();
            onSlidingStart?.();
          }}
          onSlidingComplete={() => {
            onSlidingComplete?.();
            onInteractionEnd?.();
          }}
          minimumValue={min}
          maximumValue={max}
          step={1}
          minimumTrackTintColor={
            Platform.OS === "ios" ? colors.accent : colors.accent
          }
          maximumTrackTintColor={colors.track}
          thumbTintColor={Platform.OS === "android" ? colors.accent : undefined}
        />
      </View>
    </View>
  );
};

export default React.memo(DurationSliderRow);
