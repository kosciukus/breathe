import React from "react";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import * as SecureStore from "expo-secure-store";

import ToggleRow from "../components/ToggleRow";
import { useBreathing } from "../context/BreathingContext";
import { styles } from "../lib/styles";

export default function PreferencesScreen() {
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
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <View pointerEvents="none" style={styles.background}>
        <View style={styles.bgOrbOne} />
        <View style={styles.bgOrbTwo} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>{t("section.preferences")}</Text>
          <Text style={styles.subtitle}>{t("app.subtitle")}</Text>
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
    </SafeAreaView>
  );
}
