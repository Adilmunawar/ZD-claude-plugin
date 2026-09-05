---
name: harvest-detect
description: Detect harvest events per parcel from NDVI (and optional S1 VH) time series — sudden drops after a mature plateau — and produce a harvest-date layer and summary. Use for sugarcane/wheat/rice harvest reporting.
disable-model-invocation: true
---

Input: parcel × date index table from `ndvi-timeseries`.

1. Per parcel on the smoothed series: find peak (mature plateau ≥ `ndvi_mature`, default 0.55 for sugarcane) sustained ≥ 20 days.
2. Harvest = first date after the plateau where NDVI drops by ≥ `drop` (default 0.25) within ≤ 15 days *and* stays below `post_max` (0.35) for ≥ 10 days. Optional S1: VH backscatter drop ≥ 2 dB in the same window raises confidence.
3. Confidence: high (both sensors), medium (NDVI only, clean series), low (gap > 20 days around the event). Flag parcels with no event as `unharvested` or `no-data`.
4. Outputs: `harvest_<aoi>_<season>.gpkg` (parcel id, harvest_date, confidence, peak_ndvi, drop), summary by district/week (count, area ha), and a Mermaid/Markdown table; hand to `zd-reports` for the client report.
5. Validate on any ground-truth dates available; report MAE in days.
