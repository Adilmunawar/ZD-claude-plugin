---
name: sam2-boundaries
paths: ["**/SAM*/**", "**/*sam*.py"]
description: Zero-shot field boundaries with SAM2: tiled inference, seam stitching, cleanup, GeoJSON, alignment.
---

Constants: `TILE_SIZE=1024`, `STRIDE=512`, `POINTS_PER_SIDE=32`, `POINTS_PER_BATCH=64`, `PRED_IOU_THRESH=0.80–0.88`, `STABILITY_SCORE_THRESH=0.82–0.90`, `MIN_MASK_REGION_AREA=50–200`, `EROSION_KERNEL=(3,3)`, `MIN_FIELD_AREA_PX=300`, `MAX_FIELD_AREA_PX=2e6`, stitching `STITCH_BAND=32 px`, `STITCH_MIN_TOUCH=12 px`, `STITCH_COLOR_THRESH=20 ΔE`.

1. Imagery: XYZ tiles at zoom 19 mosaicked to GeoTIFF in EPSG:3857 (same fetcher as `boundary-inference`).
2. Tiled AMG with overlap; masks get global ids via a union-find; masks crossing a seam merge only if they touch ≥ `STITCH_MIN_TOUCH` px and mean LAB colour difference < `STITCH_COLOR_THRESH`.
3. Cleanup: erosion, area filter, fill holes, smooth (`zd-vector:topology-repair`), then polygonise to GeoJSON.
4. Optional alignment: snap SAM polygons to an existing boundary layer within a tolerance; report matched / unmatched counts.
5. Scoring for a target crop: spectral filter (`spectral-features`) with a probability threshold (`0.40`) → `fields_scored.geojson`.
