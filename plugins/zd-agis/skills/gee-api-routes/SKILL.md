---
name: gee-api-routes
paths: ["src/app/api/**", "src/lib/geeCore.ts"]
description: Server-side Earth Engine in Next.js API routes: init once, promisified evaluate, layers, palettes, tile URLs, validation, timeouts.
---

- **Init once.** `initGEE()` guards with a module-level flag; credentials from `EE_BASE64_KEY` (base64 JSON); normalise `private_key` newlines. No fallback credentials in code — throw a descriptive error instead.
- **Promisify.** `const evaluate = (o) => new Promise((res, rej) => o.evaluate((v, e) => e ? rej(e) : res(v)))`; run independent reductions with `Promise.all`.
- **Validate input.** Body must contain a GeoJSON geometry; reject > 5 MB or > 10 000 vertices (simplify client-side first). Cap `range` months and date spans.
- **Layers.** Build in `geeCore.ts`: S2 SR harmonized cloud-masked median, indices (NDVI NDMI NDRE EVI SAVI GNDVI NDTI MSAVI2 CIRE NDWI MNDWI BSI NDBI NBR NDCI NDSI), classification image, S1 VV/VH. Reuse the shared `visParams` table so palettes match the legend component.
- **Tiles.** `getMapUrl(image, vis)` → `ee.data.getMapId` → `{z}/{x}/{y}` template; cache per (layer, date range) for the request lifetime; tile URLs expire — do not persist them.
- **Reductions.** `scale: 10, maxPixels: 1e9, tileScale: 4+` for parcel-size geometries; `bestEffort` only for previews.
- **Errors.** Return `{ error }` with 400 for bad input, 502 for EE failures; log the EE message server-side only.
- **Timeouts.** App Hosting/Vercel functions have execution limits; long jobs go to the inference backend with a job id.
