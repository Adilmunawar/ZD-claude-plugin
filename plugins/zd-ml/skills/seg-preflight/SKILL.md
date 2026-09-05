---
name: seg-preflight
description: Pre-flight checklist that catches the common bugs in satellite segmentation pipelines — checkpoint format mismatches, shared dataset references in augmentation, split leakage, CRS/nodata handling, class imbalance. Apply before any training or fine-tuning run and when a model "trains but predicts garbage".
---

# Segmentation pre-flight

| # | Check | How |
|---|---|---|
| 1 | Checkpoint format | `torch.load(..., map_location='cpu')` → is it a dict with `model_state_dict` or a bare state_dict? Strip `module.` prefixes from DataParallel; match `smp`/`timm` key names; print missing/unexpected keys with `strict=False` and fail if > 0 unexpected |
| 2 | Dataset object sharing | Assert `id(train_ds.transform) != id(val_ds.transform)` and that split lists are copies (`list(...)` / `copy.deepcopy`) — shared references leak train augmentation into val |
| 3 | Split leakage | Split by parcel/tile ID; `assert not set(train_ids) & set(val_ids)`; check spatial overlap of tile bounds across splits with a GeoDataFrame `sjoin` |
| 4 | Label alignment | Image and mask share CRS, transform, shape; nodata pixels masked out of the loss (`ignore_index`) |
| 5 | Class balance | Print pixel share per class; use weighted CE / Dice+CE / focal when minority class < 5 % |
| 6 | Normalisation | Per-band mean/std computed on train only; Sentinel-2 reflectance scaled 0–1 (÷10000); SAR dB clipped (-25..0) |
| 7 | Patch extraction | Stride < patch size for training only; inference uses overlap + centre-crop blending |
| 8 | Reproducibility | Seed torch/numpy/random; `cudnn.deterministic` for eval; log git SHA and config |
| 9 | Resume path | Kill the run after 1 epoch, resume, assert epoch counter and LR continue |
| 10 | Eval metric | Per-class IoU/F1 on the *full* val set at native resolution, not on patches |
