# <Project name>

<One paragraph: what this repo is (dashboard / pipeline / model), who uses it, where it runs.>

## Stack
- Database: <PostGIS 15 on ... / GeoPackage in data/>
- Dashboard: <ASP.NET Core + Leaflet / Blazor / Streamlit / Dash / ...>
- Tile/feature service: <pg_tileserv / GeoServer / none>
- Runtime: <.NET 8 / Python 3.11 conda env>; run with `<command>`
- Data root: `data/` (raw), `data/processed/`, `deliverables/`

## Conventions
- Follow the zd-* plugin skills (`stack-detect`, `postgis-conventions`, `pakistan-crs`).
- Storage CRS is EPSG:4326; area in EPSG:32642 unless stated.
- Never commit `.env`, `gee.json`, service-account keys, or files > 50 MB (use DVC / drive links).
- Deliverables go to `deliverables/<client>/<layer>_<YYYYMMDD>.{shp,geojson}` and must pass `/zd-gis:qa-vector`.

## How to run
```
<setup and run commands>
```

## Don'ts
- No schema changes to production tables without a migration file.
- No `DROP`/`TRUNCATE` without a `_bak_` copy and explicit approval.
