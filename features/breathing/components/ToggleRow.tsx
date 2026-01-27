import React from "react";
import { Switch, Text, View } from "react-native";
import { COLORS, styles } from "../lib/styles";

type ToggleRowProps = {
  label: string;
  value: boolean;
  onChange: (next: boolean) => void;
};

const ToggleRow = ({ label, value, onChange }: ToggleRowProps) => {
  return (
    <View style={styles.row}>
      <View style={styles.toggleRow}>
        <Text style={styles.rowLabel}>{label}</Text>
        <Switch
          value={value}
          onValueChange={onChange}
          trackColor={{ false: COLORS.track, true: COLORS.accentSoft }}
          thumbColor={value ? COLORS.accent : "#F4F1EB"}
        />
      </View>
    </View>
  );
};

export default React.memo(ToggleRow);
