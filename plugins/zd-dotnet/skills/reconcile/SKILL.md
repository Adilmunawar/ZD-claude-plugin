---
name: reconcile
description: Reconcile a rebuilt endpoint or page against the legacy one on the same inputs — rows × fields diff, scalar diff, timings — and write the result into CONVERSION.md.
disable-model-invocation: true
argument-hint: "<feature> [unit/circle/mauza] [season]"
context: fork
allowed-tools: Read, Grep, Glob, Bash, Write
---

1. Identify the legacy endpoint/proc and the new one for the feature; pick the scope (unit/circle/mauza, season) from the argument or the last reconciliation in `CONVERSION.md`.
2. Call both (running API and legacy, or the test copy) and diff: row count, per-field mismatches with examples, scalar/list mismatches, timing before → after.
3. Write a dated paragraph into the feature's section of `CONVERSION.md` in the existing style: "reconciled <date> on <scope>: <rows> × <fields> = <n> diffs; <timings>". Unresolved diffs go to `KNOWN-GAPS.md`.
4. Report the numbers; never round a non-zero diff to "matches".
