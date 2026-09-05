---
name: budget
description: Set or show the weekly token budget that triggers a session-start warning at 80% and 100%.
disable-model-invocation: true
argument-hint: "[weekly-tokens|show|clear]"
effort: low
---

- `show` (or no argument): print the current budget from `~/.claude/zd-usage/budget.json` and this week's usage from the ledger (`usage-report.js week --source ledger --by week`).
- A number (e.g. `2000000` or `2M`): write `{"weekly_tokens": N}` to the budget file with Node (no other content) and confirm.
- `clear`: remove the file.
Explain in one line that the warning appears at session start and never blocks work.
