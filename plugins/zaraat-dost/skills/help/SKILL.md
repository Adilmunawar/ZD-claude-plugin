---
name: help
description: Show every Zaraat Dost command and agent, grouped by module, with one-line usage. Use when the user asks what the toolkit can do or how to run something.
disable-model-invocation: true
---

Print this reference (keep the grouping; add nothing else unless asked). If an argument is given, show only that module or command with a 3-line example.

**Setup** — `/zaraat-dost:doctor` check environment · `/zaraat-dost:setup` configure this repo · `/zd-core:onboard` write CLAUDE.md · `/zd-core:handoff` session hand-over

**Study** — agent `stack-analyst` map a codebase · agent `db-analyst` study any database → docs/DATABASE.md · `/zd-gis:study-dashboard` audit a dashboard → docs/DASHBOARD.md

**GIS & dashboards** — agent `gis-dashboard-manager` build/fix DB, ETL, layers, dashboards (Python or .NET) · `/zd-gis:new-layer` publish a layer · `/zd-gis:export-deliverable` shapefile+GeoJSON · `/zd-gis:qa-vector` validate a file · agent `geo-data-qa`

**Vector** — agent `vector-engineer` raster→parcels pipeline · `/zd-vector:gap-analysis` missing coverage

**ML** — agent `seg-trainer` train/fine-tune/eval segmentation · `/zd-ml:model-card`

**Earth Engine** — `/zd-gee:ndvi-timeseries` per-parcel index series · `/zd-gee:harvest-detect` harvest dates

**Reports** — `/zd-reports:deliverable-memo` · `/zd-reports:harvest-report` · `/zd-reports:layer-metadata`

Background knowledge applied automatically: stack-detect, postgis-conventions, pakistan-crs, study-db, raster-to-polygons, topology-repair, straighten-edges, road-subtract, seg-preflight, train-template, colab-ram-safe, gee-auth, gee-export, sentinel-composite. Output style: `/output-style zd-brief`.
