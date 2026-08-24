---
name: release-checklist
disable-model-invocation: true
argument-hint: "[profile]"
description: Pre-release verification for the Expo app: typecheck, tests, bundle check, EAS profile, versions, permissions, model asset, OTA.
---

Run and report each item as pass/fail:
1. `npm run typecheck`, `npm test -- --ci`.
2. `npm run export && npm run check-bundle` — bundle contains only the production API base.
3. `eas.json` profile selected; `app.json` version and Android `versionCode` / iOS `buildNumber` incremented.
4. Permission strings (camera, location, microphone) present in all four languages.
5. On-device model: `src/lib/pest/model-card.json` version matches the bundled `.tflite`; update flow tested.
6. `expo-updates` channel and runtime version match the build profile.
7. Custom CA plugin (`withAndroidCaTrust`) still references the current certificate file.
8. Smoke on device: login, land map, apply flow, signing OTP, language switch to an RTL language.
