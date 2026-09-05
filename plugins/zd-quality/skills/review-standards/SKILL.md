---
name: review-standards
description: Merge criteria per stack (TypeScript/Next.js, Python, .NET, Expo) plus cross-cutting rules on secrets, contracts, migrations, tests, CRS. Apply during code review or before a PR.
---

Cross-cutting
- No credentials, project ids or hostnames in code; config by environment name.
- Client/server contract changes land on both sides in one PR or behind a flag; DTO names verbatim.
- Database changes ship as migrations; additive-only unless the release note says otherwise.
- Every bug fix adds the test that would have caught it. Every new command/script has a `--dry-run` or a smoke test.
- CRS stated wherever geometry is created or transformed; area never computed in EPSG:4326.

TypeScript / Next.js
- `npm run typecheck` and `npm run lint` clean; no `any` in exported types; server-only secrets never `NEXT_PUBLIC_`.
- API routes validate input (zod) and cap payload/geometry size; errors mapped to 4xx/5xx without stack traces.
- Heavy libraries dynamically imported; map components `ssr:false`; long work in workers or the backend.

Python (pipeline, Flask)
- Stage constants documented; paths relative to `working_directory`; resumable loops; counts logged per stage.
- No bare `except:`; explicit dtypes on read; `make_valid` before write; `to_crs` vs `set_crs` used correctly.
- Flask: request size limits, timeouts, `/health` cheap, job state survives restarts or the UI handles loss.

.NET
- `dotnet build` warnings as errors on new code; async all the way; `CancellationToken` on IO; EF Core queries projected (no `ToList()` before `Where`); spatial indexes declared; secrets via user-secrets / SSM.

Expo
- Strings through `Txt` and all language tables; logical start/end; tokens in secure store; formatters from `src/lib/format.ts`; tests for any new rule.
