---
name: doctor
disable-model-invocation: true
description: Check runtimes, GIS libraries, DB clients, installed modules, secrets hygiene, repo standards and toolkit version; print pass/fail with fixes.
---

Run each check with Bash (Windows: PowerShell equivalents) and print a table `Check | Status | Fix`:

| Check | Command |
|---|---|
| Node ≥ 18 (hooks) | `node --version` |
| Claude Code version | `claude --version` |
| Modules installed | `claude plugin list` → expect zd-core, zd-gis, zd-vector, zd-models, zd-ml, zd-gee, zd-agis, zd-mobile, zd-deploy, zd-quality, zd-security, zd-ops, zd-usage, zd-reports |
| Python ≥ 3.10 | `python --version` / `python3 --version` |
| GeoPandas / rasterio / shapely ≥ 2 | `python -c "import geopandas, rasterio, shapely; print(shapely.__version__)"` |
| GDAL CLI | `ogr2ogr --version` |
| .NET SDK (if a .csproj exists) | `dotnet --version`; `dotnet ef --version` |
| Node project tooling (if package.json) | `npm --version`; `npx expo --version` for Expo apps; `firebase --version` for Firebase projects |
| Committed secrets | `node <zd-core>/scripts/secrets-audit.js .` → expect no findings |
| DB client | `psql --version` / `sqlcmd -?` / `sqlite3 --version` — whichever the repo's DB needs |
| Earth Engine (if used) | `python -c "import ee"` and `GEE_KEY_FILE` env var set (don't print it) |
| Secrets hygiene | `.gitignore` contains `.env`, `gee.json`, `*.pem`; no such files tracked (`git ls-files | grep -E "\.env$|gee\.json"`) |
| Large files | `git ls-files -z | xargs -0 du -k 2>/dev/null | awk '$1>51200'` → should be empty |
| CLAUDE.md present | exists at repo root; suggest `/zd-core:onboard` if not |
| Team settings | `.claude/settings.json` has `extraKnownMarketplaces.zaraatdost`; suggest `/zaraat-dost:setup` if not |

| Usage ledger | `~/.claude/zd-usage/ledger.jsonl` exists after at least one session; budget set (`/zd-usage:budget show`) |
| Toolkit version | compare bundle `plugin.json` version with the latest release (`check-update.js` cache); suggest `/zaraat-dost:upgrade` if behind |
| Repo standards | `.editorconfig`, `.gitattributes`, `.github/PULL_REQUEST_TEMPLATE.md`, `SECURITY.md`, `.github/dependabot.yml` present; suggest `/zaraat-dost:standards` and `/zd-security:harden-repo` |

Missing optional items are WARN, not FAIL. End with the single most important fix.
