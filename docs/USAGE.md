# Using Claude efficiently with this toolkit

## Where usage is visible
| Need | Tool |
|---|---|
| Plan limits, 5-hour and weekly windows, what is contributing | built-in `/usage` (also `/cost`, `/stats`) |
| What is loaded in context right now, and its size | built-in `/context` |
| Which loaded skills are unused and costing context | built-in `/skill-doctor` |
| History by project, model, day, week; estimated cost | `/zd-usage:report` |
| Team totals from exported CSVs | `/zd-usage:team-report` |
| A weekly budget with a session-start warning | `/zd-usage:budget` |

The report reads Claude Code's own transcript files on your machine; nothing is uploaded. Cost is an estimate from a public price table and shows `n/a` for models without a known price rather than inventing a number.

## Keeping sessions cheap
1. **Scope first.** One task, named files, a done criterion. Use `stack-analyst` / `db-analyst` for orientation instead of reading everything into the main session.
2. **Load only what the repo needs.** Install modules individually where the bundle is more than a project uses; `/context` shows what is loaded; product skills activate on matching paths.
3. **Fork the long stuff.** `tech-debt`, `dependency-audit`, `audit`, `study-dashboard` and all agents return summaries; the transcript stays small.
4. **Match model to task.** Validators run on `haiku`; agents inherit the session model; pin a strong model only for design and hard debugging (edit `model:` in a fork).
5. **Compact and hand off.** `/compact` when history outgrows the task; `/zd-core:handoff` then a fresh session at natural boundaries.
6. **Do not paste large inputs.** Give paths; tools read the parts that matter.

## Weekly routine (suggested)
- Monday: `/zd-usage:report week --by project` and `/usage`; adjust `/zd-usage:budget` if the plan window is tight.
- Each engineer: `/zd-usage:report week --export <shared-dir>`; lead runs `/zd-usage:team-report <shared-dir>`.
- Review `/skill-doctor` once a month and disable modules a repo never uses.
