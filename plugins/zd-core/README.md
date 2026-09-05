# zd-core

Install first. Gives every zd-* plugin a common base.

| Component | What it does |
|---|---|
| `stack-detect` (skill, auto) | Identifies language, framework, DB, spatial libs, tile service — Python, .NET, Node |
| `/zd-core:onboard` | Writes/refreshes `CLAUDE.md` from the repo |
| `/zd-core:handoff` | Session handoff doc for a colleague or a fresh session |
| `stack-analyst` (agent) | Read-only codebase map with Mermaid diagram and top-5 actions |
| `zd-brief` (output style) | Terse, numbers-first replies — enable with `/output-style zd-brief` |
| Hooks | Block destructive shell/SQL/git/EF commands; refuse to write secrets; remind to QA vector files |

Hooks are Node.js scripts (Node ships with Claude Code) so they run identically on Windows, macOS and Linux. Disable with `/hooks` if needed.
