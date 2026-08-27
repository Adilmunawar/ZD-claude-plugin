---
name: harvest-report
disable-model-invocation: true
argument-hint: "<harvest.gpkg> [docx|pptx]"
description: Client harvest progress report (docx/pptx) from harvest-detect outputs.
---

Input: `harvest_<aoi>_<season>.gpkg` + summary from `/zd-gee:harvest-detect`.

1. Compute: total parcels/area, harvested vs standing (count, ha, %), weekly harvest curve, top districts/tehsils, confidence breakdown.
2. Figures (matplotlib, saved PNG): harvest-progress line, bar by district, choropleth/map of harvest week (GeoPandas plot with basemap optional).
3. Document: use the docx skill (`/mnt/skills/public/docx`) or pptx skill for slides. Sections: Summary (5 bullets with numbers) → Progress → By area → Method (imagery, dates, thresholds) → Data quality & caveats → Appendix (field dictionary, file list).
4. Save to `deliverables/<project>/harvest_report_<date>.docx|pptx`; print path and the 5 summary bullets.
