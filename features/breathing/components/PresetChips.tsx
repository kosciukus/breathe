import React from "react";
import { Pressable, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { BreathingPreset } from "../lib/types";
import { styles } from "../lib/styles";

type PresetChipsProps = {
  presets: BreathingPreset[];
  selectedName: string | null;
  onSelect: (name: string) => void;
  onLongPress?: (preset: BreathingPreset) => void;
};

const PresetChips = ({ presets, selectedName, onSelect, onLongPress }: PresetChipsProps) => {
  const { t } = useTranslation();
  return (
    <View style={styles.presetGrid}>
      {presets.map((preset) => {
        const isSelected = preset.name === selectedName;
        const label = preset.label ?? (preset.labelKey ? t(preset.labelKey) : preset.name);
        return (
          <Pressable
            key={preset.name}
            onPress={() => onSelect(preset.name)}
            onLongPress={onLongPress ? () => onLongPress(preset) : undefined}
            style={({ pressed }) => [
              styles.presetChip,
              isSelected && styles.presetChipSelected,
              pressed && styles.pressed,
            ]}
          >
            <Text style={[styles.presetChipText, isSelected && styles.presetChipTextSelected]}>
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

export default React.memo(PresetChips);
