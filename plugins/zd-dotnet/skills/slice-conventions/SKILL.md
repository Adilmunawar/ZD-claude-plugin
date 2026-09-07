---
name: slice-conventions
description: Layout and rules for the .NET minimal-API vertical slices and the Next.js dashboard routes — Endpoints/Models/Service per feature, proc-backed data access, policy gating, rate-limit policies, tests on SQLite, frontend route-local libs. Apply when adding or changing a feature in the dashboard API or web app.
paths: ["apps/api/**", "apps/web/**", "src/*.Api/**", "src/*.Infrastructure/**"]
---

# Vertical slices

```
apps/api/src/<Product>.Api/Features/<Feature>/
  <Feature>Endpoints.cs     MapGroup("/api/v1/<feature>") · .RequireAuthorization("<policy>") · .RequireRateLimiting("<policy>") where heavy
  <Feature>Models.cs        request/response records; numbers-from-strings where the DB stores numerics as nvarchar
  <Feature>Service.cs       use-cases over an I<Feature>Data interface
apps/api/src/<Product>.Infrastructure/Procedures/   SqlServer<Feature>Data: proc calls, column names verbatim from the legacy proc
apps/api/src/<Product>.Gateway/                     YARP front door; TLS from the Windows cert store; forwarded headers trusted from loopback only
apps/api/tests/<Product>.Tests/                     xUnit; SQLite provider + WebApplicationFactory; UseLocalSettings=false so tests can never reach a real server
apps/web/app/(app)/<route>/                         page.tsx · _components/ · _lib/ (route-local math + *.test.ts with vitest)
apps/web/lib/                                       shared helpers: area.ts (the /8 rule, once), terminology, crop-auth, gee/
```

Rules
- One feature = one folder; a proc that returns several result sets stays one data method.
- Scope every read by the signed-in user's vendor/mills; the AI tools re-apply the caller's scope on top of whatever the model asked for.
- Rate-limit policies exist for auth, auth-refresh, admin-heavy, dashboard-refresh and the ORS proxy; new heavy endpoints get a policy, not an exception.
- Uploads answer `422` with a report, never a raw `500`; files are written before the transaction and deleted after commit.
- Frontend: no new dependencies without a decision; exports are CSV unless a server endpoint exists; percentages computed client-side are labelled as such; `NEXT_PUBLIC_API_BASE` is baked at build time.
- `dotnet build` treats warnings as errors; `Directory.Packages.props` pins versions centrally.
