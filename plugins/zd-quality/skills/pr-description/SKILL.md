---
name: pr-description
disable-model-invocation: true
argument-hint: "[base-branch]"
description: Write a pull request description from the branch diff.
---

Read `git log main..HEAD` and `git diff main...HEAD --stat`, then write:

**Summary** (2 sentences) · **Why** · **Changes** (bullets grouped by area with file counts) · **Risk** (data, contract, migration, secrets — or "none") · **Tests** (commands run and results, screenshots for UI) · **Rollout / rollback** · **Checklist** (typecheck/tests green, secrets audit clean, CHANGELOG updated, docs updated, migrations reviewed).

Keep it under 300 words; link issues; no marketing language.
