---
name: model-card
description: Write a model card for a trained segmentation model (data, classes, metrics, limits) next to the checkpoint and for HuggingFace.
disable-model-invocation: true
---

Write `model_card.md` (HF-compatible YAML header + body):

- **Task / classes** (list with ids), **input** (sensor, bands, resolution, normalisation), **AOI & seasons** in training data, **label source** and count.
- **Architecture** (lib, encoder, params), **training** (epochs, LR schedule, loss, augmentation, hardware, time), **git SHA**.
- **Metrics**: per-class IoU/F1 table on val and test; boundary F1 if applicable; confusion matrix image path.
- **Known failure modes** (e.g. small fields < 0.2 ha, cloud shadow, mixed cropping), **intended use**, **not for**.
- **How to run inference** (3-line snippet) and **checkpoint format** (dict keys).
Then print the path. Push to HuggingFace only on explicit request.
