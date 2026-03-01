# Agent Context

This folder is a lightweight project memory for future change requests.

Use it as a first pass before scanning the whole repository:

- Read this file for the big picture.
- Read `repo-map.md` for structure and ownership.
- Read `change-routing.md` to jump straight to the likely files for a given request.
- Read `react-native-hotspots.md` when the request targets the Expo app and you need feature-level entry points.
- Read `flutter-hotspots.md` when the request targets the Flutter app and you need feature-level entry points.

What this is for:

- Reducing repeated repo-wide discovery work
- Capturing stable architectural facts
- Recording the main file hotspots for common edits

What this is not:

- A replacement for reading the actual implementation before making a change
- A full architecture spec

Current high-confidence notes:

- The repo contains two app implementations of the same product: `react_native/` and `flutter/`.
- The React Native app appears to be the primary actively released app at the repo level (`release-please` files are wired for it).
- The root-level `ios/` directory currently contains generated CocoaPods output only and is not the main source tree.

Keep this folder small and update it when structure, major workflows, or core ownership changes.
