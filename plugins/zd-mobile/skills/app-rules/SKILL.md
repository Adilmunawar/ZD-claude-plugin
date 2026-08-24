---
name: app-rules
paths: ["app/**", "src/i18n/**", "src/components/**", "src/lib/**", "app.json", "eas.json"]
description: Non-negotiable rules for the farmer Expo app: RTL-safe layout, single text component, Latin digits, server-truth numbers, secure storage, signing parity.
---

- **RTL**: `start`/`end` (never `left`/`right`); `I18nManager` switch triggers a reload; test each screen in Urdu.
- **Text**: all text through `Txt` (language-aware font face and line height); no screen names a font or line height.
- **Digits** stay Latin in every language; CNICs render masked by default.
- **Server truth**: the phone never invents a number; each figure carries its fetched-at age; absence horizons decide when to show "no recent data" (see `src/lib/absence.ts`).
- **Session**: tokens in `expo-secure-store` under `zdl_*`; 5-minute device lock; 7-day session horizon; only a real 401 signs out.
- **Signing**: document sequence 1–8 with OTP at fixed steps is byte-identical to the legacy client; do not reorder.
- **Config**: `EXPO_PUBLIC_API_BASE` baked at bundle time; when absent the app uses production, never localhost; `npm run check-bundle` proves the bundle carries only production.
- **Offline**: TanStack Query persisted to AsyncStorage; uploads through the queue in `src/lib/upload-queue.ts`.
- **Tests**: every rule above has a Jest test in `src/lib/__tests__`; add one when adding a rule.
