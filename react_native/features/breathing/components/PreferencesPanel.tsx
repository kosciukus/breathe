import React from "react";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

import ToggleRow from "./ToggleRow";
import { useBreathing } from "../context/BreathingContext";
import { useBreathingTheme } from "../hooks/useBreathingTheme";

type PreferencesPanelProps = {
  onClose?: () => void;
};

export default function PreferencesPanel({ onClose }: PreferencesPanelProps) {
  const { t } = useTranslation();
  const { colors, styles } = useBreathingTheme();
  const {
    soundEnabled,
    setSoundEnabled,
    vibrationEnabled,
    setVibrationEnabled,
    darkModeEnabled,
    setDarkModeEnabled,
    resetAppData,
  } = useBreathing();

  const handleResetData = () => {
    Alert.alert(t("action.resetDataTitle"), t("action.resetDataMessage"), [
      { text: t("action.cancel"), style: "cancel" },
      {
        text: t("action.reset"),
        style: "destructive",
        onPress: async () => {
          await resetAppData();
          Alert.alert(t("action.resetDataDone"));
        },
      },
    ]);
  };

  return (
    <ScrollView
      contentContainerStyle={styles.sheetScrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.sheetHeader}>
        <View>
          <Text style={styles.sheetTitle}>{t("section.preferences")}</Text>
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

      <View style={styles.presetSection}>
        <View style={styles.controls}>
          <ToggleRow
            label={t("label.phaseSound")}
            value={soundEnabled}
            onChange={setSoundEnabled}
          />
          <ToggleRow
            label={t("label.vibration")}
            value={vibrationEnabled}
            onChange={setVibrationEnabled}
          />
          <ToggleRow
            label={t("label.darkMode", { defaultValue: "Dark mode" })}
            value={darkModeEnabled}
            onChange={setDarkModeEnabled}
          />
          <Pressable
            onPress={handleResetData}
            style={({ pressed }) => [
              styles.button,
              styles.secondaryButton,
              pressed && styles.pressed,
            ]}
          >
            <Text style={[styles.buttonText, styles.secondaryText]}>
              {t("action.resetData")}
            </Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}
