import 'models.dart';

sealed class CycleTransitionResult {
  const CycleTransitionResult();
}

final class StopCycleTransition extends CycleTransitionResult {
  const StopCycleTransition();
}

final class ContinueCycleTransition extends CycleTransitionResult {
  const ContinueCycleTransition({
    required this.phase,
    required this.remainingMs,
  });

  final BreathingPhase phase;
  final int remainingMs;
}

BreathingPhase? firstActivePhase(PhaseDurations durations) {
  for (final candidate in BreathingPhase.values) {
    if (durations.durationFor(candidate) > 0) {
      return candidate;
    }
  }
  return null;
}

CycleTransitionResult resolveCycleTransition({
  required BreathingPhase currentPhase,
  required PhaseDurations durations,
  required int spillMs,
  required bool stopAfterCycle,
}) {
  final cycleMs = (durations.totalSeconds * 1000).round();
  if (cycleMs <= 0) {
    return const StopCycleTransition();
  }

  final nextCycleStart = firstActivePhase(durations);
  if (nextCycleStart == null) {
    return const StopCycleTransition();
  }

  var nextSpillMs = spillMs < 0 ? 0 : spillMs;
  if (!stopAfterCycle && nextSpillMs >= cycleMs) {
    nextSpillMs %= cycleMs;
  }

  var cursor = currentPhase;
  for (var index = 0; index < BreathingPhase.values.length + 1; index++) {
    cursor = cursor.next;
    final phaseDurationMs = (durations.durationFor(cursor) * 1000).round();
    if (phaseDurationMs <= 0) {
      continue;
    }

    if (stopAfterCycle && cursor == nextCycleStart) {
      return const StopCycleTransition();
    }

    if (nextSpillMs < phaseDurationMs) {
      return ContinueCycleTransition(
        phase: cursor,
        remainingMs: phaseDurationMs - nextSpillMs,
      );
    }

    nextSpillMs -= phaseDurationMs;
  }

  return const StopCycleTransition();
}
