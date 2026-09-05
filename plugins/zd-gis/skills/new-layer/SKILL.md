---
name: new-layer
disable-model-invocation: true
argument-hint: "<layer-name> [source]"
description: Publish a map layer end to end: table, display view, tile service, dashboard config, legend, smoke test.
---

Delegate to `gis-dashboard-manager` with this checklist and require a done/remaining report:

1. Source validated (`geo-data-qa`) and loaded per `postgis-conventions`.
2. Display view/materialized view with simplified geometry.
3. Layer registered in the tile/feature service the repo uses (discover it; static GeoJSON endpoint if none).
4. Dashboard layer config: id, label, source, style (reuse legend config), zoom range, popup fields. For .NET map pages, add the layer in the Razor/Blazor component and API endpoint; for Python, in the app's layer registry.
5. Legend + metadata (source, season, CRS, model version, resolution).
6. Smoke test: loads, toggles, popup works, no console/network errors.
