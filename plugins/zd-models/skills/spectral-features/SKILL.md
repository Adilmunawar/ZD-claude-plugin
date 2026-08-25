---
name: spectral-features
paths: ["**/Xgboost/**", "**/GEE_fetch*.py", "**/*feature*.py"]
description: Per-parcel Sentinel-1/2 feature matrix from Earth Engine: 15-day composites, band and index set, chunked reduceRegions, batch parquet, resume.
---

# Per-parcel feature matrix (Earth Engine)

Constants: `PERIOD_DAYS=15`, `TARGET_YEAR`, `HISTORY_YEARS_BACK=1`, `CHUNK_SIZE=400` parcels per request, `MAX_WORKERS=12–16`, `SCALE=10`, `TILE_SCALE=8`, `CLOUD_PCT_MAX=80`.

Bands: optical `B2 B3 B4 B5 B6 B7 B8 B8A B11 B12`; radar `VV VH` (dB). Indices: `NDVI LSWI EVI SAVI IRECI REIP NDBI BSI NDWI MNDWI`.

1. **Inputs.** Parcels zip/GPKG → GeoDataFrame in EPSG:4326 with a stable `parcel_uid`. Simplify to ≤ 5 m before upload to keep request payloads small (see `zd-gee:gee-export`).
2. **Periods.** Split `[TARGET_YEAR − HISTORY_YEARS_BACK, TARGET_YEAR]` into `PERIOD_DAYS` windows. For each: S2 SR harmonized, cloud-masked (SCL + probability), median; S1 GRD IW VV/VH mean in dB. Name bands `<band>_<periodIndex>`.
3. **Extraction.** For each chunk of `CHUNK_SIZE` parcels: `ee.FeatureCollection` from the chunk → `image.reduceRegions(mean, scale=SCALE, tileScale=TILE_SCALE)` → `getInfo` (small) or `Export.table.toDrive` (large). Threads = `MAX_WORKERS`. Write `batches/batch_<i>.parquet`; skip existing batches on resume.
4. **Assemble.** Concatenate batches → `feature_matrix.parquet`; validate: one row per `parcel_uid`, expected column count = (bands + indices) × periods (+ radar), null share per column < 30 % or flag the period as cloudy.
5. **Anomalies.** Fit `IsolationForest(contamination≈0.02)` on the matrix; drop or flag outliers before training/inference (`landuse-classify`).

Failure modes: payload too large (simplify or upload as asset), `Too many concurrent aggregations` (lower `MAX_WORKERS`), empty periods in monsoon (allow historical fallback or mark null), mixed CRS in inputs (reject).
