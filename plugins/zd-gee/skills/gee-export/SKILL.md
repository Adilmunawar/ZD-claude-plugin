---
name: gee-export
description: Fixes for Earth Engine limits: payload size, user memory, too many elements, timeouts, task queue, Drive quota.
---

| Problem | Fix |
|---|---|
| Request payload size exceeds limit (large geometry uploaded from client) | Upload the vector as an EE asset (`earthengine upload table`) and reference by asset id; or `simplify(maxError=10–50 m)` and `ee.Geometry(..., geodesic=False)` before sending |
| Too many elements / user memory | Use `Export.table.toDrive` instead of `getInfo`; `reduceRegions` with `tileScale=4–16`; split AOI into a grid (`ee.FeatureCollection.randomPoints` or `coveringGrid`) and export per cell |
| Image export too large | `Export.image.toDrive(..., scale=10, maxPixels=1e13, fileDimensions=[4096,4096], fileFormat='GeoTIFF', formatOptions={'cloudOptimized': True})`; export per tile if > ~10 GB |
| Computation timed out | Move heavy reductions server-side into the export; avoid `.map` with client-side `getInfo` inside |
| Task queue full | Cap at ~ 250 pending; poll `ee.batch.Task.list()` and submit in batches |
| Drive quota | Export to Cloud Storage (`toCloudStorage`) for province-scale runs |

Always print task ids and keep a `tasks.csv` (id, description, status) to resume/monitor.
