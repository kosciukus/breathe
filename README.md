# Breathe Repository

This repository contains four app implementations of the same product:

| App | Platform | Location | Status |
|-----|----------|----------|--------|
| Expo React Native | iOS | `react_native/` | **Discontinued** — code kept for reference, no longer maintained |
| Flutter | Android (production) | `flutter/` | Active |
| Apple Watch | watchOS (standalone) | `flutter/ios/BreatheWatch/` | Active |
| Wear OS | Wear OS (standalone) | `flutter/android/wearos/` | Active |

> **Note:** The React Native app (`react_native/`) is discontinued. The iOS production app is now the Flutter app (`flutter/`). Do not make new changes to `react_native/`.

Store links:

- [Android on Google Play](https://play.google.com/store/apps/details?id=it.arcsoftware.breathe)
- [iOS on the App Store](https://apps.apple.com/pl/app/mindful-breathe/id6758299219)

Project docs:

- [React Native README](react_native/README.md)
- [Flutter README](flutter/README.md)

Repository-level files stay at the root:

- `.github/` for CI workflows
- `release-please-config.json` and `.release-please-manifest.json` for React Native release automation
- `LICENSE`

Quick start:

1. ~~For the Expo app, `cd react_native` and follow [react_native/README.md](react_native/README.md).~~ *(discontinued)*
2. For the Flutter app, `cd flutter` and follow [flutter/README.md](flutter/README.md).
3. For the Apple Watch app, open `flutter/ios/Runner.xcworkspace` in Xcode and select the `BreatheWatch` scheme.
4. For the Wear OS app, `cd flutter/android/wearos` and run `flutter run`.
