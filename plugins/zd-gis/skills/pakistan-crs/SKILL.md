---
name: pakistan-crs
description: Which CRS to use for Punjab/Sindh (4326 storage, UTM 42N/43N for area) and how to reproject. Apply to area, distance, buffer, raster alignment or wrong-location bugs.
---

# CRS rules (Pakistan)

| Purpose | CRS | Notes |
|---|---|---|
| Storage, exchange, delivery | EPSG:4326 | Degrees — never compute area/distance here |
| Area/buffer/distance — Sindh, west & central Punjab | EPSG:32642 (UTM 42N) | lon 66–72 |
| Area/buffer/distance — east Punjab (Lahore, Sialkot, east Bahawalpur) | EPSG:32643 (UTM 43N) | lon 72–78 |
| Web maps / tiles / quick raster morphology | EPSG:3857 | ok for closing gaps, wrong for area |
| Sentinel-2 native | UTM 42N/43N | match zone before mosaicking |

- Check `gdf.crs` (or NTS `SRID`) first. `None`/0 is a bug: infer from bounds, then `set_crs` — never `to_crs` on unlabeled data.
- `set_crs` labels; `to_crs` transforms. Confusing them puts layers in the ocean.
- Compute area once in UTM, store it, output in 4326.
- Rasters: `rasterio.warp.reproject` to the reference grid before pixel-wise ops.
- KML/KMZ is 4326 with Z; `force_2d` before writing shapefiles.
- Sanity bounds for Pakistan in 4326: lon 60–78, lat 23–38.
