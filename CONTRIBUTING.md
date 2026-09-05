# Contributing

1. Fork/branch from `main`.
2. Put changes under `plugins/<plugin>/`: agents in `agents/*.md`, skills in `skills/<name>/SKILL.md`, hooks in `hooks/hooks.json` + `scripts/*.js` (Node only — no bash/python hooks, they break on Windows).
3. No client names, AOI files, DB names or credentials — this repo is public. Domain knowledge (CRS, conventions) is fine.
4. Bump `version` in the plugin's `.claude-plugin/plugin.json` (semver). Users only receive updates when it changes.
5. `bash scripts/validate.sh`; test locally with `/plugin marketplace add ./` then `/plugin install <plugin>@zaraatdost`.
6. `python3 scripts/gen-docs.py` (CI fails if `docs/COMMANDS.md` is stale). Add a line to `CHANGELOG.md`. Open a PR; CI must pass.
7. Releasing: bump the bundle version, tag `vX.Y.Z`, push the tag — the release workflow publishes notes from the changelog.

Renaming or removing a plugin? Add it to `renames` in `marketplace.json` so existing installs migrate.
