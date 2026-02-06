import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Animated, Pressable, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import { useBreathingTheme } from "../../hooks/useBreathingTheme";
import { PHASE_LABEL_KEYS } from "../../lib/constants";
import { BreathingPreset, PhaseKey } from "../../lib/types";
import { formatMinutesSeconds } from "../../lib/utils";

type BreathingSessionCardProps = {
  cardAnim: Animated.Value;
  matchedPreset: BreathingPreset | null;
  sessionRemainingMs: number | null;
  phase: PhaseKey;
  progress: number;
  isRunning: boolean;
  totalActiveSec: number;
  onToggleFavorite: (name: string) => void;
  onSaveOrRemovePreset: (matchedPreset: BreathingPreset | null) => Promise<void>;
  onResetOrStart: () => void;
};

export default function BreathingSessionCard({
  cardAnim,
  matchedPreset,
  sessionRemainingMs,
  phase,
  progress,
  isRunning,
  totalActiveSec,
  onToggleFavorite,
  onSaveOrRemovePreset,
  onResetOrStart,
}: BreathingSessionCardProps) {
  const { t } = useTranslation();
  const { colors, styles } = useBreathingTheme();

  return (
    <Animated.View
      style={[
        styles.card,
        {
          opacity: cardAnim,
          transform: [
            {
              translateY: cardAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [14, 0],
              }),
            },
          ],
        },
      ]}
    >
      <View style={styles.cardHeaderRow}>
        <Text style={styles.remainingLabel}>{t("label.remaining")}</Text>
        <View style={styles.cardHeaderActions}>
          <Pressable
            onPress={
              matchedPreset ? () => onToggleFavorite(matchedPreset.name) : undefined
            }
            disabled={!matchedPreset}
            style={({ pressed }) => [
              styles.favoriteButton,
              pressed && matchedPreset && styles.pressed,
              !matchedPreset && styles.iconButtonDisabled,
            ]}
            hitSlop={8}
          >
            <Ionicons
              name={matchedPreset?.isFavorite ? "heart" : "heart-outline"}
              size={20}
              color={matchedPreset?.isFavorite ? colors.accent : colors.muted}
            />
          </Pressable>
          <Pressable
            onPress={() => onSaveOrRemovePreset(matchedPreset)}
            style={({ pressed }) => [
              styles.favoriteButton,
              pressed && styles.pressed,
            ]}
            hitSlop={8}
          >
            <Ionicons
              name={matchedPreset ? "trash-outline" : "save-outline"}
              size={20}
              color={colors.accent}
            />
          </Pressable>
        </View>
      </View>

      <Text style={styles.countdown}>
        {sessionRemainingMs === null
          ? "—"
          : formatMinutesSeconds(sessionRemainingMs)}
      </Text>

      <View style={styles.phaseRow}>
        <Text style={styles.phaseCaption}>{t("label.state")}</Text>
        <View style={styles.phasePill}>
          <Text style={styles.phaseLabel}>{t(PHASE_LABEL_KEYS[phase])}</Text>
        </View>
      </View>

      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
      </View>

      <View style={styles.buttonRow}>
        <Pressable
          onPress={onResetOrStart}
          style={({ pressed }) => [
            styles.button,
            styles.primaryButton,
            pressed && styles.pressed,
            totalActiveSec <= 0 && styles.disabled,
          ]}
          disabled={totalActiveSec <= 0}
        >
          <Text style={styles.buttonText}>
            {isRunning ? t("action.reset") : t("action.start")}
          </Text>
        </Pressable>
      </View>
    </Animated.View>
  );
}
