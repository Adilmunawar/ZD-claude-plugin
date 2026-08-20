---
name: dockerize
disable-model-invocation: true
argument-hint: "<service-dir>"
description: Production Dockerfile and compose for Next.js, Flask/GDAL, .NET or pipeline workers.
---

- Next.js: `output: 'standalone'`; multi-stage (deps → build → runner, `node:20-alpine`), copy `.next/standalone` + `static`, `USER node`, `HEALTHCHECK` on `/`.
- Flask + GDAL/GeoPandas: base `python:3.11-slim` + `gdal-bin libgdal-dev` or `osgeo/gdal` image; `pip install --no-cache-dir`; gunicorn with `--workers 2 --threads 4 --timeout 600`; `HEALTHCHECK` on `/health`.
- .NET: `mcr.microsoft.com/dotnet/sdk:8.0` build → `aspnet:8.0` runtime; `ASPNETCORE_URLS=http://+:8080`; non-root; health on `/health`.
- Pipeline worker: CUDA base if GPU; mount `working_directory`; entrypoint runs one stage with `--resume`.
- Compose: services + a `postgis/postgis` DB with a named volume; `.env` referenced, never committed; same env names as production.
- Verify: image builds, container starts, health passes, size reported.
