---
name: colab-ram-safe
description: Patterns for RAM-limited notebooks: windowed reads, patch shards, progress files, Drive checkpoints.
---

- Mount Drive once; keep datasets on Drive as COGs/parquet; copy the *current* tile to `/content` only.
- Never load a full raster: `rasterio.open` + `read(window=...)`; for GEE exports use `Export.image.toDrive` with `fileDimensions` so tiles are ≤ ~2 GB.
- Extract patches to `.npy`/`.zarr` shards on disk with an index CSV; the Dataset reads shards lazily.
- Checkpoint every N tiles to a JSON progress file; make every loop resumable from it.
- Free memory: `del arr; gc.collect(); torch.cuda.empty_cache()` after each tile; watch `psutil.virtual_memory()`.
- Long jobs: run as a `.py` with `nohup` inside Colab, log to a file on Drive, poll from a cell.
- Session timeout insurance: save `last.pt` to Drive every epoch; store the config next to it.
