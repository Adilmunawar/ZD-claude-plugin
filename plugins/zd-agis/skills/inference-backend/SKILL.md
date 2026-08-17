---
name: inference-backend
paths: ["hf_space_backend/**", "src/app/api/predict/**", "src/app/api/job_*/**"]
description: Flask inference backend on Hugging Face Spaces: job lifecycle, endpoints, telemetry, model loading, limits, proxy routes.
---

Endpoints: `GET /health`, `GET /api/telemetry`, `POST /predict` (multipart zip of parcels + `model_type`, `target_year`) → `{ job_id }`, `GET /job_status/<id>` → `{ status, progress, log, summary, error }`, `GET /job_download/<id>` → GeoJSON, `GET /job_timeseries/<id>/<parcel_uid>`.

Job lifecycle: `queued → running (progress 0–100) → done | failed`; `ThreadPoolExecutor(MAX_WORKERS=4)`, `waiting_jobs` list under a lock, temp dir per job, `gc.collect()` in `finally`. Status kept in memory — a Space restart loses jobs; the UI must handle 404 on `job_status` by offering re-submit.

Backend rules
- Auth to the Space is a Bearer `HF_TOKEN` added by the Next.js proxy; the browser never holds it. Proxy streams the multipart body (`duplex: 'half'`) to avoid buffering.
- Earth Engine in the backend authenticates from a base64 or file key in Space secrets (`EE_BASE64_KEY`); normalise `private_key` newlines.
- Models via `hf_hub_download` at startup, cached in the container; log the model version in every job summary.
- Post-processing (land-use rules, temporal continuity, seasonal plan) runs after prediction; document each rule change in the summary.
- Memory: free-tier Spaces are ~16 GB RAM; process parcels in chunks of `CHUNK_SIZE=400` and never load all imagery. Telemetry endpoint exposes CPU/RAM/network for the dashboard's telemetry page.
- Health: `/health` must return within 1 s without touching EE.
