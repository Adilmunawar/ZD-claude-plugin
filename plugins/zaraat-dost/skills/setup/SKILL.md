---
name: setup
disable-model-invocation: true
description: Configure the current repository for the team: .claude/settings.json, .gitignore entries, CLAUDE.md.
---

1. Show the user what will be created/changed, then proceed only on confirmation:
   - `.claude/settings.json` — merge (don't overwrite) the team template: `extraKnownMarketplaces.zaraatdost` → `github: adilmunawar/ZD-claude-plugin`, `enabledPlugins` for `zaraat-dost@zaraatdost`, and `permissions.deny` for secrets files and destructive commands.
   - `.gitignore` — ensure `.env`, `.env.*`, `gee.json`, `*service-account*.json`, `*.pem`, `*.pfx`, `appsettings.Production.json`, `deliverables/**/*.zip`.
   - `CLAUDE.md` — run `/zd-core:onboard` if missing or stale.
2. Run `/zaraat-dost:doctor`.
3. Print the three commands a new teammate needs: trust the folder, `/plugin marketplace update zaraatdost`, `/zaraat-dost:help`.
