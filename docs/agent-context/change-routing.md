# Change Routing

Use this to avoid broad codebase scans. Start with the request type, then confirm the implementation in the listed files.

> **React Native is discontinued.** The `react_native/` directory is kept for reference but should not be modified. Skip the React Native sections below unless you are explicitly asked to read historical code.

## React Native: common requests (DISCONTINUED — do not modify)

### Change breathing timing logic or phase transitions

Start here:

- `react_native/features/breathing/hooks/useBreathingTimer.ts`
- `react_native/features/breathing/lib/constants.ts`
- `react_native/features/breathing/lib/utils.ts`

### Change sound, haptics, or phase cues

Start here:

- `react_native/features/breathing/hooks/usePhaseCues.ts`
- `react_native/features/breathing/context/BreathingContext.tsx`

### Change settings behavior (dark mode, reset app data, language modal state)

Start here:

- `react_native/features/breathing/context/BreathingContext.tsx`
- `react_native/features/breathing/components/PreferencesPanel.tsx`
- `react_native/features/breathing/components/LanguagePanel.tsx`

### Change the main breathing screen layout or interactions

Start here:

- `react_native/features/breathing/screens/BreathingScreen.tsx`
- `react_native/features/breathing/screens/components/BreathingSessionCard.tsx`
- `react_native/features/breathing/screens/components/BreathingSliders.tsx`
- `react_native/features/breathing/screens/components/FavoritePresetBar.tsx`

### Change preset definitions

Start here:

- `react_native/features/breathing/data/presets.json`
- `react_native/features/breathing/data/presets.ts`

Also verify:

- `react_native/i18n/index.ts`

Reason:

- Built-in preset metadata lives in JSON, but user-facing names and education copy are localized separately.

### Change user-facing text or translations

Start here:

- `react_native/i18n/index.ts`

### Change tabs or route structure

Start here:

- `react_native/app/(tabs)/_layout.tsx`
- `react_native/app/(tabs)/index.tsx`
- `react_native/app/(tabs)/presets.tsx`
- `react_native/app/(tabs)/preferences.tsx`
- `react_native/app/(tabs)/language.tsx`

### Change feature styling / theme

Start here:

- `react_native/features/breathing/lib/styles.ts`
- `react_native/features/breathing/hooks/useBreathingTheme.ts`
- `react_native/constants/theme.ts`

## Flutter: common requests

### Change voice assistant integration (Siri / Google Assistant)

Start here:

- `flutter/lib/deep_link_service.dart`
- `flutter/lib/preset_aliases.dart`
- `flutter/lib/app.dart`

Also check platform-specific files:

- iOS Siri: `flutter/ios/Runner/StartBreathingIntent.swift`, `flutter/ios/Runner/AppShortcuts.swift`, `flutter/ios/Runner/AppDelegate.swift`
- Android Google Assistant: `flutter/android/app/src/main/res/xml/shortcuts.xml`, `flutter/android/app/src/main/kotlin/.../MainActivity.kt`

For wearables:

- Apple Watch Siri: `flutter/ios/BreatheWatch/StartBreathingWatchIntent.swift`, `flutter/ios/BreatheWatch/WatchAppShortcuts.swift`
- Wear OS Google Assistant: `flutter/android/wearos/lib/deep_link_service.dart`, `flutter/android/wearos/android/app/src/main/res/xml/shortcuts.xml`

Reason:

- All voice commands funnel through `breathe://start?preset=<id>` deep links. The Dart-side deep link service resolves aliases and triggers the controller. Platform-specific code (App Intents on iOS/watchOS, App Actions on Android) bridges voice input to the URL scheme.

### Change health logging (Apple Health / Health Connect)

Start here:

- `flutter/lib/health_service.dart`
- `flutter/lib/controller.dart`

Also check:

- `flutter/android/wearos/lib/health_service.dart` (separate Wear OS copy)
- `flutter/ios/BreatheWatch/HealthService.swift` (Apple Watch HealthKit copy)

Reason:

- Each platform has its own `HealthService`. The phone app (`health_service.dart`) handles both iOS and Android. The wearables have separate implementations — keep them consistent.

### Change breathing logic, persistence, favorites, or settings behavior

Start here:

- `flutter/lib/controller.dart`

### Change built-in presets

Start here:

- `flutter/lib/presets.dart`

### Change Flutter copy / localization text

Start here:

- `flutter/lib/app_strings.dart`
- `flutter/lib/preset_guide_strings.dart`

### Change Flutter UI layout

Start here:

- `flutter/lib/screens.dart`
- `flutter/lib/app.dart`
- `flutter/lib/theme.dart`

## Apple Watch app: common requests

### Change breathing logic or phase cycling

Start here:

- `flutter/ios/BreatheWatch/BreathingEngine.swift`

### Change preset definitions

Start here:

- `flutter/ios/BreatheWatch/Presets.swift`

Also verify parity with `flutter/lib/presets.dart`.

### Change Watch UI layout

Start here:

- `flutter/ios/BreatheWatch/SessionView.swift`
- `flutter/ios/BreatheWatch/PresetListView.swift`
- `flutter/ios/BreatheWatch/CustomTimerView.swift`

### Change Apple Watch Siri integration

Start here:

- `flutter/ios/BreatheWatch/StartBreathingWatchIntent.swift`
- `flutter/ios/BreatheWatch/WatchAppShortcuts.swift`
- `flutter/ios/BreatheWatch/BreatheWatchApp.swift`
- `flutter/ios/BreatheWatch/BreathingEngine.swift`
- `flutter/ios/BreatheWatch/PresetListView.swift`

Reason:

- Siri triggers a notification from the App Intent, which `BreatheWatchApp` receives and sets `engine.siriTriggeredPresetId`. `PresetListView` observes this to navigate and auto-start the session.

### Change Apple Watch health logging

Start here:

- `flutter/ios/BreatheWatch/HealthService.swift`
- `flutter/ios/BreatheWatch/BreathingEngine.swift`

## Wear OS app: common requests

### Change breathing logic or phase cycling

Start here:

- `flutter/android/wearos/lib/engine.dart`

### Change preset definitions

Start here:

- `flutter/android/wearos/lib/presets.dart`

Also verify parity with `flutter/lib/presets.dart`.

### Change Wear OS UI layout

Start here:

- `flutter/android/wearos/lib/screens/session_screen.dart`
- `flutter/android/wearos/lib/screens/preset_list_screen.dart`

### Change Wear OS Google Assistant integration

Start here:

- `flutter/android/wearos/lib/deep_link_service.dart`
- `flutter/android/wearos/lib/preset_aliases.dart`
- `flutter/android/wearos/lib/main.dart`
- `flutter/android/wearos/android/app/src/main/res/xml/shortcuts.xml`
- `flutter/android/wearos/android/app/src/main/kotlin/.../MainActivity.kt`

### Change Wear OS health logging

Start here:

- `flutter/android/wearos/lib/health_service.dart`
- `flutter/android/wearos/lib/engine.dart`

## Parity checks

If a request affects product behavior rather than platform-specific plumbing, check whether the same change should be mirrored in both apps.

Typical parity-sensitive changes:

- preset content (must stay in sync across `flutter/lib/presets.dart`, `flutter/ios/BreatheWatch/Presets.swift`, and `flutter/android/wearos/lib/presets.dart` — `react_native/features/breathing/data/presets.json` is discontinued, skip it)
- session logic
- user-facing instructional copy
- settings semantics

Typical platform-specific changes:

- Expo / native module integration
- Flutter plugin wiring
- Swift / WatchKit APIs
- Wear OS / Android APIs
- simulator / device build setup
