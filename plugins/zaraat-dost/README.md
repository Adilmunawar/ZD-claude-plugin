# zaraat-dost

Meta-plugin: depends on every module so one command installs the toolkit.

```
/plugin marketplace add adilmunawar/ZD-claude-plugin
/plugin install zaraat-dost@zaraatdost
```

| Component | Purpose |
|---|---|
| `/zaraat-dost:help` | Command and agent reference |
| `/zaraat-dost:doctor` | Environment, modules, secrets hygiene, repo standards, toolkit version |
| `/zaraat-dost:setup` | Configure a repository for the team |
| `/zaraat-dost:upgrade` | Update marketplace and modules, show changelog, apply migration notes |
| `/zaraat-dost:workstation` | Set up an engineer's machine (`scripts/setup-workstation.{ps1,sh}`) |
| `/zaraat-dost:standards` | Apply `.editorconfig`, `.gitattributes`, pre-commit, VS Code, PR template |
| SessionStart hooks | One-line banner; daily update check (3 s timeout, offline-safe) |
