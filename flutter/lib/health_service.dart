import 'dart:io';
import 'package:health/health.dart';

// Injected in tests to capture write calls without requiring a real Health
// platform. When provided, initialize() auto-authorizes.
typedef HealthDataWriter = Future<bool> Function(
  double value,
  DateTime startTime,
  DateTime endTime,
);

/// Logs completed breathing sessions to Apple Health (iOS) or
/// Health Connect (Android) as mindfulness minutes.
/// All methods are no-ops when the platform is unsupported or
/// permission has been denied.
class HealthService {
  bool _authorized = false;
  final HealthDataWriter? _writerOverride;
  // health v12+ removed the singleton — must reuse one instance across all calls.
  final _health = Health();

  HealthService({HealthDataWriter? writerOverride})
      : _writerOverride = writerOverride;

  /// Call once during controller initialization.
  /// Requests the single permission needed. A denial is silently
  /// absorbed — the app works normally without health logging.
  Future<void> initialize() async {
    if (_writerOverride != null) {
      _authorized = true;
      return;
    }
    if (!Platform.isIOS && !Platform.isAndroid) return;
    try {
      final types = [HealthDataType.MINDFULNESS];
      final permissions = [HealthDataAccess.WRITE];
      _authorized = await _health.requestAuthorization(types, permissions: permissions);
    } catch (_) {
      // Health platform not available or permission flow failed.
    }
  }

  /// Writes one mindfulness record spanning [startTime] to [endTime].
  /// Silently ignored if not authorized or if duration is invalid.
  Future<void> logMindfulnessSession({
    required DateTime startTime,
    required DateTime endTime,
  }) async {
    if (!_authorized) return;
    if (!endTime.isAfter(startTime)) return;
    try {
      final writer = _writerOverride;
      if (writer != null) {
        await writer(0, startTime, endTime);
        return;
      }
      // MINDFULNESS is an HKCategorySample on iOS. The value must be 0
      // (HKCategoryValue.notApplicable). Duration is encoded in startTime/endTime.
      await _health.writeHealthData(
        value: 0,
        type: HealthDataType.MINDFULNESS,
        startTime: startTime,
        endTime: endTime,
      );
    } catch (_) {
      // Ignore write failures — health logging is best-effort.
    }
  }
}
