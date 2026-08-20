---
name: stack-detect
description: Detect language, framework, database, spatial libraries and tile stack from repo files before DB, dashboard or deploy work. Python, .NET, Node/Next.js, Expo.
---

# Stack detection

Scan the repo (respect .gitignore; skip node_modules, .venv, bin, obj) and fill this table. State "none found" explicitly — never guess.

| Signal | Files to check | What it tells you |
|---|---|---|
| Language | `*.csproj`, `*.sln`, `global.json` → .NET; `pyproject.toml`, `requirements.txt`, `environment.yml` → Python; `package.json` → Node/TS; `go.mod`; `Cargo.toml` | primary + secondary languages |
| .NET web | `Program.cs`/`Startup.cs` with `AddControllers`/`MapRazorPages`/`AddServerSideBlazor`; `*.razor`; `*.cshtml` | ASP.NET Core API / MVC / Razor Pages / Blazor |
| .NET data | `Microsoft.EntityFrameworkCore.*` package refs, `Migrations/` folder, `DbContext` subclasses, `NetTopologySuite` refs, `appsettings*.json` `ConnectionStrings` | EF Core provider (Npgsql / SqlServer / Sqlite), spatial enabled or not |
| Python web | `streamlit`, `dash`, `flask`, `fastapi`, `django` in deps; `manage.py`; `app.py` | dashboard framework |
| JS map | `leaflet`, `maplibre-gl`, `mapbox-gl`, `openlayers`, `deck.gl`, `cesium` in `package.json`; `<script src=...leaflet...>` in HTML/cshtml | map client |
| Database | `docker-compose*.yml` services (postgis/postgres/mssql/mysql), `DATABASE_URL`/`PG*`/`ConnectionStrings` in `.env*` or `appsettings*.json` (read keys only, never print secrets), `*.gpkg`, `*.sqlite`, `*.mdf` | engine + how to connect |
| Spatial ext | `CREATE EXTENSION postgis` in migrations; `geometry(` / `geography(` columns; `[Column(TypeName = "geometry")]`; `UseNetTopologySuite()` | PostGIS / SQL Server spatial / SpatiaLite |
| Tile/feature service | `geoserver`, `pg_tileserv`, `pg_featureserv`, `martin`, `titiler`, `qgis_server`, `tegola` in compose/config; `/tiles/{z}/{x}/{y}` routes | how layers reach the map |
| ORM/migrations | `alembic/`, `Migrations/`, `prisma/`, `knex`, `flyway`, `dbmate` | how schema changes are applied |
| Tests/CI | `tests/`, `*.Tests.csproj`, `.github/workflows`, `azure-pipelines.yml`, `Jenkinsfile` | how to verify changes |
| Run | `Makefile`, `justfile`, `package.json` scripts, `launchSettings.json`, `Dockerfile`, README "Run" section | exact run command |

Output a **Stack summary** block (≤ 12 lines) before doing any work. Then adapt:

- **.NET**: use `dotnet build`/`dotnet test`/`dotnet ef migrations add`; spatial via NetTopologySuite (`Npgsql.EntityFrameworkCore.PostgreSQL.NetTopologySuite` or `Microsoft.EntityFrameworkCore.SqlServer.NetTopologySuite`); config from `appsettings.{Environment}.json` + user-secrets, never hardcoded.
- **Python**: respect the existing env manager (conda/venv/poetry/uv); don't introduce a second one.
- **Unknown/empty repo**: say so and ask which stack to scaffold rather than picking one.
