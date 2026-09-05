# zd-gis

Spatial database and dashboard engineering — stack-agnostic (Python, .NET, JS map clients).

| Component | Purpose |
|---|---|
| `gis-dashboard-manager` (agent) | Full-access engineer: DB, ETL, layers, dashboard bugs & performance |
| `db-analyst` (agent) | Read-only: studies any DB and writes `docs/DATABASE.md` with ER diagram |
| `geo-data-qa` (agent, haiku) | Read-only QA gate for vector files |
| `/zd-gis:study-dashboard` | Audit a dashboard → `docs/DASHBOARD.md` |
| `/zd-gis:new-layer` | Publish a layer end-to-end |
| `/zd-gis:export-deliverable` | Client-ready shapefile + GeoJSON |
| `/zd-gis:qa-vector` | Validate a vector file |
| `study-db`, `postgis-conventions`, `pakistan-crs` (auto) | Background knowledge |

Optional: add a Postgres MCP server to your project's `.mcp.json` so Claude can query directly — see the root README.
