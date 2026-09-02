# <Project name>

<Two sentences: what this repository is, who uses it, where it runs.>

## Stack
- Runtime: <Node 20 / Python 3.11 / .NET 8 / Expo SDK 5x>
- Framework: <Next.js 14 App Router / Flask / ASP.NET Core / expo-router>
- Data: <Firestore + Storage / PostGIS / GeoPackage in data/>
- External: <Earth Engine project via EE_BASE64_KEY / Hugging Face Space / API base URL>
- Hosting: <Firebase App Hosting / Vercel / HF Spaces / VM / AWS ECS>

## Run
```
<install>
<dev server>
<typecheck / tests>
```

## Data and layout
- Storage CRS EPSG:4326; area computed in EPSG:32642/32643.
- Working directories: `working_directory/{input,output}` for pipeline stages; `deliverables/<client>/` for outputs.

## Conventions
- Follow the zd-* skills (stack-detect, postgis-conventions, pakistan-crs, agis-architecture, app-rules as applicable).
- Secrets only via environment variables or the platform's secret store; `.env`, key files and tokens are never committed.
- Deliverables must pass `/zd-gis:qa-vector` before hand-over.

## Don'ts
- No `DROP`/`TRUNCATE`/recursive delete without a backup and explicit approval.
- No renaming of server DTO fields on the client.
- No hardcoded fallback credentials.
