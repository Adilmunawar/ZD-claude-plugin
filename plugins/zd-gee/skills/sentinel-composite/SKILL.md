---
name: sentinel-composite
description: Cloud-free Sentinel-2 and speckle-filtered Sentinel-1 composites and fused stacks for crop mapping.
---

- **S2**: `COPERNICUS/S2_SR_HARMONIZED`; mask with `s2cloudless` (`COPERNICUS/S2_CLOUD_PROBABILITY`, prob < 40) + SCL classes {3,8,9,10,11}; median composite per period (e.g. monthly or crop-stage windows); bands B2–B8, B8A, B11, B12; add NDVI, NDWI, EVI, NDRE. Scale to reflectance ÷10000.
- **S1**: `COPERNICUS/S1_GRD`, IW, VV+VH, one orbit direction per AOI; convert to dB, Lee/refined-Lee speckle filter (7×7), per-period mean; add VV/VH ratio.
- **Fusion**: reproject both to the S2 tile's UTM zone at 10 m (`reproject(crs, null, 10)`) before stacking; consistent band order documented in a `bands.json` exported alongside.
- **Time series**: for phenology/harvest, export per-parcel NDVI means every 5–10 days via `reduceRegions(mean, scale=10, tileScale=8)` → table export (see `ndvi-timeseries`).
- Punjab/Sindh sugarcane windows: planting Feb–Mar (spring) / Sep–Oct (autumn), harvest Nov–Apr; pick composites at 3–4 growth stages.
