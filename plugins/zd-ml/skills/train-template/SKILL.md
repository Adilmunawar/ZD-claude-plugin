---
name: train-template
description: Structure for a PyTorch segmentation training script: resume, early stopping, cosine LR, AMP, full-state checkpoints, tiled inference.
---

# Training script template (structure, not boilerplate to paste blindly)

```
config (yaml/argparse) → seed → build datasets (split by ID, deepcopy transforms)
→ model (smp.Unet / smp.UnetPlusPlus / SegFormer via transformers; encoder e.g. tu-hrnet_w48, resnet34)
→ loss (Dice+CE or focal; ignore_index for nodata) → AdamW → CosineAnnealingWarmRestarts or OneCycle
→ AMP (torch.autocast + GradScaler) → loop:
     train epoch → val (per-class IoU/F1) → log CSV/JSONL → save last.pt every epoch
     → save best.pt on val mIoU improvement → early stop after N epochs w/o improvement
→ final: evaluate best.pt on test, write model_card.md, export ONNX (optional)
```

Checkpoint dict: `{'epoch', 'model_state_dict', 'optimizer_state_dict', 'scheduler_state_dict', 'scaler_state_dict', 'best_metric', 'config', 'git_sha'}`. `--resume path` restores all of it.

Fine-tuning: lower LR for encoder (10×), unfreeze decoder first for 1–2 epochs, then all; keep the original normalisation stats.

Inference on large rasters: tile with overlap (e.g. 512 px, 64 overlap), predict, blend by centre-weighted mask, write with rasterio windows to a COG (`driver='COG'`); then hand off to zd-vector.
