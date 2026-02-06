import React, { useMemo } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

import { useBreathing } from "../context/BreathingContext";
import { useBreathingTheme } from "../hooks/useBreathingTheme";
import { BreathingPreset, BreathingRouteKey } from "../lib/types";
import { isSameDurations } from "../lib/utils";
import PresetChips from "./PresetChips";

type PresetsPanelProps = {
  onClose?: () => void;
};

export default function PresetsPanel({ onClose }: PresetsPanelProps) {
  const { t } = useTranslation();
  const { colors, styles } = useBreathingTheme();
  const { presets, applyPreset, draft, repeatMinutes } = useBreathing();

  const selectedPresetName = useMemo(() => {
    const matched = presets.find((preset) =>
      isSameDurations(preset.durations, draft),
    );
    if (!matched) return null;
    return matched.repeatMinutes === repeatMinutes ? matched.name : null;
  }, [draft, presets, repeatMinutes]);

  const favoritePresets = useMemo(
    () => presets.filter((preset) => preset.isFavorite),
    [presets],
  );
  const otherPresets = useMemo(
    () => presets.filter((preset) => !preset.isFavorite),
    [presets],
  );
  const basePresets = useMemo(
    () => presets.filter((preset) => !preset.isCustom),
    [presets],
  );

  const educationPreset = useMemo(
    () =>
      selectedPresetName
        ? (basePresets.find((preset) => preset.name === selectedPresetName) ??
          null)
        : null,
    [basePresets, selectedPresetName],
  );

  const describePreset = (preset: BreathingPreset | null) => {
    if (!preset) return null;
    const label =
      preset.label ?? (preset.labelKey ? t(preset.labelKey) : preset.name);
    const sequence = [
      preset.durations.inhale,
      preset.durations.hold1,
      preset.durations.exhale,
      preset.durations.hold2,
    ].join("-");
    const baseKey = `presetGuide.${preset.name}`;
    const routeKey: BreathingRouteKey = preset.route ?? "nose";
    return {
      label,
      sequence,
      about: t(`${baseKey}.about`, {
        defaultValue: t("presetGuide.default.about"),
      }),
      bestFor: t(`${baseKey}.bestFor`, {
        defaultValue: t("presetGuide.default.bestFor"),
      }),
      tip: t(`${baseKey}.tip`, { defaultValue: t("presetGuide.default.tip") }),
      route: t(`presetGuide.route.${routeKey}`, {
        defaultValue: t("presetGuide.route.nose"),
      }),
      caution: t(`${baseKey}.caution`, {
        defaultValue: t("presetGuide.default.caution"),
      }),
    };
  };

  const education = describePreset(educationPreset);

  return (
    <ScrollView
      contentContainerStyle={styles.sheetScrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.sheetHeader}>
        <View>
          <Text style={styles.sheetTitle}>{t("section.presets")}</Text>
        </View>
        {onClose ? (
          <Pressable
            onPress={onClose}
            style={({ pressed }) => [
              styles.sheetCloseButton,
              pressed && styles.pressed,
            ]}
            hitSlop={8}
          >
            <Ionicons name="close" size={20} color={colors.muted} />
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

      {education ? (
        <View style={styles.presetSection}>
          <Text style={styles.presetTitle}>{t("section.aboutPreset")}</Text>
          <View style={styles.presetGuideCard}>
            <Text style={styles.presetGuideTitle}>{education.label}</Text>
            <Text style={styles.presetGuideMeta}>
              {t("presetGuide.sequenceLabel")} {education.sequence}
            </Text>
            <Text style={styles.presetGuideBody}>{education.about}</Text>
            <Text style={styles.presetGuideBullet}>
              • {t("presetGuide.bestForLabel")} {education.bestFor}
            </Text>
            <Text style={styles.presetGuideBullet}>
              • {t("presetGuide.tipLabel")} {education.tip}
            </Text>
            <Text style={styles.presetGuideBullet}>
              • {t("presetGuide.routeLabel")} {education.route}
            </Text>
            <Text style={styles.presetGuideCaution}>
              {t("presetGuide.cautionLabel")} {education.caution}
            </Text>
          </View>
        </View>
      ) : null}
    </ScrollView>
  );
}
