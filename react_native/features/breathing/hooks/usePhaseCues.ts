import {
  setAudioModeAsync,
  setIsAudioActiveAsync,
  useAudioPlayer,
} from "expo-audio";
import * as Haptics from "expo-haptics";
import { useCallback, useEffect } from "react";
import { Platform, Vibration } from "react-native";

import { PHASE_SOUNDS } from "../lib/constants";
import { PhaseKey } from "../lib/types";

type UsePhaseCuesParams = {
  soundEnabled: boolean;
  vibrationEnabled: boolean;
};

export function usePhaseCues({
  soundEnabled,
  vibrationEnabled,
}: UsePhaseCuesParams) {
  const inhalePlayer = useAudioPlayer(PHASE_SOUNDS.inhale, {
    keepAudioSessionActive: true,
  });
  const holdPlayer = useAudioPlayer(PHASE_SOUNDS.hold1, {
    keepAudioSessionActive: true,
  });
  const hold2Player = useAudioPlayer(PHASE_SOUNDS.hold2, {
    keepAudioSessionActive: true,
  });
  const exhalePlayer = useAudioPlayer(PHASE_SOUNDS.exhale, {
    keepAudioSessionActive: true,
  });

  useEffect(() => {
    setAudioModeAsync({
      playsInSilentMode: true,
      allowsRecording: false,
      shouldPlayInBackground: false,
      shouldRouteThroughEarpiece: false,
      interruptionMode: "doNotMix",
    }).catch(() => undefined);
  }, []);

  useEffect(() => {
    inhalePlayer.volume = 0.8;
    holdPlayer.volume = 0.8;
    hold2Player.volume = 0.8;
    exhalePlayer.volume = 0.8;
  }, [exhalePlayer, holdPlayer, hold2Player, inhalePlayer]);

  const playPhaseTone = useCallback(
    async (phaseKey: PhaseKey) => {
      if (soundEnabled) {
        const entry =
          phaseKey === "inhale"
            ? { player: inhalePlayer, source: PHASE_SOUNDS.inhale }
            : phaseKey === "hold1"
              ? { player: holdPlayer, source: PHASE_SOUNDS.hold1 }
              : phaseKey === "hold2"
                ? { player: hold2Player, source: PHASE_SOUNDS.hold2 }
                : phaseKey === "exhale"
                  ? { player: exhalePlayer, source: PHASE_SOUNDS.exhale }
                  : { player: holdPlayer, source: PHASE_SOUNDS.hold1 };
        const player = entry.player;
        if (!player.isLoaded) {
          try {
            player.replace?.(entry.source);
          } catch {
            // Ignore replace errors and try to play anyway.
          }
        }
        await setIsAudioActiveAsync(true).catch(() => undefined);
        if (Platform.OS === "android") {
          await new Promise((resolve) => setTimeout(resolve, 40));
        }
        if ("seekTo" in player) {
          await (player as { seekTo?: (t: number) => Promise<void> })
            .seekTo?.(0)
            .catch(() => undefined);
        }
        player.play();
      }

      if (vibrationEnabled) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy).catch(
          () => undefined,
        );
        if (Platform.OS === "android") {
          Vibration.vibrate([0, 100, 100, 100]);
        }
      }
    },
    [
      exhalePlayer,
      hold2Player,
      holdPlayer,
      inhalePlayer,
      soundEnabled,
      vibrationEnabled,
    ],
  );

  const stopPhaseTones = useCallback(() => {
    const stopPlayer = (player: typeof inhalePlayer) => {
      if (!player.isLoaded) return;
      const controllable = player as {
        stop?: () => void;
        pause?: () => void;
        seekTo?: (t: number) => Promise<void>;
      };
      try {
        controllable.stop?.();
      } catch {
        // Ignore unsupported stop implementations.
      }
      try {
        controllable.pause?.();
      } catch {
        // Ignore unsupported pause implementations.
      }
      controllable.seekTo?.(0).catch(() => undefined);
    };

    stopPlayer(inhalePlayer);
    stopPlayer(holdPlayer);
    stopPlayer(hold2Player);
    stopPlayer(exhalePlayer);
  }, [exhalePlayer, hold2Player, holdPlayer, inhalePlayer]);

  return {
    playPhaseTone,
    stopPhaseTones,
  };
}
