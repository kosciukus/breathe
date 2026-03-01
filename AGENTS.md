# AGENTS.md

## Repository Workflow

Before doing broad code discovery for a new change request:

1. Read `docs/agent-context/README.md`.
2. Read `docs/agent-context/repo-map.md`.
3. Read `docs/agent-context/change-routing.md`.
4. If the request targets the Expo app, read `docs/agent-context/react-native-hotspots.md`.
5. If the request targets the Flutter app, read `docs/agent-context/flutter-hotspots.md`.

Use those files as the default starting point to identify the likely implementation area.

After that:

- Open only the most relevant source files first.
- Avoid repo-wide scanning unless the request is ambiguous or the context docs are outdated.
- Update `docs/agent-context/` when core structure, ownership, or common change paths change.

## Scope

This repository contains two app implementations of the same product:

- `react_native/` for the Expo React Native app
- `flutter/` for the Flutter app

For product behavior changes, check whether the change should be mirrored in both apps.
