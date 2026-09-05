# zd-usage

Local, private usage monitoring. Reads Claude Code's own transcript files; nothing is sent anywhere.

| Component | Type | Purpose |
|---|---|---|
| `/zd-usage:report` | command | Tokens and estimated cost by project / model / day / week; CSV export |
| `/zd-usage:budget` | command | Weekly token budget with session-start warnings at 80 % and 100 % |
| `/zd-usage:team-report` | command | Merge teammates' exported CSVs into one team table |
| `usage-hygiene` | skill | Practices that keep sessions cheap and focused |
| SessionEnd hook | `scripts/session-ledger.js` | Appends a one-line summary of each session to `~/.claude/zd-usage/ledger.jsonl` |
| SessionStart hook | `scripts/budget-check.js` | One-line warning when the weekly budget is 80 % / 100 % used |

Standalone: `node plugins/zd-usage/scripts/usage-report.js month --by model`.

Cost estimates use a public price table (`scripts/lib.js`, override with `ZD_PRICING_FILE`); models without a known price show `n/a` rather than a guess. Plan limits and the 5-hour / weekly windows are shown by Claude Code's built-in `/usage`; `/skill-doctor` shows which loaded skills are unused and costing context.
