import { PhaseKey } from "./types";

export const triggerPhaseCue = ({
  isRunning,
  isPreparing,
  phase,
  playPhaseTone,
}: {
  isRunning: boolean;
  isPreparing: boolean;
  phase: PhaseKey;
  playPhaseTone: (phase: PhaseKey) => Promise<void>;
}) => {
  if (!isRunning || isPreparing) return;
  void playPhaseTone(phase);
};
