# Change Routing

Use this to avoid broad codebase scans. Start with the request type, then confirm the implementation in the listed files.

## React Native: common requests

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

## Parity checks

If a request affects product behavior rather than platform-specific plumbing, check whether the same change should be mirrored in both apps.

Typical parity-sensitive changes:

- preset content
- session logic
- user-facing instructional copy
- settings semantics

Typical platform-specific changes:

- Expo / native module integration
- Flutter plugin wiring
- simulator / device build setup
