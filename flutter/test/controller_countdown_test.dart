import 'dart:async';

import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'package:breathe_flutter/controller.dart';
import 'package:breathe_flutter/models.dart';

void main() {
  test(
    'countdown completes even if phase cue playback hangs',
    () async {
      TestWidgetsFlutterBinding.ensureInitialized();
      SharedPreferences.setMockInitialValues(const <String, Object>{});

      final stalledCue = Completer<void>();
      final controller = BreathingController(
        phaseCueOverride: (_) => stalledCue.future,
      );
      await controller.initialize();
      controller.setPhaseDuration(BreathingPhase.inhale, 8);
      controller.setPhaseDuration(BreathingPhase.holdIn, 0);
      controller.setPhaseDuration(BreathingPhase.exhale, 8);
      controller.setPhaseDuration(BreathingPhase.holdOut, 0);

      await controller.startOrResetSession();
      await Future<void>.delayed(const Duration(seconds: 5));

      expect(controller.isRunning, isTrue);
      expect(controller.isPreparing, isFalse);
      expect(controller.phase, BreathingPhase.inhale);
      expect(controller.remainingMs, greaterThan(0));
      expect(controller.remainingMs, lessThan(8000));

      await controller.reset();
      controller.dispose();
    },
    timeout: const Timeout(Duration(seconds: 12)),
  );
}
