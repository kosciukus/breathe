import { useAudioPlayer } from "expo-audio";
import * as Haptics from "expo-haptics";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";
import { Animated, Modal, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useIsFocused } from "@react-navigation/native";

import DurationSliderRow from "../components/DurationSliderRow";
import LanguagePanel from "../components/LanguagePanel";
import PreferencesPanel from "../components/PreferencesPanel";
import PresetsPanel from "../components/PresetsPanel";
import { useBreathing } from "../context/BreathingContext";
import { PHASE_LABEL_KEYS, PHASE_SOUNDS, SLIDER_ITEMS } from "../lib/constants";
import { COLORS, styles } from "../lib/styles";
import { formatMinutesSeconds, isSameDurations } from "../lib/utils";

export default function BreathingScreen() {
  const { t } = useTranslation();
  const {
    draft,
    phase,
    isRunning,
    progress,
    totalActiveSec,
    repeatMinutes,
    sessionRemainingMs,
    presets,
    applyPreset,
    setRepeatMinutes,
    toggleRun,
    reset,
    setDraftField,
    addPreset,
    removePreset,
    toggleFavorite,
    soundEnabled,
    vibrationEnabled,
    presetsOpen,
    setPresetsOpen,
    preferencesOpen,
    setPreferencesOpen,
    languageOpen,
    setLanguageOpen,
  } = useBreathing();
  const isFocused = useIsFocused();

  const inhalePlayer = useAudioPlayer(PHASE_SOUNDS.inhale);
  const holdPlayer = useAudioPlayer(PHASE_SOUNDS.hold1);
  const exhalePlayer = useAudioPlayer(PHASE_SOUNDS.exhale);

  useEffect(() => {
    inhalePlayer.volume = 0.8;
    holdPlayer.volume = 0.8;
    exhalePlayer.volume = 0.8;
  }, [exhalePlayer, holdPlayer, inhalePlayer]);

  const playPhaseTone = React.useCallback((phaseKey: typeof phase) => {
    if (soundEnabled) {
      const player =
        phaseKey === "inhale"
          ? inhalePlayer
          : phaseKey === "hold1" || phaseKey === "hold2"
          ? holdPlayer
          : phaseKey === "exhale"
          ? exhalePlayer
          : holdPlayer;
      if (player.isLoaded) {
        player.seekTo(0).catch(() => undefined);
        player.play();
      }
    }
    if (vibrationEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy).catch(() => undefined);
    }
  }, [exhalePlayer, holdPlayer, inhalePlayer, soundEnabled, vibrationEnabled]);

  const stopPhaseTones = useCallback(() => {
    const stopPlayer = (player: typeof inhalePlayer) => {
      if (!player.isLoaded) return;
      try {
        player.stop?.();
      } catch {
        // Ignore unsupported stop implementations.
      }
      try {
        player.pause?.();
      } catch {
        // Ignore unsupported pause implementations.
      }
      player.seekTo?.(0).catch(() => undefined);
    };

    stopPlayer(inhalePlayer);
    stopPlayer(holdPlayer);
    stopPlayer(exhalePlayer);
  }, [exhalePlayer, holdPlayer, inhalePlayer]);

  const prevPhaseRef = useRef(phase);

  const cardAnim = useRef(new Animated.Value(0)).current;
  const rowAnims = useRef<Animated.Value[]>([]);
  if (rowAnims.current.length === 0) {
    rowAnims.current = Array.from(
      { length: SLIDER_ITEMS.length + 1 },
      () => new Animated.Value(0)
    );
  }

  useEffect(() => {
    const rowAnimations = rowAnims.current.map((anim) =>
      Animated.timing(anim, {
        toValue: 1,
        duration: 520,
        useNativeDriver: true,
      })
    );

    Animated.parallel([
      Animated.timing(cardAnim, {
        toValue: 1,
        duration: 520,
        useNativeDriver: true,
      }),
      Animated.stagger(70, rowAnimations),
    ]).start();
  }, [cardAnim]);

  useEffect(() => {
    if (!isRunning) {
      prevPhaseRef.current = phase;
      return;
    }

    if (prevPhaseRef.current === phase) {
      playPhaseTone(phase);
    }

    if (prevPhaseRef.current !== phase) {
      playPhaseTone(phase);
      prevPhaseRef.current = phase;
    }
  }, [isRunning, phase, playPhaseTone]);

  useEffect(() => {
    if (!isFocused && (presetsOpen || preferencesOpen || languageOpen)) {
      setPresetsOpen(false);
      setPreferencesOpen(false);
      setLanguageOpen(false);
    }
  }, [isFocused, presetsOpen, preferencesOpen, languageOpen, setPresetsOpen, setPreferencesOpen, setLanguageOpen]);

  const sliderHandlers = useMemo(
    () => ({
      inhale: (v: number) => setDraftField("inhale", v),
      hold1: (v: number) => setDraftField("hold1", v),
      exhale: (v: number) => setDraftField("exhale", v),
      hold2: (v: number) => setDraftField("hold2", v),
    }),
    [setDraftField]
  );


  const formatPresetLabel = useCallback(
    (durations: typeof draft) =>
      `${t("label.customPreset")} ${durations.inhale}-${durations.hold1}-${durations.exhale}-${durations.hold2}`,
    [t]
  );

  const matchedPreset = useMemo(() => {
    const matched = presets.find((preset) => isSameDurations(preset.durations, draft));
    if (!matched) return null;
    return matched.repeatMinutes === repeatMinutes ? matched : null;
  }, [draft, presets, repeatMinutes]);
  const canSavePreset = !matchedPreset;
  const favoritePresets = useMemo(
    () => presets.filter((preset) => preset.isFavorite),
    [presets]
  );

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <View pointerEvents="none" style={styles.background}>
        <View style={styles.bgOrbOne} />
        <View style={styles.bgOrbTwo} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>{t("app.title")}</Text>
          <Text style={styles.subtitle}>{t("app.subtitle")}</Text>
        </View>

        {favoritePresets.length > 0 ? (
          <View style={[styles.presetSection, styles.favoritesSection]}>
            <Text style={styles.presetTitle}>{t("section.favorites")}</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.favoriteBarContent}
            >
              {favoritePresets.map((preset) => {
                const isSelected = preset.name === matchedPreset?.name;
                const label = preset.label ?? (preset.labelKey ? t(preset.labelKey) : preset.name);
                return (
                  <Pressable
                    key={preset.name}
                    onPress={() => applyPreset(preset.name)}
                    style={({ pressed }) => [
                      styles.presetChip,
                      isSelected && styles.presetChipSelected,
                      pressed && styles.pressed,
                    ]}
                  >
                    <Text style={[styles.presetChipText, isSelected && styles.presetChipTextSelected]}>
                      {label}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        ) : null}

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
                onPress={matchedPreset ? () => toggleFavorite(matchedPreset.name) : undefined}
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
                  color={matchedPreset?.isFavorite ? COLORS.accent : COLORS.muted}
                />
              </Pressable>
              <Pressable
                onPress={async () => {
                  if (matchedPreset) {
                    if (matchedPreset.isCustom) {
                      removePreset(matchedPreset.name);
                    }
                    return;
                  }

                  await addPreset(formatPresetLabel(draft), draft, repeatMinutes);
                }}
                style={({ pressed }) => [
                  styles.favoriteButton,
                  pressed && styles.pressed,
                  matchedPreset && !matchedPreset.isCustom && styles.iconButtonDisabled,
                ]}
                disabled={Boolean(matchedPreset && !matchedPreset.isCustom)}
                hitSlop={8}
              >
                <Ionicons
                  name={matchedPreset ? "trash-outline" : "save-outline"}
                  size={20}
                  color={
                    matchedPreset
                      ? matchedPreset.isCustom
                        ? COLORS.accent
                        : COLORS.muted
                      : COLORS.accent
                  }
                />
              </Pressable>
            </View>
          </View>
          <Text style={styles.countdown}>
            {sessionRemainingMs === null ? "—" : formatMinutesSeconds(sessionRemainingMs)}
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
              onPress={() => {
                if (isRunning) {
                  stopPhaseTones();
                  reset();
                } else {
                  toggleRun();
                }
              }}
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

        <View style={styles.controls}>
          <View style={styles.presetSection}>
            <View style={styles.controls}>
              <Animated.View
                style={{
                  opacity: rowAnims.current[0],
                  transform: [
                    {
                      translateY: rowAnims.current[0].interpolate({
                        inputRange: [0, 1],
                        outputRange: [12, 0],
                      }),
                    },
                  ],
                }}
              >
                <DurationSliderRow
                  label={t("label.repeatFor")}
                  value={repeatMinutes}
                  onChange={setRepeatMinutes}
                  min={0}
                  max={30}
                  unitLabel={` ${t("unit.minuteShort")}`}
                />
              </Animated.View>
              {SLIDER_ITEMS.map((item, index) => (
                <Animated.View
                  key={item.key}
                  style={{
                    opacity: rowAnims.current[index + 1],
                    transform: [
                      {
                        translateY: rowAnims.current[index + 1].interpolate({
                          inputRange: [0, 1],
                          outputRange: [12, 0],
                        }),
                      },
                    ],
                  }}
                >
                  <DurationSliderRow
                    label={t(item.labelKey)}
                    value={draft[item.key]}
                    onChange={sliderHandlers[item.key]}
                    min={item.min}
                    max={item.max}
                    unitLabel={` ${t("unit.secondShort")}`}
                  />
                </Animated.View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      <Modal
        animationType="slide"
        transparent
        visible={presetsOpen}
        onRequestClose={() => setPresetsOpen(false)}
      >
        <View style={styles.sheetOverlay}>
          <Pressable style={styles.sheetBackdrop} onPress={() => setPresetsOpen(false)} />
          <View style={styles.sheetContainer}>
            <SafeAreaView style={styles.sheetContent} edges={["bottom"]}>
              <PresetsPanel onClose={() => setPresetsOpen(false)} />
            </SafeAreaView>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent
        visible={preferencesOpen}
        onRequestClose={() => setPreferencesOpen(false)}
      >
        <View style={styles.sheetOverlay}>
          <Pressable style={styles.sheetBackdrop} onPress={() => setPreferencesOpen(false)} />
          <View style={styles.sheetContainer}>
            <SafeAreaView style={styles.sheetContent} edges={["bottom"]}>
              <PreferencesPanel onClose={() => setPreferencesOpen(false)} />
            </SafeAreaView>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent
        visible={languageOpen}
        onRequestClose={() => setLanguageOpen(false)}
      >
        <View style={styles.sheetOverlay}>
          <Pressable style={styles.sheetBackdrop} onPress={() => setLanguageOpen(false)} />
          <View style={styles.sheetContainer}>
            <SafeAreaView style={styles.sheetContent} edges={["bottom"]}>
              <LanguagePanel onClose={() => setLanguageOpen(false)} />
            </SafeAreaView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
