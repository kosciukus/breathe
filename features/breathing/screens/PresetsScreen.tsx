import React, { useMemo } from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";

import PresetChips from "../components/PresetChips";
import { useBreathing } from "../context/BreathingContext";
import { styles } from "../lib/styles";
import { isSameDurations } from "../lib/utils";

export default function PresetsScreen() {
  const { t } = useTranslation();
  const { presets, applyPreset, draft, repeatMinutes } = useBreathing();

  const selectedPresetName = useMemo(() => {
    const matched = presets.find((preset) => isSameDurations(preset.durations, draft));
    if (!matched) return null;
    return matched.repeatMinutes === repeatMinutes ? matched.name : null;
  }, [draft, presets, repeatMinutes]);

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <View pointerEvents="none" style={styles.background}>
        <View style={styles.bgOrbOne} />
        <View style={styles.bgOrbTwo} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>{t("section.presets")}</Text>
          <Text style={styles.subtitle}>{t("app.subtitle")}</Text>
        </View>

        <View style={styles.presetSection}>
          <PresetChips
            presets={presets}
            selectedName={selectedPresetName}
            onSelect={applyPreset}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
