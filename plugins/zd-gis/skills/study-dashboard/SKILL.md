---
name: study-dashboard
description: Audit an existing GIS dashboard — pages, layers, data sources, endpoints, performance and UX issues — and write docs/DASHBOARD.md. Use when taking over a dashboard or before a redesign.
disable-model-invocation: true
---

Run `stack-detect`, then map the dashboard:

1. **Pages/routes** — list each page/route, its purpose, and the component/controller behind it.
2. **Layers** — for each map layer: source (table/view/tile URL/file), CRS, simplification, style config location, visibility rules.
3. **Endpoints** — every API route the map calls; payload sizes (measure with curl or devtools), caching headers, auth.
4. **Data freshness** — how and when each layer updates (cron, ingest job, manual).
5. **Performance** — largest responses, slowest queries (`EXPLAIN`), missing indexes, per-request file reads, unbounded feature fetches.
6. **UX** — legend consistency, loading states, error handling, mobile layout, popup content, filter latency.
7. Write `docs/DASHBOARD.md` with a layer inventory table, endpoint table, and a prioritised fix list (impact × effort). Read-only unless the user asks for fixes.
