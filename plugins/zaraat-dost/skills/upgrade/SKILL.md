---
name: upgrade
disable-model-invocation: true
description: Update marketplace, bundle and every module; show changelog since the installed version; apply migration notes; re-run doctor.
---

1. Read the installed version from the bundle's `plugin.json`. Fetch `CHANGELOG.md` from the repository (raw GitHub URL) and show the sections newer than it.
2. Run `node "${CLAUDE_PLUGIN_ROOT}/scripts/upgrade.js"`. It updates the marketplace, the bundle, and each dependency module in turn (Claude Code updates one plugin per command and does not cascade). Show its table. On any `ERR` line, re-run that single `claude plugin update <module>@zaraatdost` and report the error text.
3. Read `docs/UPGRADING.md` for the versions crossed and apply the listed manual steps.
4. Tell the user to restart Claude Code or run `/reload-plugins`, then run `/zaraat-dost:doctor`.
5. Report: old → new version, modules updated, manual steps done or pending.
