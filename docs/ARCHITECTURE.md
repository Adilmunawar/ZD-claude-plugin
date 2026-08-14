# Architecture

## Modules and dependencies

```
zaraat-dost (bundle) ──depends on──▶ all modules

zd-core ◀── zd-deploy
zd-gee  ◀── zd-agis
zd-vector, zd-gee, zd-ml ◀── zd-models
zd-core ◀── zd-security
zd-deploy ◀── zd-ops
zd-gis, zd-mobile, zd-quality, zd-usage, zd-reports  (independent)
```

## Layers

| Layer | Modules | What lives there |
|---|---|---|
| Guardrails and workflow | zd-core | Node hooks, secrets audit, stack detection, onboarding, hand-over |
| Data and platform | zd-gis, zd-gee, zd-deploy | Spatial databases and dashboards, Earth Engine, hosting profiles |
| Domain pipeline | zd-vector, zd-models, zd-ml | Raster → parcels → features → classes; model training |
| Products | zd-agis, zd-mobile, zd-reports | The web dashboard, the farmer app, client deliverables |
| Engineering practice | zd-quality, zd-security, zd-ops, zd-usage | Review, commits, ADRs, security baseline, incidents and runbooks |

## Design rules

1. **Capability lives in modules; the bundle is only convenience.** Every module installs on its own and is versioned together with the others.
2. **Discovery before assumption.** Agents run `stack-detect` and print a stack summary before acting; unknown → ask.
3. **Read-only analysts are separate agents** (`stack-analyst`, `db-analyst`, `geo-data-qa`) with no Edit/Write tools.
4. **Guardrails are code, not prompts.** Destructive commands and credential writes are blocked by hook scripts that are unit-tested and dependency-free. Patterns are shared between the write guard and the audit so both agree.
5. **Commands vs background skills.** `disable-model-invocation: true` marks user-invoked commands; other skills are applied by Claude when relevant. `docs/COMMANDS.md` is generated from frontmatter and checked in CI.
6. **Nothing internal in this repository.** Conventions, constants and methods are documented; credentials, project ids, hostnames and client data are not. A test enforces this.
7. **Model policy.** `inherit` everywhere except cheap validators on `haiku`; pin models only in a fork.
