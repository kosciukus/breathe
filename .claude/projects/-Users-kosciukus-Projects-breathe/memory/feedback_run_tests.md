---
name: Run tests after code changes
description: Always run flutter analyze and flutter test after making code changes
type: feedback
---

After making code changes to the Flutter app or Wear OS app, always run:
1. `flutter analyze` (in `flutter/` and `flutter/android/wearos/`)
2. `flutter test` (in `flutter/`)

**Why:** The user expects this as part of the standard workflow after non-trivial changes — the same way AGENTS.md defines the discovery workflow.

**How to apply:** Do this automatically at the end of any implementation task, before reporting done.
