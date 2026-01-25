import Slider from "@react-native-community/slider";
import React from "react";
import { Platform, Text, View } from "react-native";
import { COLORS, styles } from "../styles";
import { clampSec } from "../utils";

type DurationSliderRowProps = {
  label: string;
  value: number;
  min?: number;
  max?: number;
  onChange: (v: number) => void;
};

const DurationSliderRow = ({
  label,
  value,
  onChange,
  min = 0,
  max = 20,
}: DurationSliderRowProps) => {
  return (
    <View style={styles.row}>
      <View style={styles.rowHeader}>
        <Text style={styles.rowLabel}>{label}</Text>
        <Text style={styles.rowValue}>{value}s</Text>
      </View>
      <Slider
        value={value}
        onValueChange={(v) => onChange(clampSec(v))}
        minimumValue={min}
        maximumValue={max}
        step={1}
        minimumTrackTintColor={Platform.OS === "ios" ? COLORS.accent : COLORS.accent}
        maximumTrackTintColor={COLORS.track}
        thumbTintColor={Platform.OS === "android" ? COLORS.accent : undefined}
      />
    </View>
  );
};

export default React.memo(DurationSliderRow);
