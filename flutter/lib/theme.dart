import 'package:flutter/material.dart';

ThemeData buildBreatheTheme({required bool darkMode}) {
  final brightness = darkMode ? Brightness.dark : Brightness.light;
  final seed = darkMode ? const Color(0xFF8CCFC2) : const Color(0xFF136F63);

  final scheme = ColorScheme.fromSeed(
    seedColor: seed,
    brightness: brightness,
  ).copyWith(
    primary: darkMode ? const Color(0xFF8CCFC2) : const Color(0xFF136F63),
    secondary: darkMode ? const Color(0xFFF0C86B) : const Color(0xFFB7791F),
    surface: darkMode ? const Color(0xFF0F171B) : const Color(0xFFF6F2E9),
    error: const Color(0xFFC24E4E),
  );

  final base = ThemeData(
    useMaterial3: true,
    colorScheme: scheme,
    brightness: brightness,
    scaffoldBackgroundColor: scheme.surface,
  );

  return base.copyWith(
    textTheme: base.textTheme.copyWith(
      displaySmall: base.textTheme.displaySmall?.copyWith(
        fontWeight: FontWeight.w700,
        letterSpacing: -1.2,
      ),
      headlineSmall: base.textTheme.headlineSmall?.copyWith(
        fontWeight: FontWeight.w700,
      ),
      titleLarge: base.textTheme.titleLarge?.copyWith(
        fontWeight: FontWeight.w700,
      ),
      titleMedium: base.textTheme.titleMedium?.copyWith(
        fontWeight: FontWeight.w600,
      ),
      labelLarge: base.textTheme.labelLarge?.copyWith(
        fontWeight: FontWeight.w700,
      ),
    ),
    sliderTheme: base.sliderTheme.copyWith(
      activeTrackColor: scheme.primary,
      inactiveTrackColor: scheme.primary.withValues(alpha: 0.18),
      thumbColor: darkMode ? Colors.white : const Color(0xFFE5E7EB),
      overlayColor: scheme.primary.withValues(alpha: 0.12),
      trackHeight: 6,
    ),
    navigationBarTheme: NavigationBarThemeData(
      backgroundColor: darkMode ? const Color(0xFF131D22) : Colors.white,
      indicatorColor: scheme.primary.withValues(alpha: 0.16),
      labelTextStyle: WidgetStateProperty.resolveWith<TextStyle?>(
        (states) => base.textTheme.labelSmall?.copyWith(
          fontWeight: states.contains(WidgetState.selected)
              ? FontWeight.w700
              : FontWeight.w500,
        ),
      ),
    ),
    snackBarTheme: SnackBarThemeData(
      behavior: SnackBarBehavior.floating,
      backgroundColor: darkMode ? const Color(0xFF223038) : const Color(0xFF20323B),
      contentTextStyle: TextStyle(color: Colors.white),
    ),
  );
}
