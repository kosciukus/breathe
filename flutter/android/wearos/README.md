# Breathe — Wear OS

Standalone Flutter app for Wear OS (API 26+). Runs independently — no phone app required.

All commands below assume you are running them from the `flutter/android/wearos/` folder.

## Features

- All 10 built-in presets
- Full breathing timer with phase cycling (inhale → hold in → exhale → hold out)
- Haptic feedback on each phase transition
- Session progress ring and countdown
- Logs completed sessions to Health Connect as mindfulness minutes (best-effort, gracefully degrades if Health Connect is unavailable or permission denied)
- Preset and last-used-preset persistence via `shared_preferences`

## Source files

- `lib/main.dart` — app entry, Provider setup
- `lib/engine.dart` — timer engine, phase cycling, haptics, health logging, last-preset persistence
- `lib/presets.dart` — all 10 built-in presets + `BreathPhase` enum (mirrors `flutter/lib/presets.dart`)
- `lib/health_service.dart` — Health Connect integration (Android only, `HealthDataType.MINDFULNESS` write)
- `lib/screens/preset_list_screen.dart` — preset picker
- `lib/screens/session_screen.dart` — active session UI (progress ring, phase label, countdown, stop)

## Run

1. Fetch dependencies:

```bash
flutter pub get
```

2. Run checks:

```bash
flutter analyze
```

3. Start a Wear OS emulator (Android Studio → Device Manager → Wear OS Small Round) or connect a physical Wear OS watch.

4. Run:

```bash
flutter run
```

## Health Connect

The app requests write permission for `HealthDataType.MINDFULNESS` at startup. If the user denies or Health Connect is not installed, the app works normally — health logging is best-effort and silently skipped on failure.

The `health_service.dart` file is Android-only (guarded by `Platform.isAndroid`). Do not port this file to iOS.

## Parity

`lib/presets.dart` must stay in sync with:
- `flutter/lib/presets.dart`
- `flutter/ios/BreatheWatch/Presets.swift`
