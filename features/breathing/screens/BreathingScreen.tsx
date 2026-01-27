import { useAudioPlayer } from "expo-audio";
import * as Haptics from "expo-haptics";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Animated, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import DurationSliderRow from "../components/DurationSliderRow";
import { PHASE_LABEL_KEYS, PHASE_SOUNDS, SLIDER_ITEMS } from "../lib/constants";
import { useBreathing } from "../context/BreathingContext";
import { styles } from "../lib/styles";
import { formatMinutesSeconds } from "../lib/utils";

export default function BreathingScreen() {
  const { t } = useTranslation();
  const [settingsOpen, setSettingsOpen] = useState(true);
  const {
    draft,
    phase,
    isRunning,
    progress,
    totalActiveSec,
    repeatMinutes,
    sessionRemainingMs,
    setRepeatMinutes,
    toggleRun,
    reset,
    setDraftField,
    soundEnabled,
    vibrationEnabled,
  } = useBreathing();

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

  const sliderHandlers = useMemo(
    () => ({
      inhale: (v: number) => setDraftField("inhale", v),
      hold1: (v: number) => setDraftField("hold1", v),
      exhale: (v: number) => setDraftField("exhale", v),
      hold2: (v: number) => setDraftField("hold2", v),
    }),
    [setDraftField]
  );

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <View pointerEvents="none" style={styles.background}>
        <View style={styles.bgOrbOne} />
        <View style={styles.bgOrbTwo} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>{t("app.title")}</Text>
          <Text style={styles.subtitle}>{t("app.subtitle")}</Text>
        </View>

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
          <Text style={styles.remainingLabel}>{t("label.remaining")}</Text>
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
              onPress={toggleRun}
              style={({ pressed }) => [
                styles.button,
                styles.primaryButton,
                pressed && styles.pressed,
                totalActiveSec <= 0 && styles.disabled,
              ]}
              disabled={totalActiveSec <= 0}
            >
              <Text style={styles.buttonText}>
                {isRunning ? t("action.pause") : t("action.start")}
              </Text>
            </Pressable>

            <Pressable
              onPress={reset}
              style={({ pressed }) => [styles.button, styles.secondaryButton, pressed && styles.pressed]}
            >
              <Text style={[styles.buttonText, styles.secondaryText]}>{t("action.reset")}</Text>
            </Pressable>
          </View>
          
        </Animated.View>

        <View style={styles.controls}>
          <View style={styles.presetSection}>
            <Pressable
              onPress={() => setSettingsOpen((value) => !value)}
              style={styles.sectionHeader}
            >
              <Text style={styles.presetTitle}>{t("section.settings")}</Text>
              <Text style={styles.sectionToggle}>{settingsOpen ? "v" : ">"}</Text>
            </Pressable>
            {settingsOpen && (
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
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
