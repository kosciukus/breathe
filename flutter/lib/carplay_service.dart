import 'dart:io';

import 'package:flutter/services.dart';

import 'car_audio_handler.dart';
import 'controller.dart';
import 'models.dart';

/// Bridges Flutter with the native CarPlay scene delegate via MethodChannel.
/// On Android this is a no-op.
class CarPlayService {
  CarPlayService(this._controller, this._audioHandler);

  static const _channel = MethodChannel('it.arcsoftware.breathe/carplay');
  final BreathingController _controller;
  final BreathingAudioHandler _audioHandler;

  /// Cached preset ids from the last push to CarPlay. Used to avoid resending
  /// the preset list on every controller notification (they fire ~10x/sec
  /// during a session) and only push when the set actually changes.
  List<String> _lastPushedPresetIds = const <String>[];

  /// Flipped to false the first time a MethodChannel call fails with
  /// MissingPluginException — meaning the native CarPlay handler isn't
  /// registered (entitlement not granted, CarPlay scene not active, or the
  /// `carPlayEnabled` gate in AppDelegate.swift is off). After that we stop
  /// pushing updates so controller ticks don't spam unhandled exceptions.
  bool _nativeAvailable = true;

  void initialize() {
    if (!Platform.isIOS) return;

    _channel.setMethodCallHandler(_handleCall);
    _controller.addListener(_onControllerChanged);
  }

  Future<void> _safeInvoke(String method, [dynamic arguments]) async {
    if (!_nativeAvailable) return;
    try {
      await _channel.invokeMethod<void>(method, arguments);
    } on MissingPluginException {
      _nativeAvailable = false;
      _controller.removeListener(_onControllerChanged);
    }
  }

  void _onControllerChanged() {
    _maybePushPresets();
    _pushPlaybackState();
  }

  void _maybePushPresets() {
    final sorted = _sortedForCarPlay(_controller.presets);
    final ids = sorted.map((p) => p.id).toList(growable: false);
    if (_listsEqual(ids, _lastPushedPresetIds)) return;
    _lastPushedPresetIds = ids;
    _safeInvoke('updatePresets', _serializePresets(sorted));
  }

  bool _listsEqual(List<String> a, List<String> b) {
    if (a.length != b.length) return false;
    for (var i = 0; i < a.length; i++) {
      if (a[i] != b[i]) return false;
    }
    return true;
  }

  Future<dynamic> _handleCall(MethodCall call) async {
    switch (call.method) {
      case 'getPresets':
        final sorted = _sortedForCarPlay(_controller.presets);
        _lastPushedPresetIds =
            sorted.map((p) => p.id).toList(growable: false);
        return _serializePresets(sorted);
      case 'startPreset':
        final presetId = call.arguments as String?;
        if (presetId != null) {
          final preset = _controller.presets.firstWhere(
            (p) => p.id == presetId,
            orElse: () => _controller.presets.first,
          );
          await _audioHandler.playMediaItem(
            _audioHandler.presetToMediaItem(preset),
            skipCountdown: true,
          );
        }
        return null;
      case 'stopSession':
        await _audioHandler.stop();
        return null;
      default:
        throw PlatformException(code: 'NOT_IMPLEMENTED');
    }
  }

  void _pushPlaybackState() {
    if (!Platform.isIOS) return;

    final totalMs = _controller.repeatMinutes * 60 * 1000;
    final sessionRemaining = _controller.sessionRemainingMs ?? 0;
    final elapsedMs = totalMs - sessionRemaining;

    _safeInvoke('updatePlaybackState', <String, dynamic>{
      'isRunning': _controller.isRunning,
      'presetId': _controller.selectedPreset?.id,
      'phase': _controller.phase.name,
      'remainingMs': _controller.remainingMs,
      'sessionRemainingMs': _controller.sessionRemainingMs,
      'elapsedSeconds': (elapsedMs / 1000).clamp(0, totalMs / 1000),
      'durationSeconds': totalMs / 1000,
      'presetLabel': _controller.selectedPreset?.label ?? 'Breathing',
    });
  }

  void pushPresets() {
    if (!Platform.isIOS) return;
    final sorted = _sortedForCarPlay(_controller.presets);
    _lastPushedPresetIds = sorted.map((p) => p.id).toList(growable: false);
    _safeInvoke('updatePresets', _serializePresets(sorted));
  }

  /// CarPlay ordering: saved (custom) presets first (newest first by
  /// creation date), then built-in presets in their natural order.
  List<BreathingPreset> _sortedForCarPlay(List<BreathingPreset> presets) {
    final custom = presets.where((p) => p.isCustom).toList()
      ..sort((a, b) => _customCreatedMillis(b).compareTo(
            _customCreatedMillis(a),
          ));
    final builtIn = presets.where((p) => !p.isCustom).toList();
    return <BreathingPreset>[...custom, ...builtIn];
  }

  /// Extracts creation timestamp from a custom preset id of the form
  /// `custom_<millisecondsSinceEpoch>`. Falls back to 0 for any id that
  /// doesn't match the expected shape, pushing it to the bottom.
  int _customCreatedMillis(BreathingPreset preset) {
    const prefix = 'custom_';
    if (!preset.id.startsWith(prefix)) return 0;
    return int.tryParse(preset.id.substring(prefix.length)) ?? 0;
  }

  List<Map<String, dynamic>> _serializePresets(List<BreathingPreset> presets) {
    return presets
        .map((p) => <String, dynamic>{
              'id': p.id,
              'label': p.label,
              'sequence': p.durations.sequence,
              'repeatMinutes': p.repeatMinutes,
            })
        .toList();
  }

  void dispose() {
    _controller.removeListener(_onControllerChanged);
  }
}
