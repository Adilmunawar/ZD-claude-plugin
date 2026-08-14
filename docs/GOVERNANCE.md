# Governance: rolling the toolkit out organisation-wide

Three levels of control, from lightest to strictest.

## 1. Per repository (default)
Commit `templates/.claude/settings.json` as `.claude/settings.json`. Engineers who trust the folder get the marketplace, the bundle and the deny rules. Good for open collaboration; anyone can still override in their user settings.

## 2. Per machine (managed settings)
IT places `templates/managed-settings.json` at the managed-settings path for the OS (Claude Code reads it with highest precedence and users cannot override it):

| OS | Path |
|---|---|
| Windows | `C:\ProgramData\ClaudeCode\managed-settings.json` |
| macOS | `/Library/Application Support/ClaudeCode/managed-settings.json` |
| Linux | `/etc/claude-code/managed-settings.json` |

Distribute with your endpoint tool (Intune, Jamf, Ansible). Verify the path against the current Claude Code documentation before rollout; it is the one detail most likely to change.

Keys used: `extraKnownMarketplaces` (which catalogs may be added), `enabledPlugins` (force the bundle on), `permissions.deny` (secrets files and destructive commands), `disableBypassPermissionsMode` (no `--dangerously-skip-permissions`). Add `strictKnownMarketplaces` if only this catalog should be allowed.

## 3. Organisation account
Claude Team/Enterprise admins can pin plugins and marketplaces centrally; the same JSON applies. Keep this repository as the single source of truth and version it: managed settings should reference a tagged release once the team is larger than a handful of people.

## Update policy
- Releases are tagged; `check-update.js` tells each engineer within a day when a newer bundle exists; `/zaraat-dost:upgrade` applies it and shows the changelog.
- Breaking changes (renamed commands, changed settings keys) are listed in `docs/UPGRADING.md` and bump the minor version while pre-1.0, the major after.
- Modules may be pinned per repository with `enabledPlugins` and a version constraint when a project must not move.
