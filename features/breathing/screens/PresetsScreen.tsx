import React, { useMemo } from "react";
import { Alert, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";

import PresetChips from "../components/PresetChips";
import { useBreathing } from "../context/BreathingContext";
import { styles } from "../lib/styles";
import { isSameDurations } from "../lib/utils";

export default function PresetsScreen() {
  const { t } = useTranslation();
  const { presets, applyPreset, removePreset, draft, repeatMinutes } = useBreathing();

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
            onLongPress={(preset) => {
              if (!preset.isCustom) return;
              const label =
                preset.label ?? (preset.labelKey ? t(preset.labelKey) : preset.name);
              Alert.alert(
                t("action.deletePresetTitle"),
                t("action.deletePresetMessage", { name: label }),
                [
                  { text: t("action.cancel"), style: "cancel" },
                  {
                    text: t("action.delete"),
                    style: "destructive",
                    onPress: () => removePreset(preset.name),
                  },
                ]
              );
            }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
