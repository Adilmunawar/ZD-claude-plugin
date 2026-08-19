---
name: handoff
disable-model-invocation: true
argument-hint: "[slug]"
description: Write a session hand-over document so a colleague or a fresh session can continue without the transcript.
---

Write `docs/handoffs/<YYYY-MM-DD>-<slug>.md` (create the folder if needed) with exactly these sections, each ≤ 10 bullets:

- **Goal** — what we were trying to do and for whom
- **Done** — files changed, tables/layers created, commands that worked (paste them)
- **Verified** — what was checked and the numbers (row counts, QA result, test output)
- **Open** — what's unfinished, in priority order, with the exact next command for each
- **Gotchas** — anything surprising (CRS mix-up, env quirk, slow query) the next person must know
- **Context to load** — file paths and CLAUDE.md sections to read first

Then print the path and a 3-line summary. Do not include secrets or connection strings.
