---
name: straighten-edges
description: Remove staircase (pixel-step) edges from polygons derived from rasters while preserving shared boundaries between neighbouring parcels. Apply when polygons from rasterio.shapes look jagged or a client asks for clean field boundaries.
---

# Straighten staircase edges (topology-preserving)

Don't simplify polygons one by one — shared edges diverge and gaps/overlaps appear. Do it on the edge graph:

1. Build the planar edge set: `edges = unary_union(gdf.boundary)` → `shapely.get_parts(edges)` gives each shared segment once.
2. Simplify each edge: `simplify(tol, preserve_topology=True)` with `tol` ≈ 1–2× pixel size (e.g. 10–20 m for 10 m Sentinel), or `shapely.ops.substring`-based Visvalingam if available (`simplification` package).
3. Optionally orthogonalise: for edges with dominant 0°/90° orientation in the local UTM frame, fit line segments with `cv2.approxPolyDP` on the raster contour, or snap vertex angles to the nearest 90° when the deviation < 10°.
4. `polygonize(edges)` → new faces; reassign attributes from the original parcels by largest intersection area (`overlay` or `sjoin` + area sort).
5. Check: face count == parcel count (±slivers), overlaps 0, total area drift < 1 %.

Raster-first alternative when the mask is still available: `cv2.findContours` + `approxPolyDP(epsilon = 1.5 px)` on the *label image* per component, then the graph step above. Produces cleaner corners than vector-only simplification.
