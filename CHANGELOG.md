# Changelog

## 0.3.0 — 2026-09-05
- **One-line install**: new `zaraat-dost` bundle plugin that depends on all modules (`^0.3.0`); `install.sh` / `install.ps1` one-liners; `/zaraat-dost:help`, `/zaraat-dost:doctor`, `/zaraat-dost:setup`; session banner.
- Marketplace: display names, tags, bundle listed first, `$schema`.
- Docs: `docs/INSTALL.md`, `docs/COMMANDS.md` (generated), `docs/TROUBLESHOOTING.md`, `docs/ARCHITECTURE.md`.
- GitHub: issue/PR templates, CODEOWNERS, release workflow (tag → GitHub Release with changelog notes), docs-drift check in CI.
- Modules unchanged functionally; versions aligned to 0.3.0.

## 0.2.0 — 2026-09-04
- New plugins: zd-core (hooks, stack-detect, onboard, handoff, output style), zd-vector, zd-ml, zd-gee, zd-reports.
- zd-gis: db-analyst agent + study-db skill (Postgres/PostGIS, SQL Server, MySQL, GeoPackage), study-dashboard, .NET/EF Core support, geo-data-qa on haiku.
- Templates: project settings with all plugins, Postgres MCP example, CLAUDE.md.
- CI: Node hook syntax check, optional `claude plugin validate`.

## 0.1.0 — 2026-09-04
- Initial zd-gis plugin and marketplace scaffold.
