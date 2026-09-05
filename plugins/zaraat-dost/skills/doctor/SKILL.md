---
name: doctor
description: Check that this machine and repo are ready for the Zaraat Dost toolkit — runtimes, GIS libraries, DB clients, plugin modules, secrets hygiene — and print a pass/fail table with fixes. Use after installing or when something doesn't work.
disable-model-invocation: true
---

Run each check with Bash (Windows: PowerShell equivalents) and print a table `Check | Status | Fix`:

| Check | Command |
|---|---|
| Node ≥ 18 (hooks) | `node --version` |
| Claude Code version | `claude --version` |
| Modules installed | `claude plugin list` → expect zd-core, zd-gis, zd-vector, zd-ml, zd-gee, zd-reports |
| Python ≥ 3.10 | `python --version` / `python3 --version` |
| GeoPandas / rasterio / shapely ≥ 2 | `python -c "import geopandas, rasterio, shapely; print(shapely.__version__)"` |
| GDAL CLI | `ogr2ogr --version` |
| .NET SDK (if a .csproj exists) | `dotnet --version`; `dotnet ef --version` |
| DB client | `psql --version` / `sqlcmd -?` / `sqlite3 --version` — whichever the repo's DB needs |
| Earth Engine (if used) | `python -c "import ee"` and `GEE_KEY_FILE` env var set (don't print it) |
| Secrets hygiene | `.gitignore` contains `.env`, `gee.json`, `*.pem`; no such files tracked (`git ls-files | grep -E "\.env$|gee\.json"`) |
| Large files | `git ls-files -z | xargs -0 du -k 2>/dev/null | awk '$1>51200'` → should be empty |
| CLAUDE.md present | exists at repo root; suggest `/zd-core:onboard` if not |
| Team settings | `.claude/settings.json` has `extraKnownMarketplaces.zaraatdost`; suggest `/zaraat-dost:setup` if not |

Missing optional items are WARN, not FAIL. End with the single most important fix.
