---
name: agis-architecture
paths: ["src/**", "public/workers/**", "hf_space_backend/**", "next.config.*", "apphosting.yaml"]
description: Layout and conventions of the AGIS Next.js dashboard: routes, component layers, workers, backends, env vars.
---

# AGIS architecture

```
src/app/dashboard/<tool>/page.tsx      thin server page → renders <ToolClient/>
src/components/gis/<Tool>Client.tsx    'use client'; Leaflet/react-leaflet, controls, toasts
src/components/ui/*                    shadcn primitives (do not hand-roll buttons/dialogs)
src/app/api/gee/*/route.ts             server-side Earth Engine (tiles, analyze, timeseries, sar, dynamic-world)
src/app/api/predict, job_status/*, job_download/*   proxy to the inference backend (streams multipart)
src/lib/geeCore.ts                     initGEE(), layer builders, getMapUrl()
src/firebase/{init,config,provider}.ts, services/*, firestore/use-*.tsx
src/context/GisDataContext.tsx         shared GIS state (AOI, layers, selection)
src/types/gis-schema.ts                Mauza / Parcel metadata types
public/workers/*.js                    Pyodide (geopandas/shapely) and pure-JS workers: digitize, merge, roads, shapefile, export
hf_space_backend/app.py                Flask job queue, telemetry, land-use inference
```

Conventions
- Dev server `next dev --turbo -p 9002`; `npm run typecheck` is the gate.
- Env: `NEXT_PUBLIC_FIREBASE_*` (client), `EE_BASE64_KEY` (server; base64 of the service-account JSON), `HF_SPACE_URL`, `HF_TOKEN` (server only — never `NEXT_PUBLIC_`).
- Map libs: leaflet, leaflet-draw, @turf/turf, shpjs/shapefile, tokml/togpx, jszip, file-saver.
- Charts: recharts. Forms: react-hook-form + zod. Editor: Monaco.
- Hosting: Firebase App Hosting (`apphosting.yaml`, `maxInstances`) or Vercel; Firestore rules in `firestore.rules`; CORS for Storage in `cors.json`.
- Auth: Firebase Auth; all cadastral collections require a signed-in user; user-private data under `/users/{uid}`.
