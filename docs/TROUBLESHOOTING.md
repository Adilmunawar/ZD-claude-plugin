# Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| `SSH authentication failed` / `Permission denied (publickey)` when adding the marketplace | Claude Code cloned `owner/repo` over SSH and no key is registered | Use the HTTPS URL: `claude plugin marketplace add https://github.com/Adilmunawar/ZD-claude-plugin.git` (the installers do this by default) |
| `plugin-not-found` after install | Marketplace not refreshed | `/plugin marketplace update zaraatdost` then reinstall |
| Bundle installed but a module missing | Dependency resolution needs Claude Code ≥ 2.1.110 | Update Claude Code, or install the module directly: `/plugin install zd-gis@zaraatdost` |
| `npm error 404 @adilmunawar/zd-tools is not in this registry` | The package is on GitHub Packages, not npmjs | Install from the release tarball: `npm i -g https://github.com/Adilmunawar/ZD-claude-plugin/releases/download/v7.3.4/adilmunawar-zd-tools-7.3.4.tgz` |
| PowerShell window closes while installing | An old installer called `exit` under `iex` | Fixed in 7.3.1; run `irm … | iex` again, or the three manual commands in INSTALL.md |
| `claude plugin list` says no plugins after an install attempt | The earlier attempt failed before installing | Run the installer again; it now reports each step |
| Hooks don't run on Windows | `node` not on PATH for the shell Claude Code uses | Install Node 18+ system-wide; restart terminal; `/hooks` to confirm |
| "blocked destructive SQL" when you meant it | zd-core guard | Confirm a backup, then run the command yourself in a terminal, or temporarily disable the hook via `/hooks` |
| `Run /reload-plugins to activate` | Normal after install | Run it |
| Private fork: auto-update fails in background | Background pulls skip credential helpers | `gh auth setup-git`; set `CLAUDE_CODE_PLUGIN_KEEP_MARKETPLACE_ON_FAILURE=1`; or update manually with `/plugin marketplace update zaraatdost` |
| Git clone times out | Slow network / large repo | `export CLAUDE_CODE_PLUGIN_GIT_TIMEOUT_MS=300000` |
| Skill command not found | Skills are namespaced | Use `/zd-gis:new-layer`, not `/new-layer`; `/zaraat-dost:help` lists all |
| `guard-write` blocks a file that is not a secret | A string matched a credential pattern | Reference the value from an environment variable, or use an obvious placeholder (`xxxxxxxx`, `<token>`); patterns are in `zd-core/scripts/patterns.js` |
| `secrets-audit --history` is slow | Large history | Run without `--history` for a quick check; use `--history` in CI only |
| Agent picked wrong stack | No CLAUDE.md | `/zd-core:onboard`, then re-run |
| `db-analyst` can't connect | No connection info discoverable | Set `DATABASE_URL` / `ConnectionStrings__Default` in the environment (never in a file Claude writes) |
| GeoPandas import error | Env not activated | Activate the project's conda/venv before starting Claude Code |
