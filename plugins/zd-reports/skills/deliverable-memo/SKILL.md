---
name: deliverable-memo
disable-model-invocation: true
argument-hint: "<deliverable-dir>"
description: One-page hand-over note for a geospatial deliverable: contents, method, QA, how to open, caveats.
---

Produce `deliverables/<project>/README_<date>.md` (and offer a .docx via the docx skill if the recipient is non-technical):

1. **What's included** — file list with feature counts, CRS, total area, date.
2. **Method** — 3–5 sentences: source imagery + dates, model/version, post-processing, resolution.
3. **QA** — paste the `geo-data-qa` summary line + key numbers.
4. **How to open** — QGIS/ArcGIS/ArcMap steps (shapefile needs all sidecar files; GeoJSON drag-and-drop), field dictionary table (name → meaning → units).
5. **Caveats** — known limits (small fields, cloud gaps, boundary accuracy ± m).
6. **Contact / next update**.
Keep to one page. Plain language for the ops audience.
