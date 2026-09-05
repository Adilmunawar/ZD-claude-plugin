---
name: cadastral-schema
paths: ["src/firebase/**", "src/types/**", "firestore.rules", "docs/backend.json"]
description: Mauza/Parcel Firestore model, size limits, geohash, geometry storage, rule constraints.
---

# Cadastral schema (Firestore + Storage)

**Mauzas/{mauzaId}** — searchable metadata only. Required: `id`, `name`, `tehsil`, `district`, `hudbust_no`, `boundingBox [W,S,E,N]`, `geometryUrl`, `totalParcels`, `createdAt`. Optional: `parcelsGeometryUrl`, `totalAreaAcres`, `isCompressedInFirestore`, `assignedStatus`, `groupName`, `customMauzaId`.
**Parcels/{parcelId}** — `id`, `mauza_ref`, `plot_no`, `land_use`, `area_sqm`, `centroid` (GeoPoint), `geohash`, `geometryUrl`, plus attributes from the source DBF.

Rules of thumb
- Geometry never lives in the document body except as gzip+base64 under 1 MB (`isCompressedInFirestore=true`, compressed via `compressJsonToBase64`). Larger → Cloud Storage minified GeoJSON, referenced by URL.
- Firestore document limit is 1 MiB; keep metadata documents under 100 KB so listing queries stay cheap.
- `geohash` (geofire-common) on every parcel and mauza centroid enables radius queries; always set it on write.
- Ids: `mauzaId = name.replace(/[^a-zA-Z0-9-_.]/g, '_')`; parcel ids are stable across re-uploads (derive from `customMauzaId + plot_no`), so re-import updates rather than duplicates.
- `firestore.rules` validate field presence and types on write; a write that omits `geometryUrl`, `geohash` or `area_sqm` is rejected — mirror any schema change in the rules and in `docs/backend.json`.
- Units: `area_sqm` in documents; acres only for display (`× 0.000247105`).
- Batch uploads: chunk to ≤ 500 writes per batch; show progress; make re-runs idempotent.
