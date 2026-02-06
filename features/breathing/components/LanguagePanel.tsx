import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, Text, View } from "react-native";

import { languageOptions, persistLanguage } from "@/i18n";
import { useBreathingTheme } from "../hooks/useBreathingTheme";

type LanguagePanelProps = {
  onClose?: () => void;
};

export default function LanguagePanel({ onClose }: LanguagePanelProps) {
  const { t, i18n } = useTranslation();
  const { colors, styles } = useBreathingTheme();
  const currentLanguage = i18n.resolvedLanguage ?? i18n.language;

  return (
    <ScrollView
      contentContainerStyle={styles.sheetScrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.sheetHeader}>
        <View>
          <Text style={styles.sheetTitle}>{t("language.title")}</Text>
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
                    {selected
                      ? t("language.current")
                      : option.code.toUpperCase()}
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
