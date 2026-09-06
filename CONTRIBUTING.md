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
5. `bash scripts/ci-local.sh` — exactly what CI runs; it must be green before you push (it regenerates nothing, so run `python3 scripts/gen-docs.py` first if you changed a skill or agent).
6. Add a CHANGELOG entry. Open a PR using the template; CI must pass.

## Releasing

```bash
bash scripts/release.sh 7.4.0     # bumps every manifest, checks the changelog, regenerates docs, validates
git add -A && git commit -m "chore(release): v7.4.0" && git push
git tag v7.4.0 && git push origin v7.4.0
```

The release workflow then: checks the tag against **every** manifest, requires a matching `CHANGELOG.md` section, runs the full validation and a credentials audit, builds the archive and package tarball, **verifies the archive passes `claude plugin validate` and the tarball installs and executes**, publishes to GitHub Packages (idempotent), and creates the release with install instructions and checksums. Any failure stops the release before anything is published.

Tag the release commit itself — if you push a fix afterwards, cut the next patch version rather than moving the tag.

## Renaming or removing
Add the old name to `renames` in `marketplace.json` so existing installs migrate.
