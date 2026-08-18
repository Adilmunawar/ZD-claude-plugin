---
name: new-tool
disable-model-invocation: true
argument-hint: "<tool-name> <purpose>"
description: Scaffold a new AGIS dashboard tool: page, client component, API route, sidebar entry, worker stub.
---

Given a tool name and one sentence of purpose:
1. Create `src/app/dashboard/<slug>/page.tsx` (server wrapper, metadata title) and `src/components/gis/<Pascal>Client.tsx` (`'use client'`, dynamic Leaflet import `ssr:false`, `GisControlBar`, `MapHeader`, toast on success/error, loading state).
2. If it calls Earth Engine: `src/app/api/gee/<slug>/route.ts` per `gee-api-routes`. If it needs heavy geometry: `public/workers/<slug>Worker.js` per `pyodide-workers`.
3. Add the sidebar/nav entry where the other tools are registered; reuse the icon set (lucide-react).
4. Types in `src/types/`; no `any` in exported signatures.
5. `npm run typecheck && npm run lint`; open the page locally and exercise one happy path and one error path. Report file list and what was verified.
