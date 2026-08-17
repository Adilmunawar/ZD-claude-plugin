---
name: workstation
disable-model-invocation: true
argument-hint: "[--dry-run]"
description: Set up or verify an engineer's machine: Git, Node, Python GIS stack, GDAL, .NET SDK, GitHub CLI, VS Code extensions, Claude Code.
effort: low
---

1. Detect OS. Run `scripts/setup-workstation.ps1` (Windows, winget) or `scripts/setup-workstation.sh` (macOS brew / Debian apt) from this plugin with `-WhatIf`/`--dry-run` first; show what would be installed; proceed on approval.
2. Python GIS stack goes in a conda/mamba env `zd` (geopandas, rasterio, shapely, pyproj, gdal) — never system pip.
3. Configure git: `user.name`, `user.email`, `core.autocrlf` (input on macOS/Linux, true on Windows), `pull.rebase true`, `init.defaultBranch main`.
4. Install the VS Code extensions from `templates/repo-standards/.vscode/extensions.json`.
5. `gh auth login`, then `/zaraat-dost:doctor`. Report a table of tool → version → ok.
