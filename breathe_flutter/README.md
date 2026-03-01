# Breathe Flutter Port

This folder contains a Flutter rewrite of the existing Expo React Native app.

The Flutter SDK is not installed in this workspace, so this is a hand-built Flutter source tree:

- `lib/` contains the app code, timer logic, screens, themes, and data models.
- `assets/sounds/` contains the copied phase cue audio files.
- `pubspec.yaml` declares the Flutter dependencies needed for persistence, audio, haptics, and wakelock behavior.

What is included:

- Guided inhale / hold / exhale / pause session timer
- Pre-start countdown
- Built-in presets plus custom saved presets
- Favorites and quick access
- Persisted preferences (sound, vibration, dark mode, language, custom presets)
- Preset education cards
- Bottom navigation for Home, Presets, Preferences, and Language

Current gap versus the React Native app:

- Language selection is implemented and persisted, but this port currently ships with English UI copy as the default text layer.
- No native `android/`, `ios/`, or other platform folders were generated because `flutter` is not available in this environment.

To turn this into a runnable local Flutter app on a machine with Flutter installed:

1. Install Flutter.
2. Open this folder: `cd breathe_flutter`
3. Fetch dependencies: `flutter pub get`
4. If you need missing platform folders, generate them with `flutter create .`
5. Run the app with `flutter run`
