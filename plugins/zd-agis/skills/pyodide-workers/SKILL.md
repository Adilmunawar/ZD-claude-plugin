---
name: pyodide-workers
paths: ["public/workers/**", "src/workers/**"]
description: Browser-side GIS in Web Workers: Pyodide protocol, progress, memory limits, when to use pure JS.
---

- Worker files live in `public/workers/<name>Worker.js` and are loaded with `new Worker('/workers/<name>Worker.js')`.
- Pyodide: `importScripts(pyodide.js)`, `loadPyodide()`, `loadPackage(['pandas','geopandas','shapely'])` once, cached in a promise. First load is 20–40 s and ~150 MB — show a status message and reuse the worker across actions.
- Protocol: `postMessage({ action, payload })` in; `{ status: 'info'|'progress'|'done'|'error', message, data, pct }` out. Always end with `done` or `error`.
- Pass data as JSON strings via `pyodide.globals.set`; return results with `.toJs()` or JSON. Avoid transferring > 50 MB; chunk large feature collections.
- Use pure JS (`@turf/turf`, `shpjs`, `tokml`, `jszip`) when the operation is simple (bbox, area, union of a few polygons, shapefile parse) — no Pyodide cost.
- Memory: Pyodide workers cannot exceed browser tab limits; for province-scale layers send the job to the backend instead.
- Never import Firebase in a worker; the main thread persists results.
