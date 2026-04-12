import 'package:audio_service/audio_service.dart';
import 'package:flutter/widgets.dart';

import 'app.dart';
import 'car_audio_handler.dart';
import 'carplay_service.dart';
import 'controller.dart';
import 'home_widget_service.dart';

late final BreathingAudioHandler audioHandler;

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();

  final controller = BreathingController();
  await controller.initialize();

  final homeWidgetService = HomeWidgetService();
  await homeWidgetService.initialize();

  audioHandler = await AudioService.init(
    builder: () => BreathingAudioHandler(controller),
    config: const AudioServiceConfig(
      androidNotificationChannelId: 'it.arcsoftware.breathe.audio',
      androidNotificationChannelName: 'Mindful Breathe',
      androidNotificationIcon: 'mipmap/ic_launcher',
      androidShowNotificationBadge: false,
      androidNotificationOngoing: false,
      androidStopForegroundOnPause: true,
    ),
  );

  final carPlayService = CarPlayService(controller, audioHandler);
  carPlayService.initialize();

  runApp(BreatheApp(controller: controller));
}

