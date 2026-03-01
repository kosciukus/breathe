import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:breathe_flutter/theme.dart';

void main() {
  test('buildBreatheTheme sets the expected brightness', () {
    expect(buildBreatheTheme(darkMode: false).brightness, Brightness.light);
    expect(buildBreatheTheme(darkMode: true).brightness, Brightness.dark);
  });
}
