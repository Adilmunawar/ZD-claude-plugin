# zd-core

Base module. Every other module assumes it is installed.

## Components

| Component | Type | Purpose |
|---|---|---|
| `stack-detect` | skill, automatic | Identify language, framework, database, spatial libraries and tile service before any DB/dashboard/deploy work — Python, .NET, Node/Next.js, Expo |
| `/zd-core:onboard` | command | Write or refresh `CLAUDE.md` from the repository |
| `/zd-core:handoff` | command | Session hand-over document for a colleague or a fresh session |
| `/zd-core:secrets-audit` | command | Scan tree and git history for credentials; rotation and purge checklist |
| `stack-analyst` | agent, read-only | Map an unfamiliar codebase: architecture diagram, data flow, risks, top-5 actions |
| `zd-brief` | output style | Terse, numbers-first replies (`/output-style zd-brief`) |

## Hooks

| Event | Script | Behaviour |
|---|---|---|
| PreToolUse · Bash | `scripts/guard-bash.js` | Blocks recursive deletes, force push, history-discarding git, `DROP`/`TRUNCATE`, `DELETE` without `WHERE`, `dotnet ef database drop`, recursive Firestore/S3 deletes |
| PreToolUse · Write/Edit | `scripts/guard-write.js` | Refuses to write `.env`, key files, or content matching a credential pattern |
| PostToolUse · Write/Edit | `scripts/after-write.js` | After a vector file is written, reminds Claude to run QA |

Patterns live in `scripts/patterns.js` and are shared by the write guard and the audit. All scripts are plain Node with no dependencies, tested in `tests/`, and behave identically on Windows, macOS and Linux. Disable per project with `/hooks`.

## Standalone use

```
node plugins/zd-core/scripts/secrets-audit.js <repo> --history
```
Exit code 1 when findings exist; suitable as a CI gate.
