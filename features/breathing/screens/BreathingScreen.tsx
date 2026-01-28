import { useAudioPlayer } from "expo-audio";
import * as Haptics from "expo-haptics";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Animated, Platform, Pressable, ScrollView, Text, ToastAndroid, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import DurationSliderRow from "../components/DurationSliderRow";
import { useBreathing } from "../context/BreathingContext";
import { PHASE_LABEL_KEYS, PHASE_SOUNDS, SLIDER_ITEMS } from "../lib/constants";
import { styles } from "../lib/styles";
import { formatMinutesSeconds } from "../lib/utils";

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
    setRepeatMinutes,
    toggleRun,
    reset,
    setDraftField,
    addPreset,
    soundEnabled,
    vibrationEnabled,
  } = useBreathing();
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastAnim = useRef(new Animated.Value(0)).current;
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  const showToast = useCallback(
    (message: string) => {
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
        toastTimerRef.current = null;
      }
      toastAnim.stopAnimation();
      toastAnim.setValue(0);
      setToastMessage(message);
      requestAnimationFrame(() => {
        Animated.timing(toastAnim, {
          toValue: 1,
          duration: 180,
          useNativeDriver: true,
        }).start(() => {
          toastTimerRef.current = setTimeout(() => {
            Animated.timing(toastAnim, {
              toValue: 0,
              duration: 220,
              useNativeDriver: true,
            }).start(({ finished }) => {
              if (finished) setToastMessage(null);
            });
          }, 1400);
        });
      });
    },
    [toastAnim]
  );

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  const formatPresetLabel = useCallback(
    (durations: typeof draft) =>
      `${t("label.customPreset")} ${durations.inhale}-${durations.hold1}-${durations.exhale}-${durations.hold2}`,
    [t]
  );

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <View pointerEvents="none" style={styles.background}>
        <View style={styles.bgOrbOne} />
        <View style={styles.bgOrbTwo} />
      </View>
      {toastMessage ? (
        <View pointerEvents="none" style={styles.toastHost}>
          <Animated.View
            style={[
              styles.toast,
              {
                opacity: toastAnim,
                transform: [
                  {
                    translateY: toastAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-8, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <Text style={styles.toastText}>{toastMessage}</Text>
          </Animated.View>
        </View>
      ) : null}

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
          <View style={styles.singleButtonRow}>
            <Pressable
              onPress={async () => {
                await addPreset(
                  formatPresetLabel(draft),
                  draft,
                  repeatMinutes
                );
                const message = t("action.presetSaved");
                if (Platform.OS === "android") {
                  ToastAndroid.show(message, ToastAndroid.SHORT);
                } else {
                  showToast(message);
                }
              }}
              style={({ pressed }) => [styles.button, styles.primaryButton, pressed && styles.pressed]}
            >
              <Text style={styles.buttonText}>{t("action.savePreset")}</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
