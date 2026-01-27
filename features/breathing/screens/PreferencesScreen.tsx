import React from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";

import ToggleRow from "../components/ToggleRow";
import { useBreathing } from "../context/BreathingContext";
import { styles } from "../lib/styles";

export default function PreferencesScreen() {
  const { t } = useTranslation();
  const { soundEnabled, setSoundEnabled, vibrationEnabled, setVibrationEnabled } = useBreathing();

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
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
