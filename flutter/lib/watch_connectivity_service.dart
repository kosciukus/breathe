import 'dart:io';

import 'package:flutter_watch_os_connectivity/flutter_watch_os_connectivity.dart';

/// Sends breathing session state to a paired Apple Watch.
/// All methods are no-ops on Android or when the watch is not paired.
class WatchConnectivityService {
  final FlutterWatchOsConnectivity _connectivity = FlutterWatchOsConnectivity();
  bool _configured = false;

  Future<void> initialize() async {
    if (!Platform.isIOS) return;
    try {
      await _connectivity.configureAndActivateSession();
      _configured = true;
    } catch (_) {
      // Watch not available — continue without it.
    }
  }

  Future<void> sendSessionStarted({
    required double inhale,
    required double holdIn,
    required double exhale,
    required double holdOut,
    required int repeatMinutes,
  }) async {
    if (!_configured) return;
    try {
      await _connectivity.updateApplicationContext(<String, dynamic>{
        'action': 'sessionStarted',
        'inhale': inhale,
        'holdIn': holdIn,
        'exhale': exhale,
        'holdOut': holdOut,
        'repeatMinutes': repeatMinutes,
      });
    } catch (_) {}
  }

  Future<void> sendPhaseChanged({
    required String phase,
    required int phaseDurationMs,
    required int sessionRemainingMs,
  }) async {
    if (!_configured) return;
    try {
      await _connectivity.updateApplicationContext(<String, dynamic>{
        'action': 'phaseChanged',
        'phase': phase,
        'phaseDurationMs': phaseDurationMs,
        'sessionRemainingMs': sessionRemainingMs,
      });
    } catch (_) {}
  }

  Future<void> sendSessionStopped() async {
    if (!_configured) return;
    try {
      await _connectivity.updateApplicationContext(<String, dynamic>{
        'action': 'sessionStopped',
      });
    } catch (_) {}
  }
}
