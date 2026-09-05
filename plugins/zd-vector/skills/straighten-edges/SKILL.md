---
name: straighten-edges
description: Remove staircase edges from raster-derived parcels with a junction graph and deviation test, preserving shared boundaries.
---

# Junction-graph straightening (topology preserving)

Simplifying polygons one at a time breaks shared edges. Work on the edge graph instead.

1. **Build the graph.** `edges = unary_union(gdf.boundary)`; `shapely.get_parts(edges)` yields each shared segment once. Load into a NetworkX undirected graph: nodes = segment endpoints (rounded to grid, e.g. 0.01 m in UTM), edge attribute = the LineString.
2. **Find junctions.** Nodes with degree > 2 (three or more parcels meet) and degree 1 (dangles). Paths between consecutive junctions are the units to straighten.
3. **Deviation test.** For each junction-to-junction path, compute the maximum perpendicular distance of any vertex from the chord joining the path's endpoints. If `max_deviation <= DEVIATION_THRESHOLD` (2.5 m works at 0.3 m imagery; use 1–2 px at Sentinel scale) replace the path with the chord; otherwise keep it, or apply `simplify(tol, preserve_topology=True)` only to that path.
4. **Rebuild faces.** `polygonize` the straightened edges; reassign attributes from the original parcels by largest intersection area.
5. **Verify.** Face count ≈ parcel count (differences are slivers to merge), overlaps 0, total area drift < 1 %. Report all three.

Optional orthogonalisation for field layers: snap path headings within ±10° of the local dominant orientation (from a histogram of edge azimuths in UTM) to that orientation before rebuilding.

Raster-first alternative when the mask still exists: `cv2.findContours` + `approxPolyDP(epsilon≈1.5 px)` per component label, then steps 1–5.
