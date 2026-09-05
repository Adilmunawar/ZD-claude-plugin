# Installation

## Requirements
- [Claude Code](https://docs.claude.com/en/docs/claude-code/overview) (any recent version; plugin dependencies need v2.1.110+)
- Node.js 18+ (ships with Claude Code's requirements; used by the guard hooks)
- Optional per module: Python 3.10+ with GeoPandas/rasterio/shapely 2, GDAL CLI, .NET SDK 8+, `psql`/`sqlcmd`, `earthengine-api`

## Option A — one command (recommended)

macOS / Linux / WSL:
```bash
bash <(curl -fsSL https://raw.githubusercontent.com/adilmunawar/ZD-claude-plugin/main/install.sh)
```
Windows PowerShell:
```powershell
irm https://raw.githubusercontent.com/adilmunawar/ZD-claude-plugin/main/install.ps1 | iex
```
Installs the `zaraat-dost` bundle, which pulls in every module. Pass a module name to install only one: `install.sh zd-vector`.

## Option B — inside Claude Code
```
/plugin marketplace add adilmunawar/ZD-claude-plugin
/plugin install zaraat-dost@zaraatdost
```
The install view asks for a scope — pick **user** to have it in every project.

## Option C — per-repository, zero commands for teammates
Run `/zaraat-dost:setup` once in the repo (or copy `templates/.claude/settings.json` to `.claude/settings.json`) and commit. Anyone who opens the repo and trusts the folder gets the marketplace and bundle automatically.

## New machine
Run `/zaraat-dost:workstation` (or `plugins/zaraat-dost/scripts/setup-workstation.ps1` / `.sh` directly) to install Git, Node, Python GIS stack, .NET SDK, GitHub CLI, VS Code extensions and Claude Code.

## Verify
```
/zaraat-dost:doctor
/zaraat-dost:help
```

## Update
A session-start check tells you within a day when a newer release exists. Then:
```
/zaraat-dost:upgrade
```
or manually:
```
/plugin marketplace update zaraatdost
/plugin update zaraat-dost@zaraatdost
```
Modules are version-pinned by the bundle (`^0.6.0`); a new bundle release moves them together.

## Uninstall
`/plugin uninstall zaraat-dost@zaraatdost` (modules remain unless removed too) or `/plugin marketplace remove zaraatdost` to remove everything.

## Private fork
Fork the repo private, change `adilmunawar/ZD-claude-plugin` in `marketplace.json`, `templates/`, `install.*` and the READMEs, and have teammates run `gh auth login` before installing. See TROUBLESHOOTING for background-update auth.
