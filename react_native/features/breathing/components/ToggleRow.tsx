import React from "react";
import { Switch, Text, View } from "react-native";
import { useBreathingTheme } from "../hooks/useBreathingTheme";

type ToggleRowProps = {
  label: string;
  value: boolean;
  onChange: (next: boolean) => void;
};

const ToggleRow = ({ label, value, onChange }: ToggleRowProps) => {
  const { colors, styles } = useBreathingTheme();

  return (
    <View style={styles.row}>
      <View style={styles.toggleRow}>
        <Text style={styles.rowLabel}>{label}</Text>
        <Switch
          value={value}
          onValueChange={onChange}
          trackColor={{ false: colors.track, true: colors.accentSoft }}
          thumbColor={value ? colors.accent : colors.soft}
        />
      </View>
    </View>
  );
};

export default React.memo(ToggleRow);
