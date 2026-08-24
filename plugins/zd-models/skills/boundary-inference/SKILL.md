---
name: boundary-inference
paths: ["**/HRNET*/**", "**/inference*.py", "**/Inference*.py"]
description: Chunked low-RAM boundary model inference over an AOI from XYZ tiles: tile cache, patch scan, Hanning blending, hysteresis, merged COG.
---

# Boundary inference over an AOI

Reference constants (adjust per model; record any change):
`ZOOM=19`, `TILE_SIZE=256`, `CHUNK_SIZE_M=5000`, `PATCH_SIZE=512`, `OVERLAP=256`, `PROCESS_BLOCK=1024`, `GPU_BATCH=8`, `THRESHOLD=0.55`, hysteresis `HYST_LOW=0.35`, encoder `tu-hrnet_w48` (segmentation_models_pytorch U-Net).

Stages
1. **AOI → chunks.** Read the AOI GeoJSON, reproject to EPSG:3857, split into `CHUNK_SIZE_M` squares. One output folder per chunk; skip chunks whose `prediction.tif` already exists (resume).
2. **Tile fetch.** `mercantile.tiles(bbox, ZOOM)`; download in batches (`DOWNLOAD_BATCH_SIZE`) with a thread pool into a global cache keyed by `z/x/y`; retry with backoff; never re-download a cached tile. Mosaic the chunk with rasterio (`merge` or manual paste) into a temporary GeoTIFF; flush after the chunk.
3. **Patch scan.** Slide `PATCH_SIZE` with `STRIDE = PATCH_SIZE − OVERLAP` in blocks of `PROCESS_BLOCK` with a halo of `OVERLAP`. Normalise with the training mean/std. Batch to GPU (`GPU_BATCH`), AMP on.
4. **Blend.** Multiply each patch probability by a 2-D Hanning window and accumulate into `sum` and `weight` arrays; divide at the end. This removes seam artefacts.
5. **Threshold.** Hysteresis: strong = `p ≥ THRESHOLD`, weak = `p ≥ HYST_LOW`; keep weak pixels connected to strong ones (`skimage.filters.apply_hysteresis_threshold`). Write `prediction_binary.tif` (uint8, LZW, tiled) per chunk.
6. **Merge chunks.** `rasterio.merge` with `method='max'` into `merged_prediction_binary.tif` as a COG. Then hand off to `zd-vector:raster-to-polygons` / `topology-repair`.

Checks: tile coverage 100 % (count expected vs cached), no all-zero chunks unless outside AOI, prediction extent equals AOI bounds ± one tile.
Weights: `hf_hub_download(repo_id=os.environ["ZD_BOUNDARY_MODEL_REPO"], filename="best.pth", token=os.environ.get("HF_TOKEN"))`; cache locally under `models/`.
