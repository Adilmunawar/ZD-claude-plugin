# Contributing

## Ground rules
- This repository is public. It documents conventions, constants and methods; it never contains credentials, project ids, hostnames, client names or data. `tests/test_repo.py` enforces the obvious cases; review for the rest.
- Hooks are Node.js only (no bash or Python hooks — they break on Windows) and must have a test in `tests/`.
- One voice: short sentences, concrete numbers, no marketing adjectives. If a sentence would not help an engineer at 2 a.m., delete it.

## Adding or changing a module
1. Branch from `main`.
2. Agents in `plugins/<module>/agents/<name>.md`, skills in `plugins/<module>/skills/<name>/SKILL.md` (`name` must equal the folder), commands set `disable-model-invocation: true`.
3. Declare dependencies on other modules in the module's `plugin.json`.
4. Bump `version` in **every** `plugin.json` and in `packages/zd-tools/package.json` (all modules share one version; `tests/test_repo.py` checks this).
5. `python3 scripts/gen-docs.py` and `bash scripts/validate.sh`.
6. Add a CHANGELOG entry. Open a PR using the template; CI must pass.

## Releasing
Tag `vX.Y.Z` matching the bundle version and push the tag; the release workflow publishes a GitHub Release with the changelog section.

## Renaming or removing
Add the old name to `renames` in `marketplace.json` so existing installs migrate.
