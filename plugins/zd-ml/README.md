# zd-ml

| Component | Purpose |
|---|---|
| `seg-trainer` (agent) | Training/fine-tuning/eval engineer for satellite segmentation |
| `seg-preflight` (auto) | 10-point bug checklist (checkpoint keys, shared dataset refs, split leakage…) |
| `train-template` (auto) | Script structure with resume, early stopping, cosine LR, AMP |
| `colab-ram-safe` (auto) | OOM/timeout-proof notebook patterns |
| `/zd-ml:model-card` | HF-compatible model card |
