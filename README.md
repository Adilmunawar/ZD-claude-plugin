<div align="center">

# Claude Plugins for Zaraat Dost

**Agents, skills and guardrails for agricultural geospatial engineering in [Claude Code](https://docs.claude.com/en/docs/claude-code/overview)**
Spatial databases · GIS dashboards (Python & .NET) · parcel vectorisation · satellite ML · Earth Engine · client reports

[![validate](https://github.com/adilmunawar/ZD-claude-plugin/actions/workflows/validate.yml/badge.svg)](https://github.com/adilmunawar/ZD-claude-plugin/actions/workflows/validate.yml)
[![release](https://img.shields.io/github/v/release/adilmunawar/ZD-claude-plugin?label=release)](https://github.com/adilmunawar/ZD-claude-plugin/releases)
[![license](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
![platforms](https://img.shields.io/badge/platforms-Windows%20%7C%20macOS%20%7C%20Linux-lightgrey)

</div>

---

## Install — one line

**Windows (PowerShell)**
```powershell
irm https://raw.githubusercontent.com/adilmunawar/ZD-claude-plugin/main/install.ps1 | iex
```
**macOS / Linux / WSL**
```bash
bash <(curl -fsSL https://raw.githubusercontent.com/adilmunawar/ZD-claude-plugin/main/install.sh)
```
**Or inside Claude Code**
```
/plugin marketplace add adilmunawar/ZD-claude-plugin
/plugin install zaraat-dost@zaraatdost
```

Then, in any project: `/zaraat-dost:doctor` → `/zaraat-dost:setup` → `/zaraat-dost:help`.
Only need one part? Every module installs on its own: `/plugin install zd-vector@zaraatdost`. Full details in [docs/INSTALL.md](docs/INSTALL.md).

## What you get

| Module | Use it for | Entry points |
|---|---|---|
| **zd-core** | Every repo | `stack-detect` (Python / .NET / Node, auto) · `/zd-core:onboard` · `/zd-core:handoff` · `stack-analyst` · `zd-brief` style · guard hooks |
| **zd-gis** | Databases & dashboards | `db-analyst` → `docs/DATABASE.md` · `gis-dashboard-manager` · `/zd-gis:study-dashboard` · `/zd-gis:new-layer` · `/zd-gis:export-deliverable` · `geo-data-qa` |
| **zd-vector** | Model output → parcels | `vector-engineer` · tile-safe `raster_to_polygons.py` · topology repair · edge straightening · road subtraction · `/zd-vector:gap-analysis` |
| **zd-ml** | Segmentation models | `seg-trainer` · 10-point pre-flight checklist · resume/early-stop template · Colab RAM-safe · `/zd-ml:model-card` |
| **zd-gee** | Earth Engine | auth & export-limit fixes · S1/S2 composites · `/zd-gee:ndvi-timeseries` · `/zd-gee:harvest-detect` |
| **zd-reports** | Hand-over | `/zd-reports:deliverable-memo` · `/zd-reports:harvest-report` · `/zd-reports:layer-metadata` |

Complete reference: [docs/COMMANDS.md](docs/COMMANDS.md) (generated from the plugins, always current).

## Typical flows

<details><summary><b>Take over an unknown project and its database</b></summary>

```
use the stack-analyst agent to map this repo
use the db-analyst agent to study the database and write docs/DATABASE.md
/zd-gis:study-dashboard
/zd-core:onboard
```
</details>

<details><summary><b>Model prediction → client deliverable</b></summary>

```
use vector-engineer on predictions/crop_mask.tif and produce a parcel layer
/zd-vector:gap-analysis parcels.gpkg aoi.gpkg
/zd-gis:export-deliverable parcels.gpkg
/zd-reports:deliverable-memo
```
</details>

<details><summary><b>Seasonal harvest report</b></summary>

```
/zd-gee:ndvi-timeseries <parcel asset id> 2026-09-01 2027-04-30
/zd-gee:harvest-detect
/zd-reports:harvest-report
```
</details>

## Why it's safe to give to a whole team

- **Guardrails in code, not prompts** — Node hooks block `DROP`/`TRUNCATE`/`rm -rf`/force-push/`dotnet ef database drop` and refuse to write `.env`, `gee.json` or anything that looks like a credential. Same behaviour on Windows, macOS, Linux.
- **Read-only analysts** — `db-analyst`, `stack-analyst`, `geo-data-qa` cannot edit files.
- **Stack detected, never assumed** — ASP.NET Core / Blazor / EF Core + NetTopologySuite, Streamlit / Dash / FastAPI / Django, Leaflet / MapLibre / OpenLayers, PostGIS / SQL Server / GeoPackage / MySQL. Unknown → it asks.
- **No internal data in this repo** — conventions only; project specifics live in each repo's `CLAUDE.md`.
- **Versioned together** — the bundle pins modules to `^0.3.0`; releases are tagged and published automatically.

## Models
Agents run on whatever model you've selected (`inherit`); validators use Haiku to save tokens. To pin a heavy agent to a specific model, edit its frontmatter in a fork.

## Docs
[Install](docs/INSTALL.md) · [Commands](docs/COMMANDS.md) · [Architecture](docs/ARCHITECTURE.md) · [Troubleshooting](docs/TROUBLESHOOTING.md) · [Contributing](CONTRIBUTING.md) · [Changelog](CHANGELOG.md)

## Repo layout
```
.claude-plugin/marketplace.json   catalog (bundle + 6 modules)
plugins/zaraat-dost/              bundle: help · doctor · setup · session banner
plugins/zd-*/                     modules: agents/ skills/ hooks/ scripts/ output-styles/
templates/                        .claude/settings.json · CLAUDE.md · MCP example
docs/  scripts/  install.sh  install.ps1
```

MIT © 2026 Zaraat Dost (Pvt.) Limited
