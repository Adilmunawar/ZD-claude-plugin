---
name: ndvi-timeseries
disable-model-invocation: true
argument-hint: "<parcel-asset-or-file> <start> <end> [index]"
description: Per-parcel index time series from Sentinel-2, gap-filled and smoothed, exported as a table.
---

1. Inputs: parcel asset id, date range, index (NDVI default), step (5 days).
2. In GEE: cloud-masked S2 → index image per date → `reduceRegions(mean + count, scale=10, tileScale=8)` per date with `date` property → flatten → `Export.table.toDrive` (CSV) or `toAsset`. Drop observations with `count < 50 %` of parcel pixels.
3. Locally: pivot to parcel × date; interpolate gaps ≤ 20 days (linear), then Savitzky–Golay (window 5, order 2) or Whittaker smoothing; keep raw and smoothed columns.
4. Output `ndvi_ts_<aoi>_<range>.parquet` + a quick plot of 5 random parcels for sanity.
