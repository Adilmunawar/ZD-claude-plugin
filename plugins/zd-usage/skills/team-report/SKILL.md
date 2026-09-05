---
name: team-report
description: Merge teammates' exported usage CSVs from a shared folder into one table per user and week.
disable-model-invocation: true
argument-hint: "<shared-dir>"
effort: low
---

1. Each engineer runs `/zd-usage:report week --export <shared-dir>` (a synced folder or repo) — files are `usage-<user>-week-<date>.csv` and contain no prompts or code, only token counts.
2. Run `node "${CLAUDE_PLUGIN_ROOT}/scripts/usage-report.js" --merge $ARGUMENTS` and show the table.
3. Add two sentences: total for the team and the one project or user that dominates. Suggest a budget if none is set.
