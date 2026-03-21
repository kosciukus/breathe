# AGENTS.md

## Repository Workflow

Before doing broad code discovery for a new change request:

1. Read `docs/agent-context/README.md`.
2. Read `docs/agent-context/repo-map.md`.
3. Read `docs/agent-context/change-routing.md`.
4. ~~If the request targets the Expo app, read `docs/agent-context/react-native-hotspots.md`.~~ *(React Native is discontinued — do not make changes to `react_native/`)*
5. If the request targets the Flutter app, read `docs/agent-context/flutter-hotspots.md`.
6. If the request targets the Apple Watch app, see `flutter/ios/BreatheWatch/`.
7. If the request targets the Wear OS app, see `flutter/android/wearos/`.

Use those files as the default starting point to identify the likely implementation area.

After that:

- Open only the most relevant source files first.
- Avoid repo-wide scanning unless the request is ambiguous or the context docs are outdated.
- Update `docs/agent-context/` when core structure, ownership, or common change paths change.

## Scope

This repository contains four app implementations of the same product:

- `react_native/` — Expo React Native app — **DISCONTINUED**, kept for reference only, do not modify
- `flutter/` — Flutter app (iOS + Android production)
- `flutter/ios/BreatheWatch/` — standalone Apple Watch app (Swift/SwiftUI, no Flutter)
- `flutter/android/wearos/` — standalone Wear OS app (Flutter)

For product behavior changes (presets, session logic, copy), check whether the change should be mirrored across all relevant targets. Wearable apps share preset definitions with their parent platform app.
