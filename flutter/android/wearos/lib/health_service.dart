import 'dart:io';
import 'package:health/health.dart';

/// Logs completed breathing sessions to Health Connect as mindfulness minutes.
/// All methods are no-ops when permission has been denied or unavailable.
class HealthService {
  bool _authorized = false;
  // health v12+ removed the singleton — must reuse one instance across all calls.
  final _health = Health();

  Future<void> initialize() async {
    if (!Platform.isAndroid) return;
    try {
      final types = [HealthDataType.MINDFULNESS];
      final permissions = [HealthDataAccess.WRITE];
      _authorized = await _health.requestAuthorization(types, permissions: permissions);
    } catch (_) {
      // Health Connect not available or permission flow failed.
    }
  }

  Future<void> logMindfulnessSession({
    required DateTime startTime,
    required DateTime endTime,
  }) async {
    if (!_authorized) return;
    if (!endTime.isAfter(startTime)) return;
    try {
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
