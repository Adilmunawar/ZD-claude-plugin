---
name: raster-to-polygons
description: RAM-safe conversion of large classification or boundary rasters to polygons — tiling with overlap, connected components, merging across tile seams, min-area filtering. Apply for any raster→vector step on rasters larger than a few thousand pixels per side.
---

# Raster → polygons, tile-safe

Pattern (Python / rasterio / shapely / geopandas):
1. Open raster; choose tile size 2048–4096 px with 64–128 px overlap. Iterate `rasterio.windows.Window`.
2. Per tile: read band → binarise/select class → (optional) `scipy.ndimage.label` or `cv2.connectedComponents` → `rasterio.features.shapes(mask, transform=window_transform)` → shapely polygons with class id.
3. Write each tile's polygons to a temp GeoPackage/parquet (`gpd.to_parquet`) — never accumulate in a Python list.
4. Merge: read all tiles, `gdf.dissolve(by='class')` is too slow at scale → instead union only polygons touching tile borders: select features whose bounds intersect a seam buffer, `unary_union` those, replace, keep the rest.
5. Filter: drop features `< min_area_ha` (compute area in UTM), drop slivers (area/perimeter² ratio < 0.01).
6. `make_valid`, cast to MultiPolygon, write GeoPackage; then `topology-repair`.

For boundary (edge) masks: invert and flood-fill (`cv2.floodFill` / `ndimage.label` on `~boundary`) to get parcel interiors, then polygonise interiors — not the boundary lines. Thin boundaries first (`skimage.morphology.skeletonize`) only if edges are >3 px thick.

Checkpoint: write a `progress.json` with the last completed tile index so a crashed run resumes.

Reference implementation: `scripts/raster_to_polygons.py` in this plugin (`python "${CLAUDE_PLUGIN_ROOT}/scripts/raster_to_polygons.py" --help`).
