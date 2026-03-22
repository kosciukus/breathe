import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:breathe_flutter/deep_link_service.dart';
import 'package:breathe_flutter/presets.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  late DeepLinkService service;
  late List<DeepLinkIntent> received;

  setUp(() {
    service = DeepLinkService();
    received = [];

    // Mock the method channel to return no initial link.
    TestDefaultBinaryMessengerBinding.instance.defaultBinaryMessenger
        .setMockMethodCallHandler(
      const MethodChannel('it.arcsoftware.breathe/deeplink'),
      (call) async {
        if (call.method == 'getInitialLink') return null;
        return null;
      },
    );

    service.initialize(builtInPresets);
    service.intents.listen(received.add);
  });

  tearDown(() {
    service.dispose();
    TestDefaultBinaryMessengerBinding.instance.defaultBinaryMessenger
        .setMockMethodCallHandler(
      const MethodChannel('it.arcsoftware.breathe/deeplink'),
      null,
    );
  });

  Future<void> simulateDeepLink(String url) async {
    // Simulate the native side calling onDeepLink.
    final message = const StandardMethodCodec().encodeMethodCall(
      MethodCall('onDeepLink', url),
    );
    await TestDefaultBinaryMessengerBinding.instance.defaultBinaryMessenger
        .handlePlatformMessage(
      'it.arcsoftware.breathe/deeplink',
      message,
      (ByteData? reply) {},
    );
  }

  group('DeepLinkService', () {
    test('valid URL with preset ID emits correct intent', () async {
      await simulateDeepLink('breathe://start?preset=box_4_4_4_4');
      await Future<void>.delayed(Duration.zero);
      expect(received, hasLength(1));
      expect(received.first.presetId, 'box_4_4_4_4');
      expect(received.first.autoStart, isTrue);
    });

    test('voice alias resolves correctly', () async {
      await simulateDeepLink('breathe://start?preset=box%20breathing');
      await Future<void>.delayed(Duration.zero);
      expect(received, hasLength(1));
      expect(received.first.presetId, 'box_4_4_4_4');
    });

    test('autostart=false is respected', () async {
      await simulateDeepLink(
        'breathe://start?preset=box_4_4_4_4&autostart=false',
      );
      await Future<void>.delayed(Duration.zero);
      expect(received, hasLength(1));
      expect(received.first.autoStart, isFalse);
    });

    test('missing preset parameter emits nothing', () async {
      await simulateDeepLink('breathe://start');
      await Future<void>.delayed(Duration.zero);
      expect(received, isEmpty);
    });

    test('non-start host is ignored', () async {
      await simulateDeepLink('breathe://settings?preset=box_4_4_4_4');
      await Future<void>.delayed(Duration.zero);
      expect(received, isEmpty);
    });

    test('unknown preset emits nothing', () async {
      await simulateDeepLink('breathe://start?preset=nonexistent');
      await Future<void>.delayed(Duration.zero);
      expect(received, isEmpty);
    });
  });
}
