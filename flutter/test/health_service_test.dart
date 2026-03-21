import 'package:flutter_test/flutter_test.dart';

import 'package:breathe_flutter/health_service.dart';

void main() {
  group('HealthService.logMindfulnessSession', () {
    test(
      'passes value 0 (HKCategoryValue.notApplicable) with correct timestamps',
      () async {
        double? capturedValue;
        DateTime? capturedStart;
        DateTime? capturedEnd;

        final service = HealthService(
          writerOverride: (value, start, end) async {
            capturedValue = value;
            capturedStart = start;
            capturedEnd = end;
            return true;
          },
        );
        await service.initialize();

        final start = DateTime(2026, 1, 1, 10, 0, 0);
        final end = DateTime(2026, 1, 1, 10, 6, 0); // 6-minute session

        await service.logMindfulnessSession(startTime: start, endTime: end);

        expect(
          capturedValue,
          equals(0),
          reason:
              'MINDFULNESS is an HKCategorySample; value must be 0 '
              '(HKCategoryValue.notApplicable), not the duration in minutes. '
              'Passing minutes causes HealthKit to reject the write.',
        );
        expect(capturedStart, equals(start));
        expect(capturedEnd, equals(end));
      },
    );

    test('does not write when endTime equals startTime', () async {
      var writeCount = 0;
      final service = HealthService(
        writerOverride: (_, __, ___) async {
          writeCount++;
          return true;
        },
      );
      await service.initialize();

      final t = DateTime(2026, 1, 1, 10, 0, 0);
      await service.logMindfulnessSession(startTime: t, endTime: t);

      expect(writeCount, 0);
    });

    test('does not write when endTime is before startTime', () async {
      var writeCount = 0;
      final service = HealthService(
        writerOverride: (_, __, ___) async {
          writeCount++;
          return true;
        },
      );
      await service.initialize();

      final start = DateTime(2026, 1, 1, 10, 1, 0);
      final end = DateTime(2026, 1, 1, 10, 0, 0);
      await service.logMindfulnessSession(startTime: start, endTime: end);

      expect(writeCount, 0);
    });

    test('does not write when not authorized', () async {
      var writeCount = 0;
      // No writerOverride → _authorized stays false, initialize() is a no-op
      // on non-mobile platforms (test runner).
      final service = HealthService(
        writerOverride: (_, __, ___) async {
          writeCount++;
          return true;
        },
      );
      // Deliberately skip initialize() so _authorized = false.

      final start = DateTime(2026, 1, 1, 10, 0, 0);
      final end = DateTime(2026, 1, 1, 10, 6, 0);
      await service.logMindfulnessSession(startTime: start, endTime: end);

      expect(writeCount, 0);
    });
  });
}
