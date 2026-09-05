---
name: postgis-conventions
description: Conventions for spatial tables — naming, SRID, indexes, area calculation, ingest validation, safe migrations — for Postgres/PostGIS with equivalents for SQL Server and GeoPackage. Apply whenever writing SQL, migrations or ORM models that touch geometry columns.
---

# Spatial table conventions

- Geometry column is `geom`, typed + SRID-constrained: `geom geometry(MultiPolygon, 4326)`. (.NET/EF Core: `public MultiPolygon Geom { get; set; }` + `HasColumnType("geometry(MultiPolygon,4326)")`.)
- Every geometry column gets a spatial index in the same migration: `CREATE INDEX ix_<table>_geom ON <table> USING GIST (geom);` (EF: `.HasIndex(x => x.Geom).HasMethod("gist")`; SQL Server: `CREATE SPATIAL INDEX`).
- Naming: `<domain>_<thing>[_<season>]` snake_case — `parcels_<area>`, `crop_sugarcane_2026`, `admin_tehsil`, `flood_extent_2025`.
- Mandatory columns on feature tables: `id` PK, `source_id` (original ID), `source` (gee-export | model-vN | survey | kml), `created_at`, `updated_at`.
- Area: `area_ha numeric GENERATED ALWAYS AS (ST_Area(ST_Transform(geom, 32642))/10000) STORED` — never `ST_Area` on 4326 (see `pakistan-crs` for zone choice).
- Ingest: `ST_Multi(ST_MakeValid(ST_Transform(geom, 4326)))`; reject `NOT ST_IsValid(geom) OR ST_IsEmpty(geom)`.
- Dashboards read from views/materialized views refreshed by the ingest job.
- Display copies: `ST_SimplifyPreserveTopology(geom, tol)` into `geom_simple` or a `_display` view.
- Destructive statements need a `_bak_YYYYMMDD` copy and explicit approval (zd-core hooks enforce the prompt).
- Credentials: env vars / `appsettings` + user-secrets / `.env` — never in code or chat.
