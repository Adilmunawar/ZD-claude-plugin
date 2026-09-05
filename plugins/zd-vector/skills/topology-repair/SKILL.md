---
name: topology-repair
description: Fix invalid geometries, overlaps, gaps and mixed geometry types in parcel layers while keeping shared edges. Apply after any polygonisation, simplification, or merge, and before export.
---

# Topology repair

Order matters:
1. `make_valid()` (shapely 2 / `ST_MakeValid`). Then drop empties and collections → keep only Polygon/MultiPolygon parts (`geom.geoms` filter), cast all to MultiPolygon. This fixes "mixed geometry type" export errors.
2. **Overlaps**: find with `gdf.sjoin(gdf, predicate='overlaps')`; for each pair assign the overlap to the larger parcel (`difference`) or split along the medial line if areas are similar. Re-check until 0.
3. **Gaps** between parcels that should touch: buffer-unbuffer (`buffer(tol).buffer(-tol)`) per polygon breaks sharing — instead, snap vertices with `shapely.snap(geom, neighbours, tol)` or build a planar graph: `unary_union` of all boundaries → `polygonize` → reassign attributes by largest-overlap join. This is the reliable way to get a clean shared-edge layer.
4. **Slivers**: area < min mapping unit or thinness (`4π·area/perimeter²`) < 0.05 → merge into the neighbour with the longest shared edge.
5. **Snap to grid** (`set_precision(geom, 0.5)` in metres) to stop floating-point re-overlaps.
6. Validate: invalid = 0, overlaps = 0, total area change < 0.5 % vs input. Report all three.

SQL equivalents: `ST_MakeValid`, `ST_CollectionExtract(geom, 3)`, `ST_Multi`, `ST_SnapToGrid`, `ST_Polygonize(ST_Union(ST_Boundary(geom)))`.
