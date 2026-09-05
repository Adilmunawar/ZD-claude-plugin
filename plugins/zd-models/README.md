# zd-models

The end-to-end cadastral digitisation and land-use classification pipeline as skills and one agent. Depends on zd-vector, zd-gee and zd-ml.

```
AOI ─► boundary-inference ─► zd-vector: raster-to-polygons ─► topology-repair ─► straighten-edges ─► road-subtract
    ─► sub-parcelling ─► spectral-features (Earth Engine) ─► landuse-classify ─► predictions.gpkg ─► zd-reports
```

| Component | Type | Purpose |
|---|---|---|
| `pipeline-engineer` | agent | Runs and extends stages; enforces resume, env-only credentials, counts at every stage |
| `boundary-inference` | skill | XYZ tiles → chunked HRNet inference → Hanning blending → hysteresis → merged COG |
| `spectral-features` | skill | 15-day S1/S2 composites → per-parcel features → batched parquet |
| `landuse-classify` | skill | XGBoost bundle, T-minus alignment, unified parcel/sub-parcel inference |
| `sub-parcelling` | skill | Split large/irregular parcels into analysis units |
| `sam2-boundaries` | skill | Zero-shot boundaries with SAM2, tiled with seam stitching |
| `/zd-models:script-to-package` | command | Turn a constants-at-top script into a configured, tested CLI |

Environment variables expected: `HF_TOKEN`, `ZD_BOUNDARY_MODEL_REPO`, `ZD_LANDUSE_MODEL_REPO`, `GEE_KEY_FILE` or `EE_BASE64_KEY`, `GEE_PROJECT`.
