# Repo Map

## Root

- `README.md`: top-level repo overview and entry points
- `react_native/`: Expo React Native implementation (iOS production)
- `flutter/`: Flutter implementation (Android production) + wearable apps
- `flutter/ios/BreatheWatch/`: standalone Apple Watch app (Swift/SwiftUI)
- `flutter/android/wearos/`: standalone Wear OS app (Flutter)
- `.github/`: CI/release workflows
- `release-please-config.json` and `.release-please-manifest.json`: React Native release automation

## React Native App

This is the quickest place to start for most product changes.

### Entry flow

- `react_native/app/(tabs)/index.tsx`: home tab entry point
- `react_native/features/breathing/screens/BreathingScreen.tsx`: main breathing experience screen
- `react_native/features/breathing/index.ts`: main feature exports

### State and behavior

- `react_native/features/breathing/context/BreathingContext.tsx`: app-level breathing provider; owns UI sheet state, preference state, reset logic, keep-awake behavior
- `react_native/features/breathing/hooks/useBreathingTimer.ts`: timer engine, preset persistence, favorite handling, draft/active timing state
- `react_native/features/breathing/hooks/usePhaseCues.ts`: phase audio/haptic cues

### Data and copy

- `react_native/features/breathing/data/presets.json`: built-in preset definitions
- `react_native/features/breathing/data/presets.ts`: typed export wrapper for the preset JSON
- `react_native/i18n/index.ts`: app strings and preset education copy for all supported locales

### UI composition

- `react_native/features/breathing/screens/components/`: breathing screen subcomponents
- `react_native/features/breathing/components/`: panels and shared feature components
- `react_native/features/breathing/lib/styles.ts`: central feature styling
- `react_native/features/breathing/hooks/useBreathingTheme.ts`: theme selection / style binding

### React Native persistence

Stored with `expo-secure-store`.

Key buckets currently include:

- theme preference
- sound preference
- vibration preference
- language
- custom presets
- favorite presets
- hidden presets
- last selected preset

### React Native default commands

Run from `react_native/`:

- `npm install`
- `npm run lint`
- `npm run test`
- `npx expo start`
- `npm run ios`
- `npm run android`

## Flutter App

Use this when the request explicitly targets the Flutter port or when parity with React Native matters.

### Entry flow

- `flutter/lib/main.dart`: app bootstrap
- `flutter/lib/app.dart`: root app widget

### State and behavior

- `flutter/lib/controller.dart`: main app controller; timer, persistence, favorites, settings, and media cues
- `flutter/lib/models.dart`: domain models
- `flutter/lib/presets.dart`: built-in preset definitions

### Data and copy

- `flutter/lib/app_strings.dart`: localized UI strings
- `flutter/lib/preset_guide_strings.dart`: preset education copy

### UI and theme

- `flutter/lib/screens.dart`: primary screen widgets
- `flutter/lib/theme.dart`: visual theme

### Flutter persistence

Stored with `shared_preferences`.

### Flutter default commands

Run from `flutter/`:

- `flutter pub get`
- `flutter analyze`
- `flutter test`
- `flutter run`

## Apple Watch App (`flutter/ios/BreatheWatch/`)

Standalone Swift/SwiftUI app — no Flutter, no phone required.

- `BreatheWatchApp.swift`: app entry, creates `BreathingEngine`
- `Presets.swift`: all 10 built-in presets + `BreathPhase` enum (mirrors `flutter/lib/presets.dart`)
- `BreathingEngine.swift`: timer, phase cycling, haptics, last-preset persistence (`UserDefaults`)
- `PresetListView.swift`: preset picker
- `SessionView.swift`: active session UI (progress ring, phase label, countdown, stop)

### Apple Watch commands

Build and run via Xcode — select the `BreatheWatch` scheme and a Watch simulator target.

## Wear OS App (`flutter/android/wearos/`)

Standalone Flutter app targeting Wear OS (API 26+).

- `lib/main.dart`: app entry, Provider setup
- `lib/presets.dart`: all 10 built-in presets + `BreathPhase` enum (mirrors `flutter/lib/presets.dart`)
- `lib/engine.dart`: timer, phase cycling, haptics, last-preset persistence (`shared_preferences`)
- `lib/screens/preset_list_screen.dart`: preset picker
- `lib/screens/session_screen.dart`: active session UI (progress ring, phase label, countdown, stop)
- `android/app/src/main/AndroidManifest.xml`: Wear OS flags (`standalone`, `VIBRATE`, `WAKE_LOCK`)

### Wear OS commands

Run from `flutter/android/wearos/`:

- `flutter pub get`
- `flutter analyze`
- `flutter run`

## Testing / Validation

- React Native exposes `npm run lint` for linting and `npm run test` for timer logic regression coverage.
- Flutter includes `flutter analyze` and `flutter test`; timer cycle regression coverage now lives in `flutter/test/cycle_transition_test.dart`.
