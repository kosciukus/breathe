import 'dart:convert';

import 'package:home_widget/home_widget.dart';

import 'presets.dart';

/// Syncs preset data to the native home screen widget via shared storage.
class HomeWidgetService {
  static const String _appGroupId = 'group.it.arcsoftware.breathe';
  static const String _androidWidgetName = 'BreatheWidgetProvider';
  static const String _iOSWidgetName = 'BreatheWidget';

  /// Preset IDs shown in the widget. Small/medium sizes show a subset;
  /// the large widget uses all of them.
  static const List<String> _widgetPresetIds = [
    'box_4_4_4_4',
    'relax_4_7_8',
    'coherent_5_5',
    'equal_4_4',
    'resonant_6_6',
    'pursed_2_4',
    'extended_4_6',
    'extended_4_8',
    'triangle_3_3_3',
    'calm_4_4_6_2',
  ];

  Future<void> initialize() async {
    HomeWidget.setAppGroupId(_appGroupId);
    await _syncPresets();
  }

  Future<void> updateWidget() async {
    await _syncPresets();
  }

  Future<void> _syncPresets() async {
    final widgetPresets = <Map<String, String>>[];

    for (final id in _widgetPresetIds) {
      final preset = builtInPresets.where((p) => p.id == id).firstOrNull;
      if (preset == null) continue;
      widgetPresets.add({
        'id': preset.id,
        'label': preset.label,
        'durations': preset.durations.sequence,
        'deepLink': 'breathe://start?preset=${preset.id}&autostart=true',
      });
    }

    await HomeWidget.saveWidgetData<String>(
      'presets',
      jsonEncode(widgetPresets),
    );

    await HomeWidget.updateWidget(
      androidName: _androidWidgetName,
      iOSName: _iOSWidgetName,
    );
  }
}
