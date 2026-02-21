import { useIsFocused } from "@react-navigation/native";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Animated, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import LanguagePanel from "../components/LanguagePanel";
import PreferencesPanel from "../components/PreferencesPanel";
import PresetsPanel from "../components/PresetsPanel";
import { useBreathing } from "../context/BreathingContext";
import { usePhaseCues } from "../hooks/usePhaseCues";
import { useBreathingTheme } from "../hooks/useBreathingTheme";
import { SLIDER_ITEMS } from "../lib/constants";
import { isSamePresetConfig } from "../lib/utils";
import BreathingSessionCard from "./components/BreathingSessionCard";
import BreathingSliders from "./components/BreathingSliders";
import FavoritePresetBar from "./components/FavoritePresetBar";
import SheetModal from "./components/SheetModal";

export default function BreathingScreen() {
  const { t } = useTranslation();
  const { styles } = useBreathingTheme();
  const {
    draft,
    phase,
    isRunning,
    isPreparing,
    preStartRemainingSec,
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
  const { playPhaseTone, stopPhaseTones } = usePhaseCues({
    soundEnabled,
    vibrationEnabled,
  });

  const cardAnim = useRef(new Animated.Value(0)).current;
  const rowAnims = useRef<Animated.Value[]>([]);
  if (rowAnims.current.length === 0) {
    rowAnims.current = Array.from(
      { length: SLIDER_ITEMS.length + 1 },
      () => new Animated.Value(0),
    );
  }

  useEffect(() => {
    const rowAnimations = rowAnims.current.map((anim) =>
      Animated.timing(anim, {
        toValue: 1,
        duration: 520,
        useNativeDriver: true,
      }),
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
    if (!isRunning || isPreparing) return;
    void playPhaseTone(phase);
  }, [isPreparing, isRunning, phase, playPhaseTone]);

  useEffect(() => {
    if (!isFocused && (presetsOpen || preferencesOpen || languageOpen)) {
      setPresetsOpen(false);
      setPreferencesOpen(false);
      setLanguageOpen(false);
    }
  }, [
    isFocused,
    presetsOpen,
    preferencesOpen,
    languageOpen,
    setPresetsOpen,
    setPreferencesOpen,
    setLanguageOpen,
  ]);

  const formatPresetLabel = useCallback(
    (durations: typeof draft, minutes: number) =>
      `${t("label.customPreset")} ${durations.inhale}-${durations.hold1}-${durations.exhale}-${durations.hold2} (${minutes}${t("unit.minuteShort")})`,
    [t],
  );

  const matchedPreset = useMemo(() => {
    return (
      presets.find(
        (preset) =>
          isSamePresetConfig(preset, draft, repeatMinutes),
      ) ?? null
    );
  }, [draft, presets, repeatMinutes]);
  const favoritePresets = useMemo(
    () => presets.filter((preset) => preset.isFavorite),
    [presets],
  );
  const isCurrentFavorite = Boolean(matchedPreset?.isFavorite);

  const handleSaveOrRemovePreset = useCallback(
    async (presetToRemove: typeof matchedPreset) => {
      if (presetToRemove) {
        removePreset(presetToRemove.name);
        return;
      }

      await addPreset(
        formatPresetLabel(draft, repeatMinutes),
        draft,
        repeatMinutes,
      );
    },
    [addPreset, draft, formatPresetLabel, removePreset, repeatMinutes],
  );

  const handleToggleFavorite = useCallback(async () => {
    if (matchedPreset) {
      toggleFavorite(matchedPreset.name);
      return;
    }

    await addPreset(formatPresetLabel(draft, repeatMinutes), draft, repeatMinutes, {
      favorite: true,
    });
  }, [
    addPreset,
    draft,
    formatPresetLabel,
    matchedPreset,
    repeatMinutes,
    toggleFavorite,
  ]);

  const handleResetOrStart = useCallback(() => {
    if (isRunning) {
      stopPhaseTones();
      reset();
      return;
    }
    toggleRun();
  }, [isRunning, reset, stopPhaseTones, toggleRun]);

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

        <FavoritePresetBar
          favorites={favoritePresets}
          selectedPresetName={matchedPreset?.name ?? null}
          onSelectPreset={applyPreset}
        />

        <BreathingSessionCard
          cardAnim={cardAnim}
          matchedPreset={matchedPreset}
          isFavorite={isCurrentFavorite}
          sessionRemainingMs={sessionRemainingMs}
          isPreparing={isPreparing}
          preStartRemainingSec={preStartRemainingSec}
          phase={phase}
          progress={progress}
          isRunning={isRunning}
          totalActiveSec={totalActiveSec}
          onToggleFavorite={handleToggleFavorite}
          onSaveOrRemovePreset={handleSaveOrRemovePreset}
          onResetOrStart={handleResetOrStart}
        />

        <BreathingSliders
          rowAnims={rowAnims.current}
          sliderItems={SLIDER_ITEMS}
          draft={draft}
          repeatMinutes={repeatMinutes}
          onSetRepeatMinutes={setRepeatMinutes}
          onSetDraftField={setDraftField}
        />
      </ScrollView>

      <SheetModal visible={presetsOpen} onClose={() => setPresetsOpen(false)}>
        <PresetsPanel onClose={() => setPresetsOpen(false)} />
      </SheetModal>

      <SheetModal
        visible={preferencesOpen}
        onClose={() => setPreferencesOpen(false)}
      >
        <PreferencesPanel onClose={() => setPreferencesOpen(false)} />
      </SheetModal>

      <SheetModal visible={languageOpen} onClose={() => setLanguageOpen(false)}>
        <LanguagePanel onClose={() => setLanguageOpen(false)} />
      </SheetModal>
    </SafeAreaView>
  );
}
