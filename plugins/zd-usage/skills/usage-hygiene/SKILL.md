---
name: usage-hygiene
description: Practices that keep Claude Code sessions cheap and focused: scope, context management, model choice, forked commands, compaction, when to start a new session. Apply when the user asks how to use Claude efficiently or a session grows long.
---

- Start each task with a precise scope (files, outcome, done criteria); long exploratory sessions cost the most. Use `stack-analyst` or `db-analyst` (read-only) for orientation instead of asking the main session to read everything.
- Keep the working set small: `/context` shows what is loaded; install only the modules a repository needs; disable unused plugins per project.
- Use forked commands (`tech-debt`, `dependency-audit`, `audit`, `study-dashboard`) and agents for anything that produces long output — the main session receives a summary.
- Model by task: `haiku` for validation and formatting, the default model for engineering, the strongest model only for design decisions and hard debugging. Agents inherit the session model unless pinned.
- `/compact` when the conversation exceeds what the current task needs; start a new session after a `/zd-core:handoff` rather than carrying a day's history.
- Watch `/usage` for plan windows and `/zd-usage:report` for where tokens go; set `/zd-usage:budget` per week.
- Avoid pasting large files or logs into chat; give paths and let tools read the parts needed.
