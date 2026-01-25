import { useAudioPlayer } from "expo-audio";
import * as Haptics from "expo-haptics";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Animated, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import DurationSliderRow from "./components/DurationSliderRow";
import PresetChips from "./components/PresetChips";
import ToggleRow from "./components/ToggleRow";
import { PHASE_LABEL, PHASE_TONE, SLIDER_ITEMS } from "./constants";
import { useBreathingTimer } from "./hooks/useBreathingTimer";
import { styles } from "./styles";
import { isSameDurations } from "./utils";

export default function BreathingScreen() {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const {
    draft,
    phase,
    isRunning,
    progress,
    remainingSecDisplay,
    totalActiveSec,
    presets,
    applyPreset,
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
    return matched ? matched.name : null;
  }, [draft, presets]);

  return (
    <SafeAreaView style={styles.container}>
      <View pointerEvents="none" style={styles.background}>
        <View style={styles.bgOrbOne} />
        <View style={styles.bgOrbTwo} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>BREATHWORK</Text>
          <Text style={styles.title}>Breathing Coach</Text>
          <Text style={styles.subtitle}>Set a rhythm that feels calm and steady.</Text>
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
          <View style={styles.phasePill}>
            <Text style={styles.phaseLabel}>{PHASE_LABEL[phase]}</Text>
          </View>
          <Text style={styles.countdown}>
            {totalActiveSec <= 0 ? "—" : `${remainingSecDisplay}s`}
          </Text>

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
              <Text style={styles.buttonText}>{isRunning ? "Pause" : "Start"}</Text>
            </Pressable>

            <Pressable
              onPress={reset}
              style={({ pressed }) => [styles.button, styles.secondaryButton, pressed && styles.pressed]}
            >
              <Text style={[styles.buttonText, styles.secondaryText]}>Reset</Text>
            </Pressable>
          </View>

          <Text style={styles.note}>
            Slider changes apply at the <Text style={styles.noteBold}>next phase</Text>.
          </Text>
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
            <PresetChips
              presets={presets}
              selectedName={selectedPresetName}
              onSelect={applyPreset}
            />
          </Animated.View>

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
              <Text style={styles.presetTitle}>Preferences</Text>
              <View style={styles.controls}>
                <ToggleRow label="Phase sound" value={soundEnabled} onChange={setSoundEnabled} />
                <ToggleRow
                  label="Vibration"
                  value={vibrationEnabled}
                  onChange={setVibrationEnabled}
                />
              </View>
            </View>
          </Animated.View>

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
          </Animated.View>

          <View style={styles.presetSection}>
            <Text style={styles.presetTitle}>Settings</Text>
            <View style={styles.controls}>
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
                    label={item.label}
                    value={draft[item.key]}
                    onChange={sliderHandlers[item.key]}
                    min={item.min}
                    max={item.max}
                  />
                </Animated.View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
