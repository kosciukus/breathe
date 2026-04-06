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

  void initialize() {
    if (!Platform.isIOS) return;

    _channel.setMethodCallHandler(_handleCall);
    _controller.addListener(_pushPlaybackState);
  }

  Future<dynamic> _handleCall(MethodCall call) async {
    switch (call.method) {
      case 'getPresets':
        return _serializePresets(_controller.presets);
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

    _channel.invokeMethod('updatePlaybackState', <String, dynamic>{
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
    _channel.invokeMethod(
        'updatePresets', _serializePresets(_controller.presets));
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
    _controller.removeListener(_pushPlaybackState);
  }
}
