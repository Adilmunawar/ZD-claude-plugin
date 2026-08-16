---
name: help
disable-model-invocation: true
argument-hint: "[module|command]"
description: List all toolkit commands and agents by module. Use when asked what the toolkit can do or how to run something.
effort: low
---

Print this reference. If `$ARGUMENTS` names a module or command, show only that part with a three-line example.

**Setup** · `/zaraat-dost:doctor` environment check · `/zaraat-dost:setup` configure this repo · `/zaraat-dost:upgrade` update the toolkit · `/zaraat-dost:workstation` set up a machine · `/zaraat-dost:standards` apply repo standards · `/zd-core:onboard` write CLAUDE.md · `/zd-core:handoff` session hand-over · `/zd-core:secrets-audit` find committed credentials

**Study** · agent `stack-analyst` codebase map · agent `db-analyst` database → `docs/DATABASE.md` · `/zd-gis:study-dashboard` · `/zd-agis:audit`

**GIS & dashboards** · agent `gis-dashboard-manager` · `/zd-gis:new-layer` · `/zd-gis:export-deliverable` · `/zd-gis:qa-vector` · agent `geo-data-qa`

**Pipeline** · agent `pipeline-engineer` (boundary inference → parcels → features → classification) · agent `vector-engineer` · `/zd-vector:gap-analysis` · `/zd-models:script-to-package`

**ML** · agent `seg-trainer` · `/zd-ml:model-card`

**Earth Engine** · `/zd-gee:ndvi-timeseries` · `/zd-gee:harvest-detect`

**Web (AGIS)** · agent `agis-engineer` · `/zd-agis:new-tool` · `/zd-agis:audit`

**Mobile** · agent `mobile-engineer` · `/zd-mobile:i18n-parity` · `/zd-mobile:release-checklist`

**Deploy** · agent `release-engineer` · `/zd-deploy:preflight` · `/zd-deploy:dockerize` · `/zd-deploy:aws-plan`

**Quality** · agent `code-reviewer` · `/zd-quality:pr-description` · `/zd-quality:changelog` · `/zd-quality:adr` · `/zd-quality:tech-debt`

**Security** · agent `security-reviewer` · `/zd-security:dependency-audit` · `/zd-security:harden-repo`

**Ops** · `/zd-ops:incident` · `/zd-ops:postmortem` · `/zd-ops:runbook` · `/zd-ops:oncall-handoff`

**Usage** · `/zd-usage:report` · `/zd-usage:budget` · `/zd-usage:team-report` · built-in `/usage`, `/cost`, `/skill-doctor`, `/context`

**Reports** · `/zd-reports:deliverable-memo` · `/zd-reports:harvest-report` · `/zd-reports:layer-metadata`

Background skills apply automatically (stack-detect, postgis-conventions, pakistan-crs, study-db, raster-to-polygons, topology-repair, straighten-edges, road-subtract, boundary-inference, spectral-features, landuse-classify, sub-parcelling, sam2-boundaries, seg-preflight, train-template, colab-ram-safe, gee-auth, gee-export, sentinel-composite, agis-architecture, cadastral-schema, gee-api-routes, pyodide-workers, inference-backend, app-rules, api-contract, deploy-profiles, review-standards, conventional-commits, security-review, observability, usage-hygiene). Output style: `/output-style zd-brief`.
