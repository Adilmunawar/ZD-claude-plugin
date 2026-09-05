---
name: layer-metadata
description: Generate a standard metadata sheet (ISO-lite) for a vector or raster layer — source, lineage, CRS, extent, fields, QA, licence — as JSON + Markdown. Use before publishing or delivering any layer.
disable-model-invocation: true
---

Inspect the layer (GeoPandas/rasterio/`ogrinfo`/`gdalinfo`) and write `<layer>.metadata.json` and `.md`:

`title, abstract, layer_type, geometry_type, crs, extent_4326, feature_count | pixel_size, resolution_m, temporal_coverage (start/end), sensor/source, processing_lineage (ordered steps + model versions), fields [{name,type,description,units}], qa {invalid, overlaps, min_area_ha, qa_date}, created_by, created_at, licence, contact`.
Ask only for values that can't be inferred (abstract, licence, contact). Keep both files next to the layer.
