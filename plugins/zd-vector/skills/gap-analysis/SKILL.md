---
name: gap-analysis
disable-model-invocation: true
argument-hint: "<mapped.gpkg> <aoi-or-previous.gpkg>"
description: Compare a mapped parcel layer with an AOI or previous version: missing layer, coverage summary, added/removed/changed parcels.
---

Inputs: mapped layer A, AOI/reference layer B (or a second version A′). Work in UTM.

1. `missing = B.difference(unary_union(A))` → explode → drop < 0.05 ha → `missing.gpkg` with `area_ha`, `centroid_lon/lat`, nearest mapped parcel id (`sjoin_nearest`).
2. Summary table: AOI area, mapped area, missing area, % coverage, count of missing patches by size class (<0.5 ha, 0.5–5, >5), top-10 largest gaps with coordinates.
3. If comparing versions: also `added = A′ − A`, `removed = A − A′`, and per-parcel area change > 5 %.
4. Write `docs/coverage_<date>.md` with the table and a Mermaid pie of covered vs missing; print the paths.
