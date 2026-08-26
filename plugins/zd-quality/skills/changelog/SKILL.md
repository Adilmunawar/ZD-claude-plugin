---
name: changelog
disable-model-invocation: true
argument-hint: "[version]"
description: Generate a CHANGELOG section from conventional commits since the last tag.
---

1. `git describe --tags --abbrev=0` → last tag; `git log <tag>..HEAD --pretty=%s%n%b`.
2. Map types: feat→Added, fix→Fixed, perf/refactor→Changed, security-related→Security; anything with `BREAKING CHANGE` first under **Breaking**.
3. Rewrite each line as a user-facing sentence (what changed, not how); merge duplicates; drop chores.
4. Insert a `## X.Y.Z — YYYY-MM-DD` section at the top; keep existing entries untouched.
5. Print the section and the suggested release tag command.
