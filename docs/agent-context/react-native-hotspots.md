# React Native Hotspots

Use this file when the request targets the Expo app in `react_native/`.

It is intentionally biased toward common day-to-day edits: feature behavior, UI, copy, presets, and app settings.

## First files to open

For most React Native requests, start with these before expanding outward:

- `react_native/app/_layout.tsx`
- `react_native/app/(tabs)/_layout.tsx`
- `react_native/features/breathing/context/BreathingContext.tsx`
- `react_native/features/breathing/screens/BreathingScreen.tsx`

These files explain how the app is bootstrapped, how tabs behave, how shared state is provided, and where the main screen is composed.

## By feature

### App bootstrap, providers, and theme handoff

Open:

- `react_native/app/_layout.tsx`
- `react_native/features/breathing/context/BreathingContext.tsx`
- `react_native/features/breathing/hooks/useBreathingTheme.ts`
- `react_native/constants/theme.ts`

Look here when:

- the app should mount different providers
- dark mode affects navigation chrome or status bar
- a cross-cutting setting needs to exist everywhere

### Bottom tabs and modal-style panels

Open:

- `react_native/app/(tabs)/_layout.tsx`
- `react_native/app/(tabs)/presets.tsx`
- `react_native/app/(tabs)/preferences.tsx`
- `react_native/app/(tabs)/language.tsx`
- `react_native/features/breathing/screens/components/SheetModal.tsx`

Important detail:

- The tab bar routes for presets, preferences, and language mostly act as triggers that open overlays and redirect back to `/`.

### Main breathing screen layout

Open:

- `react_native/features/breathing/screens/BreathingScreen.tsx`
- `react_native/features/breathing/screens/components/BreathingSessionCard.tsx`
- `react_native/features/breathing/screens/components/BreathingSliders.tsx`
- `react_native/features/breathing/screens/components/FavoritePresetBar.tsx`

Look here when:

- adjusting visual layout
- changing main-screen actions
- changing how sliders and the session card interact
- changing page-load animations

### Session engine and timer behavior

Open:

- `react_native/features/breathing/hooks/useBreathingTimer.ts`
- `react_native/features/breathing/lib/constants.ts`
- `react_native/features/breathing/lib/utils.ts`
- `react_native/features/breathing/lib/types.ts`

This is the main logic hotspot for:

- phase order
- countdown behavior
- start / pause / reset flow
- session duration handling
- custom preset save/remove behavior
- favorite / hidden preset persistence

### Presets and preset education

Open:

- `react_native/features/breathing/data/presets.json`
- `react_native/features/breathing/data/presets.ts`
- `react_native/features/breathing/components/PresetsPanel.tsx`
- `react_native/features/breathing/components/PresetChips.tsx`
- `react_native/i18n/index.ts`

Important detail:

- Built-in preset timing data lives in `presets.json`.
- Preset names, education copy, and route text are localized in `i18n/index.ts`.
- The education panel only renders for built-in presets, not arbitrary custom presets.

### Settings, reset behavior, and persisted preferences

Open:

- `react_native/features/breathing/components/PreferencesPanel.tsx`
- `react_native/features/breathing/context/BreathingContext.tsx`

This is the main hotspot for:

- sound toggle
- vibration toggle
- dark mode toggle
- reset app data behavior

Persisted settings currently use `expo-secure-store`.

### Language selection and localization

Open:

- `react_native/features/breathing/components/LanguagePanel.tsx`
- `react_native/i18n/index.ts`

Important detail:

- The language panel triggers `persistLanguage(...)` and then `i18n.changeLanguage(...)`.
- Large user-facing text changes are usually concentrated in `i18n/index.ts`.

### Audio, haptics, and keep-awake behavior

Open:

- `react_native/features/breathing/hooks/usePhaseCues.ts`
- `react_native/features/breathing/context/BreathingContext.tsx`
- `react_native/features/breathing/lib/constants.ts`

This covers:

- phase sound playback
- vibration cues
- sound asset mapping
- keeping the device awake during active sessions

### Styling and visual language

Open:

- `react_native/features/breathing/lib/styles.ts`
- `react_native/features/breathing/hooks/useBreathingTheme.ts`
- `react_native/constants/theme.ts`

Look here when:

- changing colors
- changing card / sheet / slider styling
- changing dark/light presentation

## Fast triage rules

Use these shortcuts before opening more files:

- If the request mentions “logic,” “timer,” “phase,” or “countdown,” start with `useBreathingTimer.ts`.
- If it mentions “settings,” “dark mode,” “reset,” or “preference,” start with `BreathingContext.tsx` and `PreferencesPanel.tsx`.
- If it mentions “preset content,” “favorites,” or “preset info,” start with `presets.json`, `PresetsPanel.tsx`, and `i18n/index.ts`.
- If it mentions “translation,” “text,” or “language,” start with `i18n/index.ts` and `LanguagePanel.tsx`.
- If it mentions “layout,” “home screen,” or “UI,” start with `BreathingScreen.tsx` and the `screens/components/` folder.
- If it mentions “tab behavior” or “navigation,” start with `app/_layout.tsx` and `app/(tabs)/_layout.tsx`.

## Validation after changes

For React Native changes, the default lightweight check is:

- Run `npm run lint` from `react_native/`

For behavior changes, also confirm whether the same product change should be mirrored in `flutter/`.
