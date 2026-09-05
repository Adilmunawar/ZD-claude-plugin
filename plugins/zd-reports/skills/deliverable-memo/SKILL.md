---
name: deliverable-memo
description: Write the memo/email that accompanies a geospatial deliverable to a client or operations team — what's included, how it was produced, QA results, how to open it, caveats. Use whenever a layer or report is being handed over.
disable-model-invocation: true
---

Produce `deliverables/<project>/README_<date>.md` (and offer a .docx via the docx skill if the recipient is non-technical):

1. **What's included** — file list with feature counts, CRS, total area, date.
2. **Method** — 3–5 sentences: source imagery + dates, model/version, post-processing, resolution.
3. **QA** — paste the `geo-data-qa` summary line + key numbers.
4. **How to open** — QGIS/ArcGIS/ArcMap steps (shapefile needs all sidecar files; GeoJSON drag-and-drop), field dictionary table (name → meaning → units).
5. **Caveats** — known limits (small fields, cloud gaps, boundary accuracy ± m).
6. **Contact / next update**.
Keep to one page. Plain language for the ops audience.
