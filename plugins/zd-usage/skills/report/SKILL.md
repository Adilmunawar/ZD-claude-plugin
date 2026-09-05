---
name: report
description: Claude usage report from local transcripts: tokens and estimated cost by project, model, day or week for today, this week, this month or a date range; CSV export for the team.
disable-model-invocation: true
argument-hint: "[today|week|month|all] [--by project|model|day|week] [--export <dir>]"
effort: low
---

Run `node "${CLAUDE_PLUGIN_ROOT}/scripts/usage-report.js" $ARGUMENTS` and show the table as is. Then add at most three sentences: the biggest consumer, the trend versus the previous period (run the previous period only if asked), and one concrete way to cut usage (smaller scope, forked commands, `haiku` for validators, `/compact`). For plan limits and the 5-hour/weekly windows, point to the built-in `/usage`.
