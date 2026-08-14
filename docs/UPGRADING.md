# Upgrading

Run `/zaraat-dost:upgrade`; it applies the steps below for every version you cross. Versions not listed need no manual action.

## 7.2.0 → 7.3.0
- No plugin changes. New optional npm package `@adilmunawar/zd-tools`; releases now carry downloadable assets.

## 0.7.0 → 7.2.0
- Version number only. Run `/zaraat-dost:upgrade`; the update check treats 7.2.0 as newer than 0.7.0.

## 0.6.x → 0.7.0
- New module `zd-usage` (pulled in by the bundle). It adds a SessionEnd hook that writes a per-session token summary to `~/.claude/zd-usage/ledger.jsonl` and a SessionStart budget check. Delete that folder to reset; set `ZD_USAGE_HOME` to relocate it.
- All skill and agent descriptions were shortened; behaviour is unchanged but auto-activation now keys on fewer words — if a background skill stops firing for a phrasing you used, invoke the agent or command directly.

## 0.5.x → 0.6.0
- Product-specific background skills (zd-agis, zd-mobile, zd-models) now declare `paths` so they load when matching files are touched. No action needed; `/context` in a session shows which skills are loaded. If a skill you relied on stops appearing in a repo with a different layout, edit its `paths` in a fork or invoke the agent directly.
- Report commands (`/zd-quality:tech-debt`, `/zd-security:dependency-audit`, `/zd-agis:audit`, `/zd-gis:study-dashboard`) run in a forked context; expect a summary plus the written file instead of the full transcript.
- Every command shows an argument hint in the slash menu.

## 0.4.x → 0.5.0
- New modules zd-quality, zd-security, zd-ops are pulled in by the bundle automatically.
- Bundle adds a daily update check at session start (network call to GitHub with a 3 s timeout, cached in the temp directory). Set `ZD_PLUGINS_REPO` to point at a fork; delete `zd-plugins-update-check.json` in the temp directory to force a check.
- Repositories using the security baseline: run `/zd-security:harden-repo` to add `secrets-scan.yml` and Dependabot.

## 0.3.x → 0.4.0
- `templates/.claude/settings.json` now enables the bundle only; remove per-module `enabledPlugins` entries if you had copied the earlier template.
- New env-var names used by pipeline skills: `ZD_BOUNDARY_MODEL_REPO`, `ZD_LANDUSE_MODEL_REPO`, `EE_BASE64_KEY` or `GEE_KEY_FILE`, `GEE_PROJECT`.

## 0.2.x → 0.3.0
- Install path changed to the bundle: `/plugin install zaraat-dost@zaraatdost`. Individually installed modules keep working.
