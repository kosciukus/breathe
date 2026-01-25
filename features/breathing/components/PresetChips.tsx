import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { BreathingPreset } from "../types";
import { styles } from "../styles";

type PresetChipsProps = {
  presets: BreathingPreset[];
  selectedName: string | null;
  onSelect: (name: string) => void;
};

const PresetChips = ({ presets, selectedName, onSelect }: PresetChipsProps) => {
  return (
    <View style={styles.presetSection}>
      <Text style={styles.presetTitle}>Presets</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.presetRow}
      >
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
                {preset.name}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default React.memo(PresetChips);
