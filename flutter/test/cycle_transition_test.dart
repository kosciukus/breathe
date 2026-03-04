import 'package:flutter_test/flutter_test.dart';

import 'package:breathe_flutter/cycle_transition.dart';
import 'package:breathe_flutter/models.dart';

void main() {
  const durations = PhaseDurations(
    inhale: 4,
    holdIn: 2,
    exhale: 6,
    holdOut: 2,
  );
  const equalBreathingDurations = PhaseDurations(
    inhale: 4,
    holdIn: 0,
    exhale: 4,
    holdOut: 0,
  );

  test(
    'continues the rest of the cycle after the session expires during inhale',
    () {
      expect(
        resolveCycleTransition(
          currentPhase: BreathingPhase.inhale,
          durations: durations,
          spillMs: 0,
          stopAfterCycle: true,
        ),
        isA<ContinueCycleTransition>()
            .having((value) => value.phase, 'phase', BreathingPhase.holdIn)
            .having((value) => value.remainingMs, 'remainingMs', 2000),
      );

      expect(
        resolveCycleTransition(
          currentPhase: BreathingPhase.holdIn,
          durations: durations,
          spillMs: 0,
          stopAfterCycle: true,
        ),
        isA<ContinueCycleTransition>()
            .having((value) => value.phase, 'phase', BreathingPhase.exhale)
            .having((value) => value.remainingMs, 'remainingMs', 6000),
      );

      expect(
        resolveCycleTransition(
          currentPhase: BreathingPhase.exhale,
          durations: durations,
          spillMs: 0,
          stopAfterCycle: true,
        ),
        isA<ContinueCycleTransition>()
            .having((value) => value.phase, 'phase', BreathingPhase.holdOut)
            .having((value) => value.remainingMs, 'remainingMs', 2000),
      );

      expect(
        resolveCycleTransition(
          currentPhase: BreathingPhase.holdOut,
          durations: durations,
          spillMs: 0,
          stopAfterCycle: true,
        ),
        isA<StopCycleTransition>(),
      );
    },
  );

  test('stops at the cycle boundary even if the tick overshoots past it', () {
    expect(
      resolveCycleTransition(
        currentPhase: BreathingPhase.exhale,
        durations: durations,
        spillMs: 6500,
        stopAfterCycle: true,
      ),
      isA<StopCycleTransition>(),
    );
  });

  test('transitions to exhale exactly when a 4 second inhale completes', () {
    expect(
      resolveCycleTransition(
        currentPhase: BreathingPhase.inhale,
        durations: equalBreathingDurations,
        spillMs: 0,
        stopAfterCycle: false,
      ),
      isA<ContinueCycleTransition>()
          .having((value) => value.phase, 'phase', BreathingPhase.exhale)
          .having((value) => value.remainingMs, 'remainingMs', 4000),
    );
  });

  test('subtracts overshoot from exhale instead of extending the next phase', () {
    expect(
      resolveCycleTransition(
        currentPhase: BreathingPhase.inhale,
        durations: equalBreathingDurations,
        spillMs: 1500,
        stopAfterCycle: false,
      ),
      isA<ContinueCycleTransition>()
          .having((value) => value.phase, 'phase', BreathingPhase.exhale)
          .having((value) => value.remainingMs, 'remainingMs', 2500),
    );
  });
}
