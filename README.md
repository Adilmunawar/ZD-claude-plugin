<div align="center">

# Claude Plugins for Zaraat Dost

Agents, skills and guardrails for agricultural geospatial engineering in [Claude Code](https://docs.claude.com/en/docs/claude-code/overview).

[![validate](https://github.com/adilmunawar/ZD-claude-plugin/actions/workflows/validate.yml/badge.svg)](https://github.com/adilmunawar/ZD-claude-plugin/actions/workflows/validate.yml)
[![release](https://img.shields.io/github/v/release/adilmunawar/ZD-claude-plugin?label=release)](https://github.com/adilmunawar/ZD-claude-plugin/releases)
[![license](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

</div>

## Quick start

```
/plugin marketplace add adilmunawar/ZD-claude-plugin
/plugin install zaraat-dost@zaraatdost
```

Then, inside any project: `/zaraat-dost:doctor` → `/zaraat-dost:setup` → `/zaraat-dost:help`.

Shell installers: PowerShell `irm https://raw.githubusercontent.com/adilmunawar/ZD-claude-plugin/main/install.ps1 | iex` · bash `bash <(curl -fsSL https://raw.githubusercontent.com/adilmunawar/ZD-claude-plugin/main/install.sh)`. More in [docs/INSTALL.md](docs/INSTALL.md).

## What it is

Zaraat Dost builds satellite-derived cadastral and crop intelligence for Punjab and Sindh: a boundary-detection and land-use pipeline, a Next.js geospatial dashboard on Firebase and Earth Engine, a farmer-facing mobile app, and client deliverables. This repository packages how that work is done — conventions, pipeline constants, data models, guardrails and deployment profiles — so every engineer's Claude Code session starts with the same knowledge.

One install (`zaraat-dost`) brings in fourteen modules. Each also installs on its own.

| Module | One line | Docs |
|---|---|---|
| zd-core | Guardrail hooks, secrets audit, stack detection, onboarding, hand-over | [README](plugins/zd-core/README.md) |
| zd-gis | Spatial databases (PostGIS, SQL Server, GeoPackage) and dashboards, Python or .NET | [README](plugins/zd-gis/README.md) |
| zd-vector | Raster → parcel vectors: polygonise, repair topology, straighten, subtract roads | [README](plugins/zd-vector/README.md) |
| zd-models | The cadastral and land-use pipeline end to end, with its stage constants | [README](plugins/zd-models/README.md) |
| zd-ml | Satellite segmentation training, pre-flight bug checks, model cards | [README](plugins/zd-ml/README.md) |
| zd-gee | Earth Engine: auth, export limits, composites, time series, harvest detection | [README](plugins/zd-gee/README.md) |
| zd-agis | The Next.js / Firebase / Earth Engine dashboard and its inference backend | [README](plugins/zd-agis/README.md) |
| zd-mobile | The Expo farmer app: RTL i18n, API contract, secure storage, releases | [README](plugins/zd-mobile/README.md) |
| zd-deploy | Local vs cloud profiles: Firebase App Hosting, Vercel, HF Spaces, EAS, Docker, AWS | [README](plugins/zd-deploy/README.md) |
| zd-quality | Code review, conventional commits, PR descriptions, changelog, ADRs, tech debt | [README](plugins/zd-quality/README.md) |
| zd-security | Security review, dependency audit, repository hardening | [README](plugins/zd-security/README.md) |
| zd-ops | Incidents, postmortems, runbooks, observability, on-call hand-over | [README](plugins/zd-ops/README.md) |
| zd-usage | Usage monitoring: session ledger, reports by project/model/week, budgets, team export | [README](plugins/zd-usage/README.md) |
| zd-reports | Deliverable memos, harvest reports, layer metadata | [README](plugins/zd-reports/README.md) |

The complete list of commands and agents, generated from the sources: [docs/COMMANDS.md](docs/COMMANDS.md).

## How it behaves

- **Detects before it acts.** Agents identify the stack (Python, .NET, Next.js, Expo; PostGIS, SQL Server, Firestore, GeoPackage) and ask when unsure.
- **Read-only where it should be.** `stack-analyst`, `db-analyst`, `geo-data-qa`, `code-reviewer`, `security-reviewer` cannot edit files.
- **Guardrails in code.** Node hooks block destructive shell, SQL, git, EF Core, Firestore and S3 commands and refuse to write credentials. Same behaviour on Windows, macOS and Linux; unit-tested; no dependencies.
- **Keeps the main conversation clean.** Report commands run in a forked context and return a summary plus the written file; product-specific skills declare `paths` so they load only when matching files are touched.
- **Measures itself.** A private ledger of every session; `/zd-usage:report` by project, model, day or week; weekly budgets with a session-start warning; team CSV merge. Skill and agent descriptions are kept short so the bundle costs about 3k tokens per session.
- **Upgrades itself.** A session-start check announces new releases; `/zaraat-dost:upgrade` updates every module and applies migration notes.
- **Rolls out at any scale.** Per-repository settings, per-machine managed settings, or account-level pinning — [docs/GOVERNANCE.md](docs/GOVERNANCE.md).

## Verified

Every release is exercised against the real Claude Code CLI before it is tagged ([docs/VERIFICATION.md](docs/VERIFICATION.md)): official validator, marketplace add, bundle install with dependency resolution, component inventory, hook execution as Claude Code performs it, a simulated upgrade, unit and structure tests, and a secrets audit of this repository.

Context cost: about 3k tokens of skill and agent descriptions per session for the whole bundle (down from 5k in 0.6.0 after trimming every description) (`claude plugin details <module>@zaraatdost` shows each module's figure). Install only the modules a project needs when that matters; product-specific skills additionally declare `paths` so they stay dormant until matching files are touched (check with `/context` in a session).

## Development

```
bash scripts/validate.sh        # manifests, hook syntax, node + python tests, docs drift, official validator
python3 scripts/gen-docs.py     # regenerate docs/COMMANDS.md
```

[Contributing](CONTRIBUTING.md) · [Architecture](docs/ARCHITECTURE.md) · [Upgrading](docs/UPGRADING.md) · [Troubleshooting](docs/TROUBLESHOOTING.md) · [Security policy](SECURITY.md) · [Changelog](CHANGELOG.md)

## Layout

```
.claude-plugin/marketplace.json   catalog: bundle + 14 modules
plugins/zaraat-dost/              bundle: help · doctor · setup · upgrade · workstation · standards
plugins/zd-*/                     modules: agents/  skills/<name>/SKILL.md  hooks/  scripts/  templates/
templates/                        settings.json · managed-settings.json · CLAUDE.md · repo-standards/
tests/  docs/  scripts/           tests, documentation, validation and doc generation
install.sh · install.ps1          one-line installers
```

MIT © 2026 Zaraat Dost (Pvt.) Limited
