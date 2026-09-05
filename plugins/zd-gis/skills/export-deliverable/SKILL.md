---
name: export-deliverable
description: Produce a client-ready shapefile and GeoJSON from a layer, table or intermediate file. Use when the user says export, deliver, send to client, make shapefile, or final output.
disable-model-invocation: true
---

1. Load the layer (file, DB table, or in-memory). Confirm CRS; transform to EPSG:4326.
2. Clean: `make_valid`, drop empty/null geometries, `force_2d`; explode+dissolve on `source_id` only if multipart is unexpected.
3. Attributes: ≤10-char snake_case names for the shapefile (print the rename mapping), explicit dtypes, nulls only where the client schema requires.
4. Add `area_ha` (2 dp, computed in UTM 42N/43N) and `perim_m` for parcels.
5. Write `<name>_<YYYYMMDD>.shp` (+ `.cpg` UTF-8) and `<name>_<YYYYMMDD>.geojson` to `deliverables/<project>/`.
6. Run the `geo-data-qa` agent on both outputs.
7. Print feature count, total area, bounds, column list, paths. Don't zip or upload unless asked.
