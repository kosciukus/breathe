import React from "react";
import { Pressable, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { BreathingPreset } from "../types";
import { styles } from "../styles";

type PresetChipsProps = {
  presets: BreathingPreset[];
  selectedName: string | null;
  onSelect: (name: string) => void;
};

const PresetChips = ({ presets, selectedName, onSelect }: PresetChipsProps) => {
  const { t } = useTranslation();
  return (
    <View style={styles.presetSection}>
      <Text style={styles.presetTitle}>{t("section.presets")}</Text>
      <View style={styles.presetGrid}>
        {presets.map((preset) => {
          const isSelected = preset.name === selectedName;
          return (
            <Pressable
              key={preset.name}
              onPress={() => onSelect(preset.name)}
              style={({ pressed }) => [
                styles.presetChip,
                isSelected && styles.presetChipSelected,
                pressed && styles.pressed,
              ]}
            >
              <Text style={[styles.presetChipText, isSelected && styles.presetChipTextSelected]}>
                {t(preset.labelKey)}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

export default React.memo(PresetChips);
