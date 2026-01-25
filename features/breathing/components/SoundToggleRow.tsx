import React from "react";
import { Switch, Text, View } from "react-native";
import { COLORS, styles } from "../styles";

type SoundToggleRowProps = {
  value: boolean;
  onChange: (next: boolean) => void;
};

const SoundToggleRow = ({ value, onChange }: SoundToggleRowProps) => {
  return (
    <View style={styles.row}>
      <View style={styles.toggleRow}>
        <Text style={styles.rowLabel}>Phase sound</Text>
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

export default React.memo(SoundToggleRow);
