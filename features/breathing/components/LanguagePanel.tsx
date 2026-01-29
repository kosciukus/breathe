import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

import { languageOptions, persistLanguage } from "@/i18n";
import { styles, COLORS } from "../lib/styles";

type LanguagePanelProps = {
  onClose?: () => void;
};

export default function LanguagePanel({ onClose }: LanguagePanelProps) {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.resolvedLanguage ?? i18n.language;

  return (
    <ScrollView contentContainerStyle={styles.sheetScrollContent} showsVerticalScrollIndicator={false}>
      <View style={styles.sheetHeader}>
        <View>
          <Text style={styles.sheetTitle}>{t("language.title")}</Text>
          <Text style={styles.sheetSubtitle}>{t("language.subtitle")}</Text>
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
          {languageOptions.map((option) => {
            const selected = option.code === currentLanguage;
            return (
              <Pressable
                key={option.code}
                onPress={() => {
                  persistLanguage(option.code);
                  i18n.changeLanguage(option.code);
                }}
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
  );
}
