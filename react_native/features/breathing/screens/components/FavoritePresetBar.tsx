import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import { BreathingPreset } from "../../lib/types";
import { useBreathingTheme } from "../../hooks/useBreathingTheme";

type FavoritePresetBarProps = {
  favorites: BreathingPreset[];
  selectedPresetName: string | null;
  onSelectPreset: (name: string) => void;
};

export default function FavoritePresetBar({
  favorites,
  selectedPresetName,
  onSelectPreset,
}: FavoritePresetBarProps) {
  const { t } = useTranslation();
  const { styles } = useBreathingTheme();

  if (favorites.length === 0) {
    return null;
  }

  return (
    <View style={[styles.presetSection, styles.favoritesSection]}>
      <Text style={styles.presetTitle}>{t("section.favorites")}</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.favoriteBarContent}
      >
        {favorites.map((preset) => {
          const isSelected = preset.name === selectedPresetName;
          const label =
            preset.label ?? (preset.labelKey ? t(preset.labelKey) : preset.name);
          return (
            <Pressable
              key={preset.name}
              onPress={() => onSelectPreset(preset.name)}
              style={({ pressed }) => [
                styles.presetChip,
                isSelected && styles.presetChipSelected,
                pressed && styles.pressed,
              ]}
            >
              <Text
                style={[
                  styles.presetChipText,
                  isSelected && styles.presetChipTextSelected,
                ]}
              >
                {label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}
