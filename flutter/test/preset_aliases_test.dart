import 'package:flutter_test/flutter_test.dart';

import 'package:breathe_flutter/preset_aliases.dart';
import 'package:breathe_flutter/presets.dart';

void main() {
  group('resolvePresetFromVoice', () {
    test('exact preset ID match', () {
      expect(
        resolvePresetFromVoice('box_4_4_4_4', builtInPresets),
        'box_4_4_4_4',
      );
    });

    test('exact preset ID match is case-insensitive', () {
      expect(
        resolvePresetFromVoice('BOX_4_4_4_4', builtInPresets),
        'box_4_4_4_4',
      );
    });

    test('alias "box breathing" resolves to box preset', () {
      expect(
        resolvePresetFromVoice('box breathing', builtInPresets),
        'box_4_4_4_4',
      );
    });

    test('alias "4 7 8" resolves to relax preset', () {
      expect(
        resolvePresetFromVoice('4 7 8', builtInPresets),
        'relax_4_7_8',
      );
    });

    test('alias "square breathing" resolves to box preset', () {
      expect(
        resolvePresetFromVoice('square breathing', builtInPresets),
        'box_4_4_4_4',
      );
    });

    test('alias "triangle" resolves to triangle preset', () {
      expect(
        resolvePresetFromVoice('triangle', builtInPresets),
        'triangle_3_3_3',
      );
    });

    test('alias "calm" resolves to calm preset', () {
      expect(
        resolvePresetFromVoice('calm', builtInPresets),
        'calm_4_4_6_2',
      );
    });

    test('alias "pursed lip" resolves to pursed preset', () {
      expect(
        resolvePresetFromVoice('pursed lip', builtInPresets),
        'pursed_2_4',
      );
    });

    test('substring match works for longer queries', () {
      expect(
        resolvePresetFromVoice('please start box breathing now', builtInPresets),
        'box_4_4_4_4',
      );
    });

    test('unknown query returns null', () {
      expect(
        resolvePresetFromVoice('something unknown', builtInPresets),
        isNull,
      );
    });

    test('empty query returns null', () {
      expect(resolvePresetFromVoice('', builtInPresets), isNull);
    });

    test('whitespace-only query returns null', () {
      expect(resolvePresetFromVoice('   ', builtInPresets), isNull);
    });

    test('leading and trailing whitespace is trimmed', () {
      expect(
        resolvePresetFromVoice('  box breathing  ', builtInPresets),
        'box_4_4_4_4',
      );
    });
  });
}
