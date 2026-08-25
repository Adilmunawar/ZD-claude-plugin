---
name: sub-parcelling
paths: ["**/sub-parcel*.py", "**/subparcel*.py"]
description: Split large or irregular parcels into analysis units before feature extraction.
---

Constants: `MODE_LO_ACRE=0.85` (leave parcels below this alone), `MIN_RECT=0.85` (rectangularity = area / minimum-rotated-rectangle area), `LARGE_SPLIT_TARGET_ACRE=0.25`, `MAX_GRID_N=10`.

1. Compute area (UTM) and rectangularity per parcel.
2. Scheme: `< MODE_LO_ACRE` → keep; rectangular and larger → split along the minimum rotated rectangle axes into `nu × nv` cells targeting `LARGE_SPLIT_TARGET_ACRE`, capped at `MAX_GRID_N` per axis; irregular → split by grid in UTM then clip to the parcel.
3. Ids: `sub_uid = f"{parcel_uid}_{i}"`, `parent_uid = parcel_uid`; carry `KEEP_ATTRS` (land use, mauza, district, tehsil, layer).
4. Outputs: `subparcels.gpkg`, `subparcels_parents.gpkg`, optional zipped shapefile, `subdivision_summary.csv` (parents, children, mean child acres).
5. Check: union of children == parent within 0.1 %, no child < 0.05 acre.
