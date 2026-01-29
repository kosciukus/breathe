import React from "react";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import * as SecureStore from "expo-secure-store";

import ToggleRow from "./ToggleRow";
import { useBreathing } from "../context/BreathingContext";
import { styles, COLORS } from "../lib/styles";

type PreferencesPanelProps = {
  onClose?: () => void;
};

export default function PreferencesPanel({ onClose }: PreferencesPanelProps) {
  const { t } = useTranslation();
  const { soundEnabled, setSoundEnabled, vibrationEnabled, setVibrationEnabled } = useBreathing();

  const handleResetData = () => {
    Alert.alert(
      t("action.resetDataTitle"),
      t("action.resetDataMessage"),
      [
        { text: t("action.cancel"), style: "cancel" },
        {
          text: t("action.reset"),
          style: "destructive",
          onPress: async () => {
            await Promise.all([
              SecureStore.deleteItemAsync("breathe.language"),
              SecureStore.deleteItemAsync("breathe.presets.custom"),
              SecureStore.deleteItemAsync("breathe.presets.favorites"),
              SecureStore.deleteItemAsync("breathe.presets.last"),
            ]);
            Alert.alert(t("action.resetDataDone"));
          },
        },
      ]
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.sheetScrollContent} showsVerticalScrollIndicator={false}>
      <View style={styles.sheetHeader}>
        <View>
          <Text style={styles.sheetTitle}>{t("section.preferences")}</Text>
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
          <Pressable
            onPress={handleResetData}
            style={({ pressed }) => [styles.button, styles.secondaryButton, pressed && styles.pressed]}
          >
            <Text style={[styles.buttonText, styles.secondaryText]}>{t("action.resetData")}</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}
