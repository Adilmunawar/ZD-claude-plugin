---
name: onboard
description: Generate or refresh a project's CLAUDE.md by inspecting the repository (stack, run commands, data layout, conventions). Use on a new repo or when CLAUDE.md is stale.
disable-model-invocation: true
---

1. Run the `stack-detect` skill.
2. Read README, top-level folders, CI config, and any existing CLAUDE.md.
3. Write/update `CLAUDE.md` at the repo root using this structure — keep it under 120 lines, facts only, no marketing:

```
# <project>
<2 sentences: what it is, who uses it>
## Stack            (from stack-detect)
## How to run       (exact commands: setup, run, test, migrate)
## Data & layout    (data dirs, CRS, deliverable paths)
## Conventions      (naming, branching, review rules found in repo)
## Don'ts           (secrets, destructive ops, large files)
## Plugins          (which zd-* plugins apply here)
```

4. If `.claude/settings.json` doesn't exist, offer to add the team template (marketplace + deny rules) — don't add it silently.
5. Show the diff before writing when CLAUDE.md already exists.
