import 'dart:async';

import 'package:flutter/services.dart';

import 'models.dart';
import 'preset_aliases.dart';

class DeepLinkIntent {
  DeepLinkIntent({required this.presetId, required this.autoStart});

  final String presetId;
  final bool autoStart;
}

class DeepLinkService {
  static const _channel = MethodChannel('it.arcsoftware.breathe/deeplink');

  final StreamController<DeepLinkIntent> _streamController =
      StreamController<DeepLinkIntent>.broadcast();

  Stream<DeepLinkIntent> get intents => _streamController.stream;

  void initialize(List<BreathingPreset> presets) {
    _channel.setMethodCallHandler((call) async {
      if (call.method == 'onDeepLink') {
        final uri = Uri.tryParse(call.arguments as String? ?? '');
        if (uri != null) _handleUri(uri, presets);
      }
    });

    // Check for initial link (cold start).
    _channel.invokeMethod<String>('getInitialLink').then((link) {
      if (link != null) {
        final uri = Uri.tryParse(link);
        if (uri != null) _handleUri(uri, presets);
      }
    });
  }

  void _handleUri(Uri uri, List<BreathingPreset> presets) {
    if (uri.host != 'start') return;

    final presetParam = uri.queryParameters['preset'] ?? '';
    final autoStart = uri.queryParameters['autostart'] != 'false';
    final resolvedId = resolvePresetFromVoice(presetParam, presets);

    if (resolvedId != null) {
      _streamController
          .add(DeepLinkIntent(presetId: resolvedId, autoStart: autoStart));
    }
  }

  void dispose() {
    _streamController.close();
  }
}
