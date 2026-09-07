---
name: contract-check
description: Check the mobile app's API client types against the .NET API's DTOs and envelope, both directions, and list every mismatch. Use when either side changes or before a mobile release.
disable-model-invocation: true
argument-hint: "<mobile-repo-or-endpoints.ts> <api-repo-or-Features-dir>"
context: fork
allowed-tools: Read, Grep, Glob, Bash, Write
---

1. Parse the TypeScript request/response types in the mobile client (`endpoints.ts` and friends) and the C# DTOs in the API's Features (records, `[JsonPropertyName]`, envelope `{status, code, success, message, data}`).
2. Match by route; for each, compare field names (verbatim, including legacy inconsistencies), optionality, numeric-vs-string, dates, enums.
3. Report a table: route · field · mobile type · API type · mismatch kind. Flag routes present on one side only.
4. If the API has compatibility tests for the mobile app, list which mismatches they already cover and which are unguarded.
Write `docs/CONTRACT-CHECK-<date>.md`; nothing is edited.
