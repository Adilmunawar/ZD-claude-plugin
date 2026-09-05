---
name: conventional-commits
description: Commit message and branch naming convention with product scopes. Apply when writing commits or creating branches.
---

Format: `<type>(<scope>): <imperative summary ≤ 72 chars>` then a blank line and a body explaining why, then `Refs: #123` / `BREAKING CHANGE:` footers.

Types: `feat fix perf refactor docs test build ci chore revert`.
Scopes: `pipeline gee models vector gis agis mobile api deploy reports core` or a tool/page name.
Branches: `<type>/<scope>-<short-slug>` (e.g. `feat/agis-sar-analytics`, `fix/pipeline-resume`).
Rules: one logical change per commit; no "wip"/"misc"; generated files committed separately; version bumps in their own commit `chore(release): vX.Y.Z`.
