# Breathe Repository

This repository now contains two app implementations of the same product:

- `react_native/` contains the Expo React Native app
- `flutter/` contains the Flutter port

Production release note:

- The current production Android release on Google Play uses the Flutter app, not the Expo React Native app.

Store link:

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

1. For the Expo app, `cd react_native` and follow [react_native/README.md](react_native/README.md).
2. For the Flutter app, `cd flutter` and follow [flutter/README.md](flutter/README.md).
