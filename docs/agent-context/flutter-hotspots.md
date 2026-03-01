# Flutter Hotspots

Use this file when the request targets the Flutter app in `flutter/`.

It is focused on the main Flutter change paths: app shell, controller logic, screens, presets, strings, and theme.

## First files to open

For most Flutter requests, start with these before expanding outward:

- `flutter/lib/main.dart`
- `flutter/lib/app.dart`
- `flutter/lib/controller.dart`
- `flutter/lib/screens.dart`

These files cover app bootstrap, the home shell and bottom navigation, shared behavior state, and the main UI surfaces.

## By feature

### App bootstrap, shell, and tab switching

Open:

- `flutter/lib/main.dart`
- `flutter/lib/app.dart`

Look here when:

- changing the app startup path
- changing the root `MaterialApp`
- changing bottom navigation structure
- changing which screen is shown for each tab index

Important detail:

- Flutter uses a single `Scaffold` with a `NavigationBar`; the tab views are screen widgets, not route-driven overlays.

### Session engine, persistence, and cross-cutting behavior

Open:

- `flutter/lib/controller.dart`
- `flutter/lib/models.dart`
- `flutter/lib/presets.dart`

This is the main logic hotspot for:

- timer ticks and phase transitions
- pre-start countdown behavior
- start / reset flow
- repeat duration handling
- custom preset save/remove behavior
- favorite / hidden preset persistence
- sound, vibration, dark mode, and language persistence
- keep-awake behavior

Important detail:

- Flutter persistence uses `shared_preferences`.
- The controller is the main source of truth and notifies the UI via `ChangeNotifier`.

### Main home screen layout and session controls

Open:

- `flutter/lib/screens.dart`

Look here when:

- changing the home layout
- changing the favorite preset chip row
- changing the session card actions
- changing sliders for inhale/hold/exhale/pause

Important detail:

- `HomeScreen` in `screens.dart` owns the main breathing UI, including the session card and timing sliders.

### Presets UI and preset selection

Open:

- `flutter/lib/screens.dart`
- `flutter/lib/controller.dart`
- `flutter/lib/presets.dart`

Look here when:

- changing how presets are listed
- changing favorite preset presentation
- changing preset selection behavior
- changing built-in preset timing defaults

Important detail:

- Built-in preset definitions live in `presets.dart`, not in a separate JSON file.

### Preset education and localized preset copy

Open:

- `flutter/lib/app_strings.dart`
- `flutter/lib/preset_guide_strings.dart`
- `flutter/lib/presets.dart`

Important detail:

- Built-in presets in `presets.dart` include English fallback fields such as `about`, `bestFor`, `tip`, and `caution`.
- Localized preset education strings are centralized in `preset_guide_strings.dart`.
- General localized UI labels live in `app_strings.dart`.

### Preferences, dark mode, and reset behavior

Open:

- `flutter/lib/screens.dart`
- `flutter/lib/controller.dart`
- `flutter/lib/theme.dart`

Look here when:

- changing settings controls
- changing reset app data behavior
- changing dark mode semantics
- changing how theme mode is applied

Important detail:

- `BreatheApp` in `app.dart` derives `themeMode` from controller state and rebuilds when dark mode changes.

### Language selection and localization

Open:

- `flutter/lib/screens.dart`
- `flutter/lib/app_strings.dart`
- `flutter/lib/models.dart`
- `flutter/lib/controller.dart`

Look here when:

- changing the language picker
- changing supported languages
- changing language persistence or default-language resolution
- changing user-facing text

Important detail:

- `AppLanguage` and language resolution helpers live in `models.dart`.

### Styling and visual language

Open:

- `flutter/lib/theme.dart`
- `flutter/lib/screens.dart`

Look here when:

- changing colors
- changing typography weights
- changing navigation bar styling
- changing slider or snackbar styling
- changing gradients and card presentation

### Audio and haptics

Open:

- `flutter/lib/controller.dart`
- `flutter/pubspec.yaml`

Look here when:

- changing phase sound playback
- changing vibration behavior
- changing sound asset references
- changing plugin wiring for audio or vibration

## Fast triage rules

Use these shortcuts before opening more files:

- If the request mentions “logic,” “timer,” “phase,” or “countdown,” start with `flutter/lib/controller.dart`.
- If it mentions “settings,” “dark mode,” “reset,” or “preference,” start with `flutter/lib/controller.dart` and `flutter/lib/screens.dart`.
- If it mentions “preset content” or “preset timings,” start with `flutter/lib/presets.dart`.
- If it mentions “preset guide,” “copy,” or “translations,” start with `flutter/lib/app_strings.dart` and `flutter/lib/preset_guide_strings.dart`.
- If it mentions “layout,” “home screen,” or “UI,” start with `flutter/lib/screens.dart`.
- If it mentions “navigation” or “tabs,” start with `flutter/lib/app.dart`.
- If it mentions “theme” or “colors,” start with `flutter/lib/theme.dart`.

## Validation after changes

For Flutter changes, the default lightweight check is:

- Run `flutter analyze` from `flutter/`

For behavior changes, also confirm whether the same product change should be mirrored in `react_native/`.
