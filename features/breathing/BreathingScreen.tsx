import { useAudioPlayer } from "expo-audio";
import * as Haptics from "expo-haptics";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Animated, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";

import DurationSliderRow from "./components/DurationSliderRow";
import PresetChips from "./components/PresetChips";
import ToggleRow from "./components/ToggleRow";
import { PHASE_LABEL_KEYS, PHASE_TONE, SLIDER_ITEMS } from "./constants";
import { useBreathingTimer } from "./hooks/useBreathingTimer";
import { styles } from "./styles";
import { formatMinutesSeconds, isSameDurations } from "./utils";

export default function BreathingScreen() {
  const { t } = useTranslation();
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [presetsOpen, setPresetsOpen] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(true);
  const [preferencesOpen, setPreferencesOpen] = useState(true);
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
  } = useBreathingTimer();

  const phaseTonePlayer = useAudioPlayer(PHASE_TONE);

  useEffect(() => {
    phaseTonePlayer.volume = 0.35;
  }, [phaseTonePlayer]);

  const playPhaseTone = React.useCallback(() => {
    if (!soundEnabled) return;
    if (!phaseTonePlayer.isLoaded) return;
    phaseTonePlayer.seekTo(0).catch(() => undefined);
    phaseTonePlayer.play();
    if (vibrationEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy).catch(() => undefined);
    }
  }, [phaseTonePlayer, soundEnabled, vibrationEnabled]);

  const prevPhaseRef = useRef(phase);

  const cardAnim = useRef(new Animated.Value(0)).current;
  const rowAnims = useRef<Animated.Value[]>([]);
  if (rowAnims.current.length === 0) {
    rowAnims.current = Array.from(
      { length: SLIDER_ITEMS.length + 3 },
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

    if (prevPhaseRef.current !== phase) {
      playPhaseTone();
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

  const selectedPresetName = useMemo(() => {
    const matched = presets.find((preset) => isSameDurations(preset.durations, draft));
    if (!matched) return null;
    return matched.repeatMinutes === repeatMinutes ? matched.name : null;
  }, [draft, presets, repeatMinutes]);

  return (
    <SafeAreaView style={styles.container}>
      <View pointerEvents="none" style={styles.background}>
        <View style={styles.bgOrbOne} />
        <View style={styles.bgOrbTwo} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>{t("app.eyebrow")}</Text>
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
            <View style={styles.presetSection}>
              <Pressable
                onPress={() => setPresetsOpen((value) => !value)}
                style={styles.sectionHeader}
              >
                <Text style={styles.presetTitle}>{t("section.presets")}</Text>
                <Text style={styles.sectionToggle}>{presetsOpen ? "v" : ">"}</Text>
              </Pressable>
              {presetsOpen && (
                <PresetChips
                  presets={presets}
                  selectedName={selectedPresetName}
                  onSelect={applyPreset}
                />
              )}
            </View>
          </Animated.View>

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
                    opacity: rowAnims.current[2],
                    transform: [
                      {
                        translateY: rowAnims.current[2].interpolate({
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
                      opacity: rowAnims.current[index + 3],
                      transform: [
                        {
                          translateY: rowAnims.current[index + 3].interpolate({
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

          <Animated.View
            style={{
              opacity: rowAnims.current[1],
              transform: [
                {
                  translateY: rowAnims.current[1].interpolate({
                    inputRange: [0, 1],
                    outputRange: [12, 0],
                  }),
                },
              ],
            }}
          >
            <View style={styles.presetSection}>
              <Pressable
                onPress={() => setPreferencesOpen((value) => !value)}
                style={styles.sectionHeader}
              >
                <Text style={styles.presetTitle}>{t("section.preferences")}</Text>
                <Text style={styles.sectionToggle}>{preferencesOpen ? "v" : ">"}</Text>
              </Pressable>
              {preferencesOpen && (
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
              )}
            </View>
          </Animated.View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
