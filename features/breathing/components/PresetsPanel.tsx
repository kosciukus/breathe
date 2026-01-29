import React, { useMemo } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

import { useBreathing } from "../context/BreathingContext";
import { styles, COLORS } from "../lib/styles";
import { isSameDurations } from "../lib/utils";
import PresetChips from "./PresetChips";

type PresetsPanelProps = {
  onClose?: () => void;
};

export default function PresetsPanel({ onClose }: PresetsPanelProps) {
  const { t } = useTranslation();
  const { presets, applyPreset, draft, repeatMinutes } = useBreathing();

  const selectedPresetName = useMemo(() => {
    const matched = presets.find((preset) => isSameDurations(preset.durations, draft));
    if (!matched) return null;
    return matched.repeatMinutes === repeatMinutes ? matched.name : null;
  }, [draft, presets, repeatMinutes]);

  const favoritePresets = useMemo(
    () => presets.filter((preset) => preset.isFavorite),
    [presets]
  );
  const otherPresets = useMemo(
    () => presets.filter((preset) => !preset.isFavorite),
    [presets]
  );

  return (
    <ScrollView contentContainerStyle={styles.sheetScrollContent} showsVerticalScrollIndicator={false}>
      <View style={styles.sheetHeader}>
        <View>
          <Text style={styles.sheetTitle}>{t("section.presets")}</Text>
          <Text style={styles.sheetSubtitle}>{t("app.subtitle")}</Text>
        </View>
        {onClose ? (
          <Pressable
            onPress={onClose}
            style={({ pressed }) => [styles.sheetCloseButton, pressed && styles.pressed]}
            hitSlop={8}
          >
            <Ionicons name="close" size={20} color={COLORS.muted} />
          </Pressable>
        ) : null}
      </View>

      {favoritePresets.length > 0 ? (
        <View style={styles.presetSection}>
          <Text style={styles.presetTitle}>{t("section.favorites")}</Text>
          <PresetChips
            presets={favoritePresets}
            selectedName={selectedPresetName}
            onSelect={applyPreset}
          />
        </View>
      ) : null}
      <View style={styles.presetSection}>
        {favoritePresets.length > 0 ? (
          <Text style={styles.presetTitle}>{t("section.presets")}</Text>
        ) : null}
        <PresetChips
          presets={otherPresets}
          selectedName={selectedPresetName}
          onSelect={applyPreset}
        />
      </View>
    </ScrollView>
  );
}
