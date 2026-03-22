import 'dart:async';

import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import 'deep_link_service.dart';
import 'engine.dart';
import 'presets.dart';
import 'screens/preset_list_screen.dart';
import 'screens/session_screen.dart';

void main() {
  runApp(
    ChangeNotifierProvider(
      create: (_) => BreathingEngine(),
      child: const BreatheWearApp(),
    ),
  );
}

class BreatheWearApp extends StatefulWidget {
  const BreatheWearApp({super.key});

  @override
  State<BreatheWearApp> createState() => _BreatheWearAppState();
}

class _BreatheWearAppState extends State<BreatheWearApp> {
  final GlobalKey<NavigatorState> _navigatorKey = GlobalKey<NavigatorState>();
  final DeepLinkService _deepLinkService = DeepLinkService();
  StreamSubscription<DeepLinkIntent>? _deepLinkSub;
  bool _deepLinksInitialized = false;

  @override
  void dispose() {
    _deepLinkSub?.cancel();
    _deepLinkService.dispose();
    super.dispose();
  }

  void _initDeepLinksIfReady(BreathingEngine engine) {
    if (_deepLinksInitialized) return;
    _deepLinksInitialized = true;
    _deepLinkService.initialize(builtInPresets);
    _deepLinkSub = _deepLinkService.intents.listen((intent) {
      _handleDeepLinkIntent(engine, intent);
    });
  }

  void _handleDeepLinkIntent(BreathingEngine engine, DeepLinkIntent intent) {
    final preset = builtInPresets.where((p) => p.id == intent.presetId).firstOrNull;
    if (preset == null) return;

    engine.selectPreset(preset);
    _navigatorKey.currentState?.push(
      MaterialPageRoute(
        builder: (_) => ChangeNotifierProvider.value(
          value: engine,
          child: const SessionScreen(),
        ),
      ),
    );

    if (intent.autoStart && !engine.isRunning) {
      engine.start();
    }
  }

  @override
  Widget build(BuildContext context) {
    final engine = context.read<BreathingEngine>();
    _initDeepLinksIfReady(engine);

    return MaterialApp(
      navigatorKey: _navigatorKey,
      title: 'Breathe',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: const ColorScheme.dark(
          primary: Colors.blue,
          surface: Colors.black,
        ),
        scaffoldBackgroundColor: Colors.black,
      ),
      home: const PresetListScreen(),
    );
  }
}
