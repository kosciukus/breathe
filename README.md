# Breathe

A calm, focused breathing coach that guides you through inhale, hold, and exhale cycles with clear visuals, gentle cues, and a modern, distraction-free UI. Use presets or craft your own rhythm to match relaxation, focus, or recovery sessions.

## Features
- Guided breathing timer with phase-based progress and smooth transitions
- Built-in presets plus custom timing for each phase
- Session length control with live remaining-time display
- Optional phase sounds and vibration cues
- Favorites, quick access to common patterns
- Multi-language UI (English, Spanish, French, Polish)
- Responsive layout optimized for phones and tablets

## Technical
This is an Expo app using Expo Router.

### Run with Expo
1) Install dependencies
```bash
npm install
```

2) Start the app
```bash
npx expo start
```

You can open it in Expo Go, an Android emulator, or the iOS simulator from the Expo CLI.

### Run on local devices (USB)
Use the npm scripts to install on connected devices (these use the native projects under the hood).
If `ios/` and `android/` are not present (they are gitignored), generate them first:
```bash
npx expo prebuild
```

#### Android (physical device)
1) Enable Developer Options and USB debugging on the phone.
2) Plug the phone in via USB and accept the RSA prompt.
3) Build + install:
```bash
npm run android
```

#### iOS (physical device)
1) Install CocoaPods if needed and make sure Xcode is set up.
2) Plug the iPhone in via USB and trust the computer.
3) Build + install:
```bash
npm run ios
```

> Note: iOS device builds require a valid Apple Developer account and provisioning.

### Run on device without Metro (offline builds)
This builds a release binary with the JS bundle embedded, so the app runs without the Expo/Metro server.

#### Android (release APK)
```bash
cd android
./gradlew assembleRelease
```
APK output: `android/app/build/outputs/apk/release/`

#### Android (release AAB for Play Store)
```bash
cd android
./gradlew bundleRelease
```
AAB output: `android/app/build/outputs/bundle/release/`

#### iOS (release via Xcode)
Open `ios/Breathe.xcworkspace` in Xcode, select “Any iOS Device”, then Product → Archive.

### iOS (Xcode)
If you need a native iOS build, the easiest path is:
```bash
npx expo run:ios
```
This generates the native project (if needed), installs Pods, and launches the app in the iOS simulator.
