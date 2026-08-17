# zd-agis

Conventions and tooling for the AGIS geospatial dashboard (Next.js 14 · Firebase · Earth Engine · Pyodide workers · Hugging Face Spaces backend). Depends on zd-gee.

| Component | Type | Purpose |
|---|---|---|
| `agis-engineer` | agent | Build and fix tools, routes, workers and the backend in the existing style |
| `agis-architecture` | skill | Directory layout, env vars, libraries, hosting |
| `cadastral-schema` | skill | Mauza/Parcel model, size limits, geohash, rules |
| `gee-api-routes` | skill | Server-side Earth Engine route patterns |
| `pyodide-workers` | skill | Browser-side GIS worker protocol |
| `inference-backend` | skill | Flask job protocol, telemetry, limits |
| `/zd-agis:new-tool` | command | Scaffold page + client + route (+ worker) |
| `/zd-agis:audit` | command | Security/performance audit → `docs/AGIS-AUDIT.md` |
