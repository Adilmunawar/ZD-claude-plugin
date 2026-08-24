---
name: i18n-parity
disable-model-invocation: true
argument-hint: "[--fix]"
description: Find missing or unused string keys across language tables; add flagged placeholders; add the parity test.
effort: low
---

1. Load `src/i18n/strings/*.ts`; compute the key union; list keys missing per language and keys unused in `app/` and `src/` (grep `t('key')`/`t("key")`).
2. For missing keys, add entries marked `TODO_TRANSLATE:` with the English text so the screen never renders blank; open a list for the translator.
3. Run the i18n Jest test; if none covers parity, add `src/lib/__tests__/i18n-parity.test.ts`.
4. Report counts per language and the file diff.
