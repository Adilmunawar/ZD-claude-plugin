---
name: road-subtract
description: Subtract OSM/Overture road, canal and rail buffers from parcels; fix gap-fill edge bleeding.
---

# Road / canal subtraction

1. Fetch linework for the AOI bbox: OSM Overpass (`highway=*`, `waterway=canal|drain`, `railway=*`), or Overture `transportation` segments (parquet via DuckDB/`overturemaps` CLI). Cache to `data/ref/roads_<aoi>.gpkg`.
2. Buffer in UTM by class: motorway/trunk 12 m, primary 8 m, secondary/tertiary 5 m, track/unclassified 3 m, canal 6 m, rail 8 m. Make the table configurable.
3. `gdf.overlay(roads_buf, how='difference')` in tiles if > 50k parcels; then `explode` and drop pieces < 0.02 ha or thinness < 0.05 (road remnants).
4. Re-run `topology-repair`; report parcels touched, area removed (ha), pieces dropped.

Gap-fill edge bleeding: if the gap-fill was Voronoi-based, run road subtraction *after* Voronoi and clip Voronoi cells to a `unary_union(parcels).buffer(max_gap)` envelope so cells don't extend into non-field land.
