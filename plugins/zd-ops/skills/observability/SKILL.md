---
name: observability
description: Logging, metrics and alert conventions per service. Apply when adding logging, telemetry or alerts.
---

- **Logs**: JSON lines with `ts, level, service, request_id, user_id (hashed), msg, extra`; no PII, tokens or bodies. Next.js: server-side only; Flask: `logging` with the job id; .NET: `ILogger` scopes with request id; Expo: local ring buffer, uploaded only with consent.
- **Metrics** (minimum): request rate, error rate, p95 latency per route; job queue depth and job duration; Earth Engine calls and failures per hour; Space memory; Firestore read/write counts; app crash-free sessions.
- **Alerts**: 5xx rate > 2 % for 5 min; `/health` failing 3×; job failures > 20 % in an hour; Space memory > 85 %; EE quota errors; Expo crash rate spike. Each alert links to the runbook section.
- **Correlation**: pass `x-request-id` from the dashboard through the proxy to the backend; include the job id in every log line for a job.
- **Retention**: logs 30 days, metrics 13 months, incident docs forever.
