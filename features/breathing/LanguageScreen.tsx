import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";

import { languageOptions } from "@/i18n";
import { styles } from "./styles";

export default function LanguageScreen() {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.resolvedLanguage ?? i18n.language;

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <View pointerEvents="none" style={styles.background}>
        <View style={styles.bgOrbOne} />
        <View style={styles.bgOrbTwo} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>{t("language.title")}</Text>
          <Text style={styles.subtitle}>{t("language.subtitle")}</Text>
        </View>

        <View style={styles.presetSection}>
          <View style={styles.controls}>
            {languageOptions.map((option) => {
              const selected = option.code === currentLanguage;
              return (
                <Pressable
                  key={option.code}
                  onPress={() => i18n.changeLanguage(option.code)}
                  style={({ pressed }) => [
                    styles.row,
                    styles.languageRow,
                    selected && styles.languageRowSelected,
                    pressed && styles.pressed,
                  ]}
                >
                  <View>
                    <Text style={styles.rowLabel}>{option.label}</Text>
                    <Text style={styles.languageHint}>
                      {selected ? t("language.current") : option.code.toUpperCase()}
                    </Text>
                  </View>
                  {selected && <Text style={styles.languageCheck}>✓</Text>}
                </Pressable>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
